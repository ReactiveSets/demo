/*  castorcad.js
    
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

var XS = require( 'excess' ).XS
  , xs         = XS.xs
  , log        = XS.log
  , extend     = XS.extend
;

require( 'excess/lib/server/file.js' );
require( 'excess/lib/server/http.js' );
require( 'excess/lib/server/uglify.js' );
require( 'excess/lib/order.js' );

/* -------------------------------------------------------------------------------------------
   de&&ug()
*/
var de = true;
  
function ug( m ) {
  log( "castorcad, " + m );
} // ug()

/* -------------------------------------------------------------------------------------------
   Start HTTP Servers
*/
var servers = xs.set( [
    { ip_address: '0.0.0.0', port: 80 },
    // { port: 8043, key: '', cert: '' }, // https server usimg key and cert
  ], { auto_increment: true } )
  .http_servers()
;

/* -------------------------------------------------------------------------------------------
   Load and Serve Assets
*/
var client_min = xs.set( [
    { name: 'js/es5.js'    },
    { name: 'js/json2.js'  },
    
    { name: 'node_modules/excess/lib/xs.js'        },
    { name: 'node_modules/excess/lib/code.js'      },
    { name: 'node_modules/excess/lib/pipelet.js'   },
    { name: 'node_modules/excess/lib/filter.js'    },
    { name: 'node_modules/excess/lib/order.js'     },
    { name: 'node_modules/excess/lib/aggregate.js' },
    { name: 'node_modules/excess/lib/join.js'      },
    
    //{ name: 'test/xs_tests.js'        }
  ], { auto_increment: true }  ) // will auto-increment the id attribute starting at 1
  .watch()
  .order( [ { id: 'id' } ] ) // order loaded files
  .uglify( 'js/xs-min.js', { warnings: false } )
;

xs.set( [
    { name: 'index.html'    },
    { name: 'a_propos.html' },
    { name: 'contact.html'  },
    //{ name: 'index-min.html'       },
    { name: 'bootstrap/css/bootstrap.css' },
    { name: 'bootstrap/css/bootstrap-responsive.css' },
    { name: 'css/style.css' },
    { name: 'bootstrap/js/bootstrap.js' },
    { name: 'js/castorcad.js' },
    { name: 'images/01.jpg' },
    { name: 'images/02.jpg' },
    { name: 'images/03.jpg' },
    { name: 'images/04.jpg' },
    { name: 'images/05.jpg' },
    { name: 'images/06.jpg' },
    { name: 'images/07.jpg' },
    { name: 'images/08.jpg' },
    { name: 'images/09.jpg' },
  ], { auto_increment: true } )
  .watch()
  .union( [ client_min ] )
  .serve( servers )
;
