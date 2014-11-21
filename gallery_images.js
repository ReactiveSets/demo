/*  gallery_images.js
    
    ----
    
    Copyright (C) 2013, Connected Sets

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

require( 'toubkal/lib/server/file.js'       );
require( 'toubkal/lib/filter.js'            );
require( 'toubkal/lib/order.js'             );
require( 'toubkal/lib/join.js'              );
require( 'toubkal/lib/server/thumbnails.js' );

require( './js/dropbox.js' );

// gallery images
var images = rs
  
  .set( [ { path: '~/Dropbox/Apps/CastorCAD/gallery' } ] )
  
  .watch_directories()
  
  .filter( [ { type : 'file'} ] )
  
  .alter( alter_images, { no_clone: true } )
;

// create gallery thumbnails
images.thumbnails( { path: 'thumbnails/', width: 125, height: 80, base_directory: __dirname } );

// gallery thumbnails
var thumbnails = rs
  
  .set( [ { path: '~/Dropbox/Apps/CastorCAD/gallery/thumbnails' } ] )
  
  .watch_directories()
  
  .alter( alter_thumbnails, { no_clone: true } )
;

module.exports = rs
  .union( [
      images
        
        .join( thumbnails, [ [ 'image_name', 'image_source_name' ] ], served_images )
        
        .set_flow( 'gallery_images' )
        
        // .trace( 'gallery images' )
        
        // .set()
        
    , thumbnails
        
        .join( images, [ [ 'image_source_name', 'image_name' ] ], served_thumbnails )
        
        .set_flow( 'gallery_thumbnails' )
        
        // .trace( 'gallery thumbnails' )
        
        // .set()
  ] )
  
  .alter( add_dropbox_filepath )
  
  .dropbox_public_urls()
  
  .trace( 'public urls' )
  
  .set()
;

return;

function served_images( image, thumbnail ) {
  return { path: image.path };
} // served_images()

function served_thumbnails( thumbnail, image ) {
  return { path: thumbnail.path };
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

function add_dropbox_filepath( image ) {
  image.dropbox_filepath = image.path.match( '~/Dropbox/Apps/CastorCAD/(.*)' )[ 1 ]
} // add_dropbox_filepath()
