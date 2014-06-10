/*  directory_manifest.js
    
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
  var xs           = require( 'excess/lib/pipelet.js' )
    , path         = require( 'path' )
    , fs           = require(  'fs'  )
    , EventEmitter = require( 'events' ).EventEmitter
    
    , XS           = xs.XS
    , log          = XS.log
    , File_Set     = XS.File_Set
    
    , uuid_v4      = XS.uuid_v4
    , extend_2     = XS.extend_2
  ;
  
  /* -------------------------------------------------------------------------------------------
     de&&ug()
  */
  var de = true;
  
  function ug( m ) {
    log( "xs directory manifest, " + m );
  } // ug()
  
  /* -------------------------------------------------------------------------------------------
     Directory_Manifest( options )
  */
  function Directory_Manifest( options ) {
    File_Set.call( this, options );
    
    console.log( 'here key: ', options );
    
    this._directories_manifest = {};
    
    return this;
  } // Directory_Manifest()
  
  /* -------------------------------------------------------------------------------------------
     .directory_manifest( options )
  */
  File_Set.Build( 'directory_manifest', Directory_Manifest, function( Super ) { return {
    _add: function( entries, options ) {
      var l = entries.length;
      
      if( ! l ) return this;
      
      var that = this;
      
      var emitter   = new EventEmitter()
        , manifests = this._directories_manifest
        , that      = this
      ;
      
      for( var i = -1; ++i < l; ) _add( entries[ i ] );
      
      return this;
      
      function _add( entry ) {
        var entry_path = that._get_path( entry.path )
          , dirname    = entry.type === 'directory' ? entry_path : path.dirname( entry_path )
        ;
        
        switch( typeof manifests[ dirname ] ) {
          case 'undefined' :
            if( fs.existsSync( dirname + '/.manifest.json' ) ) {
              manifests[ dirname ] = function( emit_value ) {
                emitter.on( dirname + '/__read__', emit_value );
              };
              
              read_file( dirname );
            } else {
              manifests[ dirname ] = function( emit_value ) {
                emitter.on( dirname + '/__write__', emit_value );
              };
              
              create_file( dirname );
            }
          
          case 'function' :
            manifests[ dirname ]( emit_value );
          break;
          
          case 'object' :
            emit_value( manifests[ dirname ] );
          break;
        } // switch()
        
        // return;
        
        function emit_value( value ) {
          that.__emit_add( [ extend_2( { manifest: value }, entry ) ] );
        } // emit_value()
      } // _add()
      
      function create_file( dirname ) {
        var content = { id: uuid_v4() };
        
        fs.writeFile( dirname + '/.manifest.json', JSON.stringify( content ), function( err ) {
          if( err ) return that._error( 'create_file', log.s( err ) );
          
          manifests[ dirname ] = content;
          
          emitter.emit( dirname + '/__write__', content );
        } );
      } // create_file
      
      function read_file( dirname ) {
        fs.readFile( dirname + '/.manifest.json', function( err, content ) {
          if( err ) return that._error( 'read_file', log.s( err ) );
          
          try {
            content = JSON.parse( content );
            
            manifests[ dirname ] = content;
            
            emitter.emit( dirname + '/__read__', content );
          } catch ( e ) {
            de&&ug( 'error: ' + e );
          }
        } );
      } // read_file()
    }, // _add()
    
    _remove: function( entries, options ) {
      var l = entries.length;
      
      if( ! l ) return this;
      
      var manifests = this._directories_manifest
        , that      = this
      ;
      
      for( var i = -1; ++i < l; ) _remove( entries[ i ] );
      
      return this;
      
      function _remove( entry ) {
        var entry_path = that._get_path( entry.path )
          , dirname    = entry.type === 'directory' ? entry_path : path.dirname( entry_path )
        ;
        
        switch( typeof manifests[ dirname ] ) {
          case 'undefined' :
            de&&ug( '.manifest.json not found, dirname: ' + dirname );
          break;
          
          case 'function' :
            manifests[ dirname ]( remove_value );
          break;
          
          case 'object' :
            remove_value( manifests[ dirname ] );
          break;
        } // switch()
        
        function remove_value( value ) {
          that.__emit_remove( [ extend_2( { manifest: value }, entry ) ] );
        } // remove_value()
      } // _remove()
      
    } // _remove()
  }; } ); // Directory_Manifest instance methods
  
  de&&ug( "module loaded" );
} ( this ); // directory_manifest.js
