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
     
     Add a file .manifest.json for each input directory, and emit a value with it content
  */
  function Directory_Manifest( options ) {
    File_Set.call( this, options );
    
    this._directories_manifest = {};
    
    return this;
  } // Directory_Manifest()
  
  /* -------------------------------------------------------------------------------------------
     .directory_manifest( options )
  */
  File_Set.Build( 'directory_manifest', Directory_Manifest, function( Super ) { return {
    _add_value: function( transaction, value ) {
      var that          = this
        , entry_path    = this._get_path( value.path )
        , dirname       = value.type === 'directory' ? entry_path : path.dirname( entry_path )
        , manifest_path = dirname + '/.manifest.json'
        , manifests     = this._directories_manifest
      ;
      
      fs.exists( manifest_path, function( exists ) {
        exists ? read_file( manifest_path, value ) : create_file( manifest_path, value );
      } );
      
      return this;
      
      function create_file( manifest_path, value ) {
        var content = { id: uuid_v4() };
        
        fs.writeFile( manifest_path, JSON.stringify( content ), function( err ) {
          if( err ) return error( '_add(), fs.writeFile(): Cannot create file .manifest.json, path: ' + manifest_path );
          
          de&&ug( '_add(), .manifest.json created, content: ' + log.s( content ) + ', path: ' + manifest_path );
          
          emit_value( extend_2( { manifest: content }, value ) );
          
          manifests[ manifest_path ] = content;
        } );
      } // create_file
      
      function read_file( manifest_path, value ) {
        fs.readFile( manifest_path, function( err, content ) {
          if( err ) return error( '_add(), fs.readFile(): Cannot read file .manifest.json, path: ' + manifest_path );
          
          try {
            de&&ug( '_add(), read .manifest.json, content: ' + content + ', path: ' + manifest_path );
            
            content = JSON.parse( content );
            
            emit_value( extend_2( { manifest: content }, value ) );
            
            manifests[ manifest_path ] = content;
          } catch( e ) {
            error( '_add(), fs.readFile(): Cannot parse JSON object'
              + ', error: '   + log.s( e ) 
              + ', content: ' + log.s( content ) 
              + ', path: '    + manifest_path
            );
          }
        } );
      } // read_file()
      
      function error( message ) {
        de&&ug( message );
        
        transaction.emit_nothing();
      } // error()
      
      function emit_value( value ) {
        Super._add_value.call( that, transaction, value );
      }
    }, // _add_value()
    
    _remove_value: function( transaction, value ) {
      var entry_path       = this._get_path( value.path )
        , manifest_path    = ( value.type === 'directory' ? entry_path : path.dirname( entry_path ) ) + '/.manifest.json'
        , manifest_content = this._directories_manifest[ manifest_path ]
      ;
      
      if( ! manifest_content ) {
        de&&ug( '_remove_value(), .manifest.json content not found, path: ' + manifest_path );
        
        return transaction.emit_nothing();
      }
      
      Super._remove_value.call( this, transaction, [ extend_2( { manifest: manifest_content }, value ) ] );
      
      return this;
    } // _remove_value()
  }; } ); // Directory_Manifest instance methods
  
  de&&ug( "module loaded" );
} ( this ); // directory_manifest.js
