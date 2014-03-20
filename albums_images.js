/*  albums_images.js
    
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

var XS = this.XS || require( 'excess' ).XS
  , xs = XS.xs
    
  , albums_images = xs
      .set( [
        { name: 'daien-01.jpg' , album_id: '7d78d170-f1b4-4083-baf4-b916091dd27b' },
        { name: 'daien-02.jpg' , album_id: '7d78d170-f1b4-4083-baf4-b916091dd27b' },
        { name: 'daien-03.jpg' , album_id: '7d78d170-f1b4-4083-baf4-b916091dd27b' },
        { name: 'daien-04.jpg' , album_id: '7d78d170-f1b4-4083-baf4-b916091dd27b' },
        { name: 'daien-05.jpg' , album_id: '7d78d170-f1b4-4083-baf4-b916091dd27b' },
        
        { name: 'deroua-01.jpg', album_id: '76e8c857-0c49-4aba-9af3-7e0d3dfc3e12' },
        { name: 'deroua-02.jpg', album_id: '76e8c857-0c49-4aba-9af3-7e0d3dfc3e12' },
        { name: 'deroua-03.jpg', album_id: '76e8c857-0c49-4aba-9af3-7e0d3dfc3e12' },
        { name: 'deroua-04.jpg', album_id: '76e8c857-0c49-4aba-9af3-7e0d3dfc3e12' },
        
        { name: 'hotel-ambassadeurs-01.jpg', album_id: '52efcd0b-25ec-4f7d-baf1-735ae87d4d65' },
        { name: 'hotel-ambassadeurs-02.jpg', album_id: '52efcd0b-25ec-4f7d-baf1-735ae87d4d65' },
        { name: 'hotel-ambassadeurs-03.jpg', album_id: '52efcd0b-25ec-4f7d-baf1-735ae87d4d65' },
        { name: 'hotel-ambassadeurs-04.jpg', album_id: '52efcd0b-25ec-4f7d-baf1-735ae87d4d65' },
        { name: 'hotel-ambassadeurs-05.jpg', album_id: '52efcd0b-25ec-4f7d-baf1-735ae87d4d65' },
        { name: 'hotel-ambassadeurs-06.jpg', album_id: '52efcd0b-25ec-4f7d-baf1-735ae87d4d65' },
        { name: 'hotel-ambassadeurs-07.jpg', album_id: '52efcd0b-25ec-4f7d-baf1-735ae87d4d65' },
        
        { name: 'dian-01.jpg'  , album_id: 'c27b1943-8406-4f33-8597-8d3d6b7b7236' }
      ], { key: [ 'id', 'album_id' ] } )
      
      .auto_increment()
      .set_flow( 'albums_images' )
;

if ( typeof module != 'undefined' ) module.exports = albums_images;
