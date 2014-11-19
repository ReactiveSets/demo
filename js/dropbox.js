/*  dropbox.js
    
    ----
    
    Copyright (C) 2013, 2014, Connected Sets

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
"use strict";

!function( exports ) {
  var XS           = require( 'excess/lib/pipelet.js' ).XS
    , dropbox      = require( 'dbox' )
    , path         = require( 'path' )
    , EventEmitter = require( 'events' ).EventEmitter
  ;
  
  var xs       = XS.xs
    , log      = XS.log
    , extend_2 = XS.extend_2
    , Code     = XS.Code
    , Pipelet  = XS.Pipelet
    , Set      = XS.Set
  ;
  
  /* -------------------------------------------------------------------------------------------
     de&&ug()
  */
  var de = true;
  
  function ug( m ) {
    log( "xs dropbox, " + m );
  } // ug()
  
  /* -------------------------------------------------------------------------------------------
     Dropbox_Public_URLs( options )
     
     Process a dataset of files provided by a watch_directories() on Dropbox folder, and creates
     or returns the shareable links, using 'node-dbox' npm module: https://github.com/sintaxi/node-dbox
     
     At first, the pipelet read the config file to get Dropbox credentials, then it initializes 
     the Dropbox app to access to it API.
     
     See Dropbox API core documentation for details: https://www.dropbox.com/developers/core/docs
     
     At last, it emits to the downstream pipelets the shareable links of the watched files.
     
     Parameters:
       - an optional objects
     
     Installation links:
       - Dropbox for Ubuntu:
           https://www.dropbox.com/install?os=lnx
       
       - Dropbox Command Line Interface ( CLI ):
           http://www.dropboxwiki.com/tips-and-tricks/using-the-official-dropbox-command-line-interface-cli
     
  */
  function Dropbox_Public_URLs( options ) {
    Set.call( this, [], options );
    
    this._dropbox_url_events    = new EventEmitter();
    this._configuration_waiters = [];
    this._output._fetch         = this._fetch;
    this._cache                 = {};
    this._dropbox_client        = null;
    
    var that = this;
    
    xs
      .configuration( options )
      
      .filter( [ { pipelet: 'dropbox_public_urls' } ] )
      
      .greedy()
      
      ._fetch_all( initialize_dropbox )
      
      ._on( 'add', initialize_dropbox )
    ;
    
    return this;
    
    function initialize_dropbox( values ) {
      var value = values[ 0 ];
      
      if( value ) {
        var credentials = value.credentials;
        
        that._dropbox_client = dropbox
          
          .app( { app_key: credentials.clientID, app_secret: credentials.clientSecret } )
          
          .client( credentials.accessToken )
        ;
        
        var waiters = that._configuration_waiters, l = waiters.length;
        
        if ( l ) {
          de&&ug( 'initialize_dropbox(), configuration is ready, calling ' + l + ' waiters' );
          
          for ( var i = -1; ++i < l; ) waiters[ i ].call( that );
          
          this.configuration_waiters = [];
        }
      }
      
    } // initialize_dropbox()
  } // Dropbox_Public_URLs()
  
  /* -------------------------------------------------------------------------------------------
     .dropbox_public_urls( options )
  */
  Set.Build( 'dropbox_public_urls', Dropbox_Public_URLs, function( Super ) { return {
    _fetch: function( receiver ) {
      var cache  = this.pipelet._cache
        , values = []
      ;
      
      for( var key in cache ) {
        var v = cache[ key ];
        
        if( typeof v === 'object' ) values.push( v );
      }
      
      receiver( values, true );
      
      return this;
    }, // _fetch()
    
    _wait_for_configuration: function( handler ) {
      this._configuration_waiters.push( handler );
      
      de&&ug( '_wait_for_configuration(), configuration_waiters: ' + this._configuration_waiters.length );
      
      return this;
    }, // _wait_for_configuration()
    
    _add_value: function( transaction, value ) {
      var client = this._dropbox_client
        , cache  = this._cache
        , that   = this
      ;
      
      if( ! client ) return this._wait_for_configuration( function() { that._add_value( transaction, value ) } );
      
      var dropbox_url_events = this._dropbox_url_events
        , file_path          = value.dropbox_filepath
      ;
      
      switch( typeof cache[ file_path ] ) {
        case 'undefined': // First time file_path is requested, or previously failed
          cache[ file_path ] = function( emit_url ) {
            dropbox_url_events.on( file_path, emit_url );
          };
          
          client.shares( file_path, { short_url: false }, function( status, public_url ) {
            var v;
            
            if ( status === 200 ) {
              de&&ug( 'client.shares(), status: ' + status + ', public url: ' + log.s( public_url ) );
              
              v = extend_2( { uri: public_url.url.replace( 'www.dropbox.com', 'dl.dropboxusercontent.com' ) }, value );
              
              delete v.dropbox_filepath
              
              cache[ file_path ] = v;
            } else {
              de&&ug( 'client.shares(), public url not found, file_path: ' + file_path + ', status: ' + status );
              
              v = null;
              
              delete cache[ file_path ]; // next _add_value of the same path will retry
            }
            
            dropbox_url_events.emit( file_path, v ); // notify all waiting _add_value()
          } );
        // Fall-through to listen on file_path event
        
        case 'function': // client.shares() has not returned yet, wait
          cache[ file_path ]( emit_url );
        break;
        
        case 'object': // client,shares() has returned a valid public url
          emit_url( cache[ file_path ] );
        break;
      } // switch typeof cache[ file_path ]
      
      return this;
      
      function emit_url( value ) {
        de&&ug( 'emit_url(), url : ' + log.s( value ) + ', tid: ' + transaction.get_tid() );
        
        if ( value ) {
          Super._add_value.call( that, transaction, value );
        } else {
          transaction.emit_nothing();
        }
      } // emit_url()
    }, // _add_value()
    
    _remove_value: function( transaction, value ) {
      var dropbox_url_events = this._dropbox_url_events
        , cache              = this._cache
        , file_path          = value.dropbox_filepath
        , that               = this
      ;
      
      if( ! client ) return this._wait_for_configuration( function() { that._remove_value( transaction, value ) } );
      
      switch( typeof cache[ file_path ] ) {
        case 'undefined':
          de&&ug( '_remove_value(), public url not found -> nothing to remove, file_path: ' + file_path );
          
          transaction.emit_nothing();
        break;
        
        case 'function':
          dropbox_url_events.on( file_path, remove_url );
        break;
        
        case 'object':
          remove_url( cache[ file_path ] );
        break;
      } // switch typeof cache[ file_path ]
      
      return this;
      
      function remove_url( value ) {
        de&&ug( 'remove_url(), value : ' + log.s( value ) );
        
        Super._remove_value.call( that, transaction, value );
        
        delete cache[ file_path ];
      } // remove_url()
    } // _remove_value()
  }; } ); // Dropbox_Public_URLs instance methods
  
  /* --------------------------------------------------------------------------
     module exports
  */
  
  de&&ug( "module loaded" );
}( this );

// dropbox.js
