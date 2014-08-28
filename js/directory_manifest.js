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
    _redirect_html_content: function( album_id ) {
      return ''
        + '<html>'
        +   '<head>'
        +     '<meta http-equiv="Refresh" content="1; url=http://castorcad:8080/albums.html#/' + album_id + '" />'
        +   '</head>'
        + '</html>'
      ;
    }, // _redirect_html_content()
    
    _add_value: function( transaction, value ) {
      var that          = this
        , entry_path    = this._get_path( value.path )
        , dirname       = value.type === 'directory' ? entry_path : path.dirname( entry_path )
        , manifest_path = dirname + '/.manifest.json'
        , redirect_path = dirname + '/redirect.html'
        , depth         = value.depth
        
        , manifests     = this._directories_manifest
      ;
      
      // test if .manifest.json exist
      fs.exists( manifest_path, function( manifest_exists ) {
        // if it exist
        if( manifest_exists ) {
          
          read_file( manifest_path, function( content ) {
            emit_value( extend_2( { manifest: content }, value ) );
            
            if( depth === 1 ) html_redirect( redirect_path, that._redirect_html_content( content.id ) );
          } );
        } else {
          var v = { id: uuid_v4() };
          
          write_file( manifest_path, JSON.stringify( v ), function() {
            emit_value( extend_2( { manifest: v }, value ) );
            
            that._directories_manifest[ manifest_path ] = v;
          } );
          
          if( depth === 1 ) html_redirect( redirect_path, that._redirect_html_content( v.id ) );
        } // if() ... else
      } ); // fs.exists( manifest_path )
      
      return this;
      
      function write_file( file_path, file_content, f ) {
        de&&ug( '_add_value(), write_file(), path : ' + file_path );
        
        fs.writeFile( file_path, file_content, function( err ) {
          if( err ) return error( '_add_value(), write_file(): Cannot create file, path: ' + file_path );
          
          de&&ug( '_add_value(), file created, path: ' + file_path );
          
          f && f();
        } ); // fs.writeFile()
      } // write_file()
      
      // html_redirect():
      // create file 'redirect.html' if it not exists
      function html_redirect( file_path, content ) {
        fs.exists( file_path, function( exists ) {
          if( exists ) {
            fs.unlink( file_path, function( err ) {
              if( err ) return error( '_add_value(), fs.unlink(): Cannot delete file, path: ' + file_path );
              
              de&&ug( '_add_value(), fs.unlink(): file deleted, path : ' + file_path );
              
              write_file( file_path, content );
            } ); // fs.unlink();
          } else {
            write_file( file_path, content );
          } // if() ... else
        } ); // fs.exists()
      } // html_redirect()
      
      function read_file( file_path, f ) {
        fs.readFile( file_path, 'utf8', function( err, content ) {
          if( err ) return error( '_add_value(), fs.readFile(): Cannot read file, path: ' + file_path );
          
          try {
            de&&ug( '_add_value(), read file, content: ' + content + ', path: ' + file_path );
            
            content = JSON.parse( content );
            
            f && f( content );
          } catch( e ) {
            error( '_add_value(), fs.readFile(): Cannot parse JSON object'
              + ', error: '   + log.s( e )
              + ', content: ' + log.s( content )
              + ', path: '    + file_path
            );
          } // try ... catch()
        } ) // fs.readFile()
      } // read_file()
      
      function error( message ) {
        de&&ug( message );
        
        transaction.emit_nothing();
      } // error()
      
      function emit_value( value ) {
        Super._add_value.call( that, transaction, value );
      } // emit_value()
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
