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
      { name: 'images/gallery/01.jpg' },
      { name: 'images/gallery/02.jpg' },
      { name: 'images/gallery/03.jpg' },
      { name: 'images/gallery/04.jpg' },
      { name: 'images/gallery/05.jpg' },
      { name: 'images/gallery/06.jpg' },
      { name: 'images/gallery/07.jpg' },
      { name: 'images/gallery/08.jpg' },
      { name: 'images/gallery/09.jpg' },
      { name: 'images/gallery/10.png' },
      { name: 'images/gallery/11.png' },
      { name: 'images/gallery/12.jpg' },
      { name: 'images/gallery/13.jpg' },
      { name: 'images/gallery/14.jpg' },
      { name: 'images/gallery/15.jpg' },
      { name: 'images/gallery/16.jpg' },
      { name: 'images/gallery/17.jpg' },
      { name: 'images/gallery/18.jpg' },
      { name: 'images/gallery/19.jpg' }
    ], { auto_increment: true, set_flow: "gallery_images" }
  )
;

if ( typeof module != 'undefined' ) module.exports = gallery_images;
