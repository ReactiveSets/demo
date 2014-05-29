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
     
     Parameters: an optional objects
  */
  
  function Dropbox_Public_URLs( options ) {
    options.key = [ 'uri' ];
    
    Pipelet.call( this, options );
    
    this._dropbox_url_events    = new EventEmitter();
    this._configuration_waiters = [];
    this._output._fetch         = this._fetch;
    this._cache                 = {};
    
    var that = this;
    
    xs
      .configuration( options )
      
      .filter( [ { pipelet: 'dropbox_public_urls' } ] )
      
      .trace( 'after config filter' )
      
      ._fetch_all( initialize_dropbox )
      
      ._on( 'add', initialize_dropbox )
      
      // .set()
    ;
    
    return this;
    
    function initialize_dropbox( values ) {
      de&&ug( 'initialize_dropbox(), values: ' + log.s( values, null, ' ' ) );
      
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
  Pipelet.Build( 'dropbox_public_urls', Dropbox_Public_URLs, function( Super ) { return {
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
    
    _add: function( files, options ) {
      var l = files.length;
      
      if( ! l ) return this;
      
      var client = this._dropbox_client
        , cache  = this._cache
        , that   = this
      ;
      
      if( ! client ) return this._wait_for_configuration( function() { that._add( files, options ) } )
      
      var dropbox_url_events = this._dropbox_url_events;
      
      for( var i = -1; ++ i < l; ) {
        var file      = files[ i ]
          , file_path = file.path
        ;
        
        switch( typeof cache[ file_path ] ) {
          case 'undefined' :
            cache[ file_path ] = function( emit_url ) {
              dropbox_url_events.on( file_path, emit_url );
            };
            
            client.shares( file_path, { short_url: false }, function( status, public_url ) {
              if( status === 200 ) {
                de&&ug( 'client.shares(), status: ' + status + ', public url: ' + log.s( public_url, null, ' ' ) );
                
                var url   = public_url.url.replace( 'www.dropbox.com', 'dl.dropboxusercontent.com' )
                  , value = extend_2( { uri: url }, file )
                ;
                
                cache[ file_path ] = value;
                
                delete value.path;
                
                dropbox_url_events.emit( file_path, value );
              } else {
                de&&ug( 'client.shares(), public url not found, file_path: ' + file_path );
                
                delete cache[ file_path ];
              }
            } );
          
          case 'function' :
            cache[ file_path ]( emit_url );
          break;
          
          case 'object' :
            emit_url( cache[ file_path ] );
          break;
        } // switch typeof cache[ file_path ]
      } // for()
      
      return this;
      
      function emit_url( value ) {
        de&&ug( 'emit_url(), url : ' + log.s( value ) );
        
        that.__emit_add( [ value ] );
      } // emit_url()
    }, // _add()
    
    _remove: function( files, options ) {
      var l = files.length;
      
      if( ! l ) return this;
      
      var cache = this._cache
        , that  = this
      ;
      
      var dropbox_url_events = this._dropbox_url_events;
      
      for( var i = -1; ++ i < l; ) {
        var file      = files[ i ]
          , file_path = file.path
        ;
        
        switch( typeof cache[ file_path ] ) {
          case 'undefined' :
            de&&ug( '_remove(), public url not found -> nothing to remove, file_path: ' + file_path );
          break;
          
          case 'function' :
            dropbox_url_events.on( file_path, remove_url );
          break;
          
          case 'object' :
            remove_url( cache[ file_path ] );
          break;
        } // switch typeof cache[ file_path ]
      } // for()
      
      return this;
      
      function remove_url( value ) {
        de&&ug( 'remove_url(), value : ' + log.s( value ) );
        
        that.__emit_remove( [ value ] );
        
        delete cache[ file_path ];
      } // remove_url()
    } // _remove()
    
  } } ); // Dropbox_Public_URLs instance methods
  
  /* --------------------------------------------------------------------------
     module exports
  */
  eval( XS.export_code( 'XS', [ 'Dropbox_Public_URLs' ] ) );
  
  de&&ug( "module loaded" );
} ( this ); // dropbox_public_urls.js
