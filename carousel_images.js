/*  carousel_images.js
    
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

var carousel_images = ( this.XS || require( 'excess' ).XS ).xs
  .set( [
      { name: 'images/18.jpg', title: 'Villa à Marrakech' },
      { name: 'images/19.jpg', title: 'Villa à Marrakech' },
      { name: 'images/20.jpg', title: 'Villa à Marrakech' },
      { name: 'images/21.jpg', title: 'Villa à Marrakech' },
      { name: 'images/22.jpg', title: 'Salon Privé'       },
      { name: 'images/16.jpg', title: 'Villa à Geneve'    },
      { name: 'images/15.jpg', title: 'Villa à Geneve'    },
      { name: 'images/14.jpg', title: 'Villa à Geneve'    },
      { name: 'images/17.jpg', title: 'Villa à Geneve'    },
      { name: 'images/12.jpg', title: 'Lotus Club'        },
      { name: 'images/13.jpg', title: 'Lotus Club'        },
      { name: 'images/01.jpg', title: 'Villa à Marrakech' },
      { name: 'images/03.jpg', title: 'Villa à Marrakech' },
      { name: 'images/04.jpg', title: 'Villa à Marrakech' },
      { name: 'images/05.jpg', title: 'Villa à Marrakech' },
      { name: 'images/07.jpg', title: 'Villa à Marrakech' },
      { name: 'images/11.jpg', title: 'Résidence Deroua'  },
      { name: 'images/24.jpg', title: 'Résidence Deroua'  },
      { name: 'images/25.jpg', title: 'Résidence Deroua'  }
    ], { auto_increment: true, set_flow: "carousel_images" }
  )
;

if ( typeof module != 'undefined' ) module.exports = carousel_images;
