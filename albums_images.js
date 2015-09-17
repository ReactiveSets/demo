/*  albums_images.js
    
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

// castorcad required modules
require( './js/dropbox.js'            );
require( './js/directory_manifest.js' );

// watch Dropbox albums directories
var albums_directories = rs
      
      .set( [ { path: '~/Dropbox/Apps/CastorCAD/albums' } ] )
      
      .union()
  
  , albums_entries = albums_directories.watch_directories()
;
 
albums_entries
  
  .filter( [ { type: 'directory' } ] )
  
  ._add_destination( albums_directories )
;

// add files '.manifest.json' and 'redirect.html' to the albums directories
var entries_manifests = albums_entries
  
  .delay( 1000 )
  
  .directory_manifest( 'http://www.castorcad.com/albums.html' )
;

// process directory_manifest() output, get architects, projects images and thumbnails informations

// architects
var architects = entries_manifests
  
  .unique_set() // prevent duplicated entries until bug fix in watch_directories()
  
  .filter( [ { type: 'directory', depth: 1 } ] )
  
  .alter( alter_architects )
  
  .trace( 'architects' )
;

// projects
var projects = entries_manifests
  
  .filter( [ { type: 'directory', depth: 2 } ] )
  
  .alter( alter_projects )
  
  .join( architects, [ [ 'architects_dirname', 'architects_dirname' ] ], projects_architects )
  
  .trace( 'projects' )
;

// images
var images = entries_manifests
  
  .filter( [ { type: 'file', depth: 4, extension: 'jpg' }, { type: 'file', depth: 4, extension: 'png' } ] )
  
  .alter( alter_images, { no_clone: true } )
  
  .join( projects, [ [ 'projects_dirname', 'projects_dirname' ] ], images_metadata )
  
  .auto_increment( { attribute: 'order' } )
  
  .set_flow( 'albums_images' )

  .trace( 'albums images' )
;

// thumbnails
// create albums images thumbnails
images.thumbnails( { path: 'thumbnails/', width: 638, height: 360, base_directory: __dirname } );

var thumbnails = entries_manifests
  
  .filter( [ { type: 'file', depth: 5, extension: 'jpg' }, { type: 'file', depth: 5, extension: 'png' } ] )
  
  .alter( alter_thumbnails, { no_clone: true } )
  
  .join( images, [ [ 'image_source_dirname', 'image_dirname' ], [ 'image_source_name', 'image_basename' ] ], thumbnails_metadata )
  
  .set_flow( 'albums_thumbnails' )
  
  .trace( 'albums thumbnails' )
;

module.exports = rs.union( [ images, thumbnails ] );

// -------------------------------------------------------------------------------------------------------
// alter / merge functions :

// alter functions :

function alter_architects( file ) {
  file.architect_id       = file.manifest.id;
  file.architects_dirname = file.path;
  
  delete file.manifest;
} // alter_architects()

function alter_projects( file ) {
  file.project_id         = file.manifest.id;
  file.architects_dirname = path.dirname( file.path );
  file.projects_dirname   = file.path;
  
  delete file.manifest;
} // alter_projects()

function alter_images( file ) {
  var a = file.path.split( '/' );
  
  return {
      image_id        : file.manifest.id
    , path            : file.path
    , projects_dirname: a.slice( 0, a.length - 2 ).join( '/' )
    , image_dirname   : a.slice( 0, a.length - 1 ).join( '/' )
    
  };
} // alter_images()

function alter_thumbnails( file ) {
  var a = file.path.split( '/' );
  
  return {
      thumbnail_id        : file.manifest.id
    , path                : file.path
    , image_source_name   : a[ a.length - 1 ].split( '-' )[ 0 ] + '.' + file.extension
    , image_source_dirname: a.slice( 0, a.length - 2 ).join( '/' )
  };
} // _thumbnails()

// merge functions :

function projects_architects( project, architect ) {
  return {
      architect_id    : architect.architect_id
    , project_id      : project.project_id
    , projects_dirname: project.projects_dirname
  };
} // architects_projects()

function images_metadata( image, project ) {
  var filepath = image.path
    , array    = filepath.match( '~/Dropbox/Apps/CastorCAD/(.*)' )[ 1 ].split( '/' )
  ;
   
  return {
      architect_id  : project.architect_id
    , architect_name: array[ 1 ]
    , project_name  : array[ 2 ]
    , image_name    : array[ 3 ]
    , path          : filepath
    , image_dirname : image.image_dirname
    , image_basename: path.basename( filepath )
  };
} // images_metadata()

function thumbnails_metadata( thumbnail, image ) {
  return {
      order         : image.order
    , architect_id  : image.architect_id
    , architect_name: image.architect_name
    , project_name  : image.project_name
    , image_name    : image.image_name
    , path          : thumbnail.path
  };
} // images_thumbnails()
