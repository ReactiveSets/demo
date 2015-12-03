/*  projects_images.js
    
    ----
    
    Copyright (C) 2013, Reactive Sets

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

var rs   = require( 'toubkal' )
  , path = require(  'path'  )
;

// watch Dropbox projects directory
var projects_directory = rs
      
      .set( [ { path: '~/Dropbox/Apps/CastorCAD/projects' } ] )
      
      .union()
  
  , projects_entries = projects_directory.watch_directories()
;
 
projects_entries
 
  .filter( [ { type: 'directory' } ] )
  
  ._add_destination( projects_directory )
;

// projects images
var images = projects_entries
  
  .filter( [ { type : 'file', depth: 1 } ] )
  
  .map( alter_images )
  
  .trace( 'projects images' )
  
  .set()
;

// create projects thumbnails
images.thumbnails( { path: '/thumbnails/', width: 700, height: 520, base_directory: __dirname } );

// projects thumbnails
var thumbnails = projects_entries
  
  .filter( [ { type : 'file', depth: 2 } ] )
  
  .map( alter_thumbnails )
  
  .trace( 'projects thumbnails' )
  
  .set()
;

module.exports = rs
  .union( [
      images
        
        .join( thumbnails, [ [ 'image_name', 'image_source_name' ] ], served_images )
        
        .set_flow( 'projects_images' )
        
        // .trace( 'projects images' )
        
        // .set()
        
    , thumbnails
        
        .join( images, [ [ 'image_source_name', 'image_name' ] ], served_thumbnails )
        
        .set_flow( 'projects_thumbnails' )
        
        // .trace( 'projects thumbnails' )
        
        // .set()
  ] ) // rs.union( images & thumbnails )
  
  .trace( 'projects images and thumbnails' )
  
  .set()
;

return;

function served_images( image, thumbnail ) {
  return { path: image.path, file_name: image.image_name };
} // served_images()

function served_thumbnails( thumbnail, image ) {
  return { path: thumbnail.path, file_name: thumbnail.image_source_name };
} // served_thumbnails()

function alter_images( image ) {
  var image_path = image.path;
  
  return {
      path      : image_path
    , image_name: path.basename( image_path )
  };
} // alter_images()

function alter_thumbnails( thumbnail ) {
  var thumbnail_path = thumbnail.path;
  
  return {
      path             : thumbnail_path
    , image_source_name: path.basename( thumbnail_path ).replace( '-700x520', '' )
  };
} // alter_thumbnails()
