/*  gallery_images.js
    
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

// watch Dropbox gallery directory
var gallery_directory = rs
      
      .set( [ { path: '~/Dropbox/Apps/CastorCAD/gallery' } ] )
      
      .union()
  
  , gallery_entries = gallery_directory.watch_directories()
;
 
gallery_entries
 
  .filter( [ { type: 'directory' } ] )
  
  ._add_destination( gallery_directory )
;

// gallery images
var images = gallery_entries
  
  .filter( [ { type : 'file', depth: 1 } ] )
  
  .alter( alter_images, { no_clone: true } )
;

// create gallery thumbnails
images.thumbnails( { path: '/thumbnails/', width: 125, height: 80, base_directory: __dirname } );

// gallery thumbnails
var thumbnails = gallery_entries
  
  .filter( [ { type : 'file', depth: 2 } ] )
  
  .alter( alter_thumbnails, { no_clone: true } )
;

module.exports = rs
  .union( [
      images
        
        .join( thumbnails, [ [ 'image_name', 'image_source_name' ] ], served_images )
        
        .set_flow( 'gallery_images' )
        
    , thumbnails
        
        .join( images, [ [ 'image_source_name', 'image_name' ] ], served_thumbnails )
        
        .set_flow( 'gallery_thumbnails' )
  ] ) // rs.union( images & thumbnails )
  
  .trace( 'gallery images and thumbnails' )
  
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
    , image_source_name: path.basename( thumbnail_path ).replace( '-125x80', '' )
  };
} // alter_thumbnails()
