/*  directory_manifest.js
    
    ----
    
    Copyright (C) 2013, 2014, Reactive Sets

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
  var rs           = require( 'toubkal/lib/pipelet.js' )
    , path         = require( 'path' )
    , fs           = require(  'fs'  )
    
    , RS           = rs.RS
    , log          = RS.log
    , File_Set     = RS.File_Set
    
    , uuid_v4      = RS.uuid_v4
    , extend_2     = RS.extend_2
  ;
  
  /* -------------------------------------------------------------------------------------------
     de&&ug()
  */
  var de = true;
  
  function ug( m ) {
    log( "rs directory manifest, " + m );
  } // ug()
  
  /* -------------------------------------------------------------------------------------------
     Directory_Manifest( redirect_url, options )
     
     Create files :
       - .manifest.json for each input directory, and emit a value with it content
       - redirect.html for the first directory, redirecting to the client photo album
     
     Parameters :
       - redirect_url : (String) the redirect URL
  */
  function Directory_Manifest( redirect_url, options ) {
    File_Set.call( this, options );
    
    this._redirect_url         = redirect_url;
    this._directories_manifest = {};
    
    return this;
  } // Directory_Manifest()
  
  /* -------------------------------------------------------------------------------------------
     .directory_manifest( redirect_url, options )
  */
  File_Set.Build( 'directory_manifest', Directory_Manifest, function( Super ) { return {
    _redirect_html_content: function( album_id ) {
      return ''
        + '<html>'
        +   '<head>'
        +     '<meta http-equiv="Refresh" content="1; url=' + this._redirect_url + '#/' + album_id + '" />'
        +   '</head>'
        + '</html>'
      ;
    }, // _redirect_html_content()
    
    _add_value: function( transaction, value ) {
      var that          = this
        , entry_path    = this._get_path( value.path )
        , dirname       = value.type === 'directory' ? entry_path : path.dirname( entry_path )
        , manifest_path = dirname + '/.manifest.json'
        , depth         = value.depth
        
        , manifests     = this._directories_manifest
      ;
      
      // test if .manifest.json exist
      fs.exists( manifest_path, function( exists ) {
        // if it exist, read .manifest.json and emit it content
        if( exists ) {
          // read .manifest.json file
          read_file( manifest_path, function( content ) {
            // emit .manifest.json content
            emit_value( extend_2( { manifest: content }, value ) );
            
            if( depth === 1 ) html_redirect( dirname, that._redirect_html_content( content.id ) );
            
            if( ! manifests[ entry_path ] ) manifests[ entry_path ] = content;
          } );
        } else {
          var v = { id: uuid_v4() };
          
          // create file .manifest.json
          write_file( manifest_path, JSON.stringify( v ), function() {
            emit_value( extend_2( { manifest: v }, value ) );
            
            manifests[ entry_path ] = v;
          } );
          
          if( depth === 1 ) html_redirect( dirname, that._redirect_html_content( v.id ), true );
        } // if() ... else
      } ); // fs.exists( manifest_path )
      
      return this;
      
      // create a file with the given content in the given path,
      // and call a callback function when it's created
      function write_file( file_path, file_content, f ) {
        // de&&ug( '_add_value(), write_file(), path : ' + file_path );
        
        fs.writeFile( file_path, file_content, function( err ) {
          if( err ) return error( '_add_value(), write_file(): Cannot create file, error: ' + log.s( err ) + ', path: ' + file_path );
          
          de&&ug( '_add_value(), write_file(): file created, path: ' + file_path );
          
          f && f();
        } ); // fs.writeFile()
      } // write_file()
      
      // read a file, parse it content to a JSON object,
      // and call a callback function
      function read_file( file_path, f ) {
        fs.readFile( file_path,  function( err, content ) {
          if( err ) return error( '_add_value(), read_file(): Cannot read file, error: ' + log.s( err ) + ', path: ' + file_path );
          
          try {
            de&&ug( '_add_value(), read_file(): content: ' + content + ', path: ' + file_path );
            
            content = JSON.parse( content );
            
            f && f( content );
          } catch( e ) {
            error( '_add_value(), read_file(): Cannot parse JSON object'
              + ', error: '   + log.s( e )
              + ', content: ' + log.s( content )
              + ', path: '    + file_path
            );
          } // try ... catch()
        } ); // fs.readFile()
      } // read_file()
      
      // html_redirect():
      // create file 'redirect.html' if it not exists
      // if parameter 'replace_old = true', relace the redirect.html file with a new one
      function html_redirect( dirname, content, replace_old ) {
        var redirect_path = dirname + '/redirect.html';
        
        fs.exists( redirect_path, function( exists ) {
          if( exists ) {
            replace_old && fs.unlink( redirect_path, function( err ) {
              if( err ) return error( '_add_value(), fs.unlink(): Cannot delete file, error: ' + log.s( err ) + ', path: ' + redirect_path );
              
              de&&ug( '_add_value(), fs.unlink(): file deleted, path : ' + redirect_path );
              
              write_file( redirect_path, content );
            } ); // fs.unlink();
          } else {
            write_file( redirect_path, content );
          } // if() ... else
        } ); // fs.exists()
      } // html_redirect()
      
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
        , manifest_content = this._directories_manifest[ entry_path ]
      ;
      
      if( ! manifest_content ) {
        de&&ug( '_remove_value(), .manifest.json content not found, path: ' + entry_path );
        
        return transaction.emit_nothing();
      }
      
      Super._remove_value.call( this, transaction, extend_2( { manifest: manifest_content }, value ) );
      
      delete this._directories_manifest[ entry_path ];
      
      return this;
    } // _remove_value()
  }; } ); // Directory_Manifest instance methods
  
  de&&ug( "module loaded" );
} ( this ); // directory_manifest.js
