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

var gallery_images = ( this.XS || require( 'excess' ).XS ).xs
  .set( [
    { path: 'images/gallery-01.jpg' },
    { path: 'images/gallery-02.jpg' },
    { path: 'images/gallery-03.jpg' },
    { path: 'images/gallery-04.jpg' },
    { path: 'images/gallery-05.jpg' },
    { path: 'images/gallery-06.jpg' },
    { path: 'images/gallery-07.jpg' },
    { path: 'images/gallery-08.jpg' },
    { path: 'images/gallery-09.jpg' },
    { path: 'images/gallery-10.jpg' },
    { path: 'images/gallery-11.jpg' },
    { path: 'images/gallery-12.jpg' },
    { path: 'images/gallery-13.jpg' },
    { path: 'images/gallery-14.jpg' },
    { path: 'images/gallery-15.jpg' },
    { path: 'images/gallery-16.jpg' },
    { path: 'images/gallery-17.jpg' },
    { path: 'images/gallery-18.jpg' },
    { path: 'images/gallery-19.jpg' },
    { path: 'images/gallery-20.jpg' },
    { path: 'images/gallery-21.jpg' },
    { path: 'images/gallery-22.jpg' },
    { path: 'images/gallery-23.jpg' },
    { path: 'images/gallery-24.jpg' },
    { path: 'images/gallery-25.jpg' },
    { path: 'images/gallery-26.jpg' },
    { path: 'images/gallery-27.jpg' }
  ] )
  .set_flow( 'gallery_images' )
  .auto_increment()
;

if ( typeof module != 'undefined' ) module.exports = gallery_images;
