/*  projects_images.js
    
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
/*
var projects_images = ( this.XS || require( 'excess' ).XS ).xs
  .set( [
    { path: 'images/project-01.jpg' },
    { path: 'images/project-02.jpg' },
    { path: 'images/project-03.jpg' },
    { path: 'images/project-04.jpg' }
    // { path: 'images/project-05.jpg' },
    // { path: 'images/project-06.jpg' }
  ] )
  .set_flow( 'projects_images' )
  .auto_increment()
;

if ( typeof module != 'undefined' ) module.exports = projects_images;
*/
var xs = require( 'excess' );

require( 'excess/lib/server/file.js' );

// projects images
var images = xs  
  
  .set( [ { path: '~/Dropbox/Apps/CastorCAD/projects' } ] )
  
  .watch_directories()
  
  .auto_increment( { attribute: 'id' } )
  
  .set_flow( 'projects_images' )
  
  .trace( 'projects images' )
;

// projects thumbnails
var thumbnails = images
  
  .thumbnails( { path: 'thumbnails/', width: 700, height: 520, base_directory: __dirname } )
  
  .set_flow( 'projects_thumbnails' )
;
 
module.exports = xs.union( [ images, thumbnails ] );
