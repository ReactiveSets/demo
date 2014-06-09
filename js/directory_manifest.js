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
  var xs      = require( 'excess/lib/pipelet.js' )
    , path    = require( 'path' )
    , fs      = require(  'fs'  )
    , XS      = xs.XS
    , log     = XS.log
    , Set     = XS.Set
    , Options = XS.Options
    
    , uuid_v4  = XS.uuid_v4
    , has_more = Options.has_more
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
    Set.call( this, [], options );
    
    this._directories_manifest = null;
    this._manifest_waiters     = [];
    
    return this;
  } // Directory_Manifest()
  
  /* -------------------------------------------------------------------------------------------
     .directory_manifest( options )
  */
  Set.Build( 'directory_manifest', Directory_Manifest, function( Super ) { return {
    // create file .manifest 
    _create_file: function( filepath ) {
      var content = { id: uuid_v4(), flow: 'manifest' };
      
      fs.writeFile( filepath + '/.manifest', JSON.stringify( content ), function( err ) {
        if( err ) return this._error( '_create_file', log.s( err ) );
        
        de&&ug( '_create_file(), file created, content: ' + log.s( content ) );
      } );
      
      var waiters = this._manifest_waiters, len = waiters.length;
      
      if( len ) {
        for( var i = -1; ++i < len; ) waiters[ i ].call( this );
        
        this._manifest_waiters = [];
      }
      
      return this;
    }, // _create_file()
    
    // read the content of .manifest file
    _read_file: function( filepath ) {
      fs.readFile( filepath, function( err, content ) {
        if( err ) return this._error( '_read_file', log.s( err ) );
      } );
      
      return this;
    }, // _read_file()
    
    _wait_for_manifest: function( handler ) {
      this._manifest_waiters.push( handler );
      
      de&&ug( '_wait_for_manifest(), manifest_waiters: ' + this._manifest_waiters.length );
      
      return this;
    }, // _wait_for_manifest()
    
    _add: function( entries, options ) {
      var l = entries.length;
      
      if( ! l ) return this;
      
      var that = this;
      
      var manifests = this._directories_manifest;
      
      console.log( entries );
      
      for( var i = -1; ++i < l; ) {
        var entry      = entries[ i ]
          , entry_path = entry.path
          , dirname    = entry.type === 'directory' ? entry_path : path.dirname( entry_path )
          , entry_name = path.basename( entry_path )
          , found      = false
        ;
        
        if( manifests[ dirname ] ) {
          var value = extend( {}, manifests[ dirname ], entry );
          
          this.__emit_add( [ value ] );
        } else {
          if( entry_name !== '.manifest' ) {
            this._wait_for_manifest( function() { that._add( [ entry ], options ); } );
          } else {
            fs.readFile( entry_path, function( err, content ) {
              if( err ) return that._error( '_read_file', log.s( err ) );
              
              try {
                content = JSON.parse( content );
                
                console.log( 'manifest content: ', content );
                
                manifests[ dirname ] = content;
              } catch ( e ) {
                de&&ug( 'error: ' + e );
              }
            } );
            
            found = true;
          }
        }
      } // for()
      
      // if( ! found ) this._create_file(  );
      
      return this;
    }, // _add()
    
    _remove: function( entries, options ) {
      var l = entries.length;
      
      if( ! l ) return this;
      
      return this;
    } // _remove()
  }; } ); // Directory_Manifest instance methods
  
  de&&ug( "module loaded" );
} ( this ); // directory_manifest.js
