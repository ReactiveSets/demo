/*  server.js
    
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

var rs  = require( 'toubkal' )
  , RS  = rs.RS
  , log = RS.log
;

require( 'toubkal/lib/server/http.js' );

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
var servers = rs.set( [
    { id: 1, ip_address: '0.0.0.0', port: 8080 },
  ] )
  .http_servers()
;

require( './castorcad.js' )( servers.virtual_http_servers( [ 'castorcad.com', 'www.castorcad.com', 'castorcad', '127.0.0.1' ] ) );
