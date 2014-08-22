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
        
        , manifests     = this._directories_manifest
      ;
      
      // test if .manifest.json exist
      fs.exists( manifest_path, function( manifest_exists ) {
        // if it exist
        if( manifest_exists ) {
          fs.readFile( manifest_path, function( err, content ) {
            if( err ) return error( '_add_value(), fs.readFile(): Cannot read file, path: ' + manifest_path );
            
            try {
              de&&ug( '_add_value(), read file, content: ' + content + ', path: ' + manifest_path );
              
              content = JSON.parse( content );
              
              emit_value( extend_2( { manifest: content }, value ) );
              
              // add an HTML file containing the album url
              if( value.depth === 1 ) {
                fs.exists( redirect_path, function( redirect_exists ) {
                  // create the HTML redirect file if not exist
                  if( ! redirect_exists ) {
                    fs.writeFile( redirect_path, that._redirect_html_content( content.id ), function( err ) {
                      if( err ) return error( '_add_value(), fs.writeFile(): Cannot create file, path: ' + redirect_path );
                      
                      de&&ug( '_add_value(), file created, path: ' + redirect_path );
                    } ); // fs.writeFile( redirect_path )
                  } // if()
                } ); // fs.exists( redirect_path )
              } // if()
            } catch( e ) {
              error( '_add_value(), fs.readFile(): Cannot parse JSON object'
                + ', error: '   + log.s( e )
                + ', content: ' + log.s( content )
                + ', path: '    + manifest_path
              );
            } // try .. catch()
          } ); // fs.readFile()
          
        } else {
          var v = { id: uuid_v4() };
          
          fs.writeFile( manifest_path, JSON.stringify( v ), function( err ) {
            if( err ) return error( '_add_value(), fs.writeFile(): Cannot create file, path: ' + manifest_path );
            
            de&&ug( '_add_value(), file created, path: ' + manifest_path );
            
            emit_value( extend_2( { manifest: v }, value ) );
          } ); // fs.writeFile( manifest_path )
          
          // add an HTML file containing the album url
          if( value.depth === 1 ) {
            fs.exists( redirect_path, function( redirect_exists ) {
              // create the HTML redirect file if not exist
              if( redirect_exists ) {
                fs.unlink( redirect_path, function( err ) {
                  if( err ) return error( '_add_value(), fs.unlink(): Cannot delete file, path: ' + redirect_path );
                  
                  fs.writeFile( redirect_path, that._redirect_html_content( v.id ), function( err ) {
                    if( err ) return error( '_add_value(), fs.writeFile(): Cannot create file, path: ' + redirect_path );
                    
                    de&&ug( '_add_value(), file created, path: ' + redirect_path );
                  } ); // fs.writeFile( redirect_path )
                } ); // fs.unlink( redirect_path );
              } else {
                fs.writeFile( redirect_path, that._redirect_html_content( v.id ), function( err ) {
                  if( err ) return error( '_add_value(), fs.writeFile(): Cannot create file, path: ' + redirect_path );
                  
                  console.log( 'here', that._redirect_html_content( v.id ) );
                  
                  de&&ug( '_add_value(), file created, path: ' + redirect_path );
                } ); // fs.writeFile( redirect_path )
              } // if( redirect_exists ) ... else
            } ); // fs.exists( redirect_path )
          } // if()
        } // if() ... else
      } ); // fs.exists( manifest_path )
      
      
      
      return this;
      
      function create_file( filepath, content, emit ) {
        fs.writeFile( filepath, content, function( err ) {
          if( err ) return error( '_add_value(), fs.writeFile(): Cannot create file, path: ' + filepath );
          
          de&&ug( '_add_value(), file created, path: ' + filepath );
          
          emit && emit_value( extend_2( { manifest: content }, value ) );
          
          manifests[ filepath ] = content;
        } );
      } // create_file()
      
      function read_file( filepath ) {
        fs.readFile( filepath, function( err, content ) {
          if( err ) return error( '_add_value(), fs.readFile(): Cannot read file, path: ' + manifest_path );
          
          try {
            de&&ug( '_add_value(), read file, content: ' + content + ', path: ' + manifest_path );
            
            content = JSON.parse( content );
            
            emit_value( extend_2( { manifest: content }, value ) );
            
            manifests[ manifest_path ] = content;
          } catch( e ) {
            error( '_add_value(), fs.readFile(): Cannot parse JSON object'
              + ', error: '   + log.s( e ) 
              + ', content: ' + log.s( content ) 
              + ', path: '    + manifest_path
            );
          } // try ... catch()
        } );
      } // read_file()
      
      /*
      function create_file( manifest_path, value ) {
        var content = { id: uuid_v4() };
        
        // create file .manifest.json
        fs.writeFile( manifest_path, JSON.stringify( content ), function( err ) {
          if( err ) return error( '_add(), fs.writeFile(): Cannot create file .manifest.json, path: ' + manifest_path );
          
          de&&ug( '_add(), .manifest.json created, content: ' + log.s( content ) + ', path: ' + manifest_path );
          
          emit_value( extend_2( { manifest: content }, value ) );
          
          manifests[ manifest_path ] = content;
        } );
        
        if( value.depth === 1 ) {
          // create HTML file
          var html = '<html><head><meta http-equiv="Refresh" content="5; url=http://castorcad:8080/albums.html#/3b5f50cb-fcae-4a79-b712-606219231cff" />'
            + '</head></html>'
          ;
          
          fs.writeFile( dirname + '/album.html', html, function( err ) {
            if( err ) {
              de&&ug( '_add_value(), fs.writeFile(): Cannot create file album.html, path: ' + dirname + '/album.html' );
            } else {
              de&&ug( '_add_value(), fs.writeFile(): album.html created' );
            }
          } );
        }
        
        
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
      */
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
