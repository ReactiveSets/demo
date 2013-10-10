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
require( 'excess/lib/server/socket_io_clients.js' );
require( 'excess/lib/server/uglify.js' );
require( 'excess/lib/server/configuration.js' );
require( 'excess/lib/server/mailer.js' );
require( 'excess/lib/uri.js' );
require( 'excess/lib/order.js' );
require( 'excess/lib/form.js' );
require( 'excess/lib/thumbnails.js' );

/* -------------------------------------------------------------------------------------------
   de&&ug()
*/
var de = true;
  
function ug( m ) {
  log( "castorcad, " + m );
} // ug()

module.exports = function( servers ) {

/* -------------------------------------------------------------------------------------------
   Load and Serve Assets
*/
var client_min = xs.set( [
    { name: 'js/es5.js'    },
    { name: 'js/json2.js'  },
    { name: 'js/uuid.js'   }
  ], { auto_increment: true }  ) // will auto-increment the id attribute starting at 1
  
  .union( [
    xs.set( [
      // xs.core
      { name: 'excess/lib/xs.js'                    },
      { name: 'excess/lib/code.js'                  },
      { name: 'excess/lib/pipelet.js'               },
      { name: 'excess/lib/filter.js'                },
      { name: 'excess/lib/order.js'                 },
      { name: 'excess/lib/aggregate.js'             },
      { name: 'excess/lib/join.js'                  },
      { name: 'excess/lib/events.js'                },
      { name: 'excess/lib/uri.js'                   },
      
      // xs.ui
      { name: 'excess/lib/selector.js'              },
      { name: 'excess/lib/form.js'                  },
      { name: 'excess/lib/load_images.js'           },
      { name: 'excess/lib/bootstrap_photo_album.js' },
      { name: 'excess/lib/bootstrap_carousel.js'    },
      
      // socket.io server access
      { name: 'excess/lib/socket_io_crossover.js'   },
      { name: 'excess/lib/socket_io_server.js'      }
    ], { auto_increment: true, auto_increment_start: 4 } ) // will auto-increment the id attribute starting at 4
    
    .require_resolve()
  ] )
  
  .union( [
    xs.set( [
      { name: 'contact_form_fields.js' },
      { name: 'gallery_images.js'      },
      { name: 'carousel_images.js'     }
    ], { auto_increment: true, auto_increment_start: 100 } ) 
  ] )
  
  .watch( { base_directory: __dirname } )
  .order( [ { id: 'id' } ] ) // order loaded files
  .uglify( 'js/xs-0.1.31.min.js', { warnings: false } )
;

var carousel_images = require( './carousel_images.js' )
  , gallery_images  = require( './gallery_images.js'  )
;

var thumbnails = gallery_images
  .thumbnails( { path: 'images/', width: 125, height: 80, base_directory: __dirname } )
  .set_flow( 'gallery_thumbnails' )
  .on( 'complete', function() {
    thumbnails.fetch_all( function( values ) {
      de&&ug( 'Thumbnails generation complete, count: ' + values.length );
    } );
  } )
;

xs.set( [
    { name: 'index.html'    },
    { name: 'about.html'    },
    { name: 'gallery.html'  },
    { name: 'contact.html'  },
    { name: 'bootstrap/css/bootstrap.css' },
    { name: 'bootstrap/css/bootstrap-responsive.css' },
    { name: 'css/style.css'   },
    { name: 'css/gallery.css' },
    { name: 'bootstrap/js/bootstrap.js' },
    { name: 'js/carousel.js' },
    { name: 'js/gallery.js'  },
    { name: 'js/contact.js'  },
    { name: 'bootstrap/fonts/glyphicons-halflings-regular.eot'  },
    { name: 'bootstrap/fonts/glyphicons-halflings-regular.svg'  },
    { name: 'bootstrap/fonts/glyphicons-halflings-regular.ttf'  },
    { name: 'bootstrap/fonts/glyphicons-halflings-regular.woff' },
    { name: 'css/images/bg_matrix.png' },
    { name: 'images/contact.jpg' }
  ], { auto_increment: true } )
  .union( [ carousel_images, gallery_images, thumbnails ] )
  .watch( { base_directory: __dirname } )
  .union( [ client_min ] )
  
  // .watch( { base_directory: __dirname } )
  // .union( [ client_min, carousel_images.watch( { base_directory: __dirname } ) ] )
  
  .serve( servers, { hostname: [ 'localhost', 'castorcad.com', 'www.castorcad.com' ] } )
;

var contact_form_fields = require( "./contact_form_fields.js" )
  .order( [ { id: 'order_id' } ] )
;

// Serve contact_form_fields to socket.io clients
contact_form_fields
  .union( [ carousel_images.to_uri(), thumbnails.to_uri() ] )
  
  .trace( 'contact_form_fields, carousel images and thumbnails to clients' )
  
  // Start socket.io server, and dispatch client connections to provide contact_form_fields and get filled contact forms
  .dispatch( servers.socket_io_clients(), function( source, options ) {
    return source
      .plug( this.socket )
    ;
  } )
  
  .trace( 'contact form received from client' )
  
  // Validate form, just in case the contact form code has been altered on the client
  .form_validate( 'contact_form', contact_form_fields )
  
  .trace( 'form_validate' )
  
  .flow( 'contact_form' ) // filter errors out
  
  .trace( 'validated form' )
  
  .alter( function( form ) {
    var full_name = form[ 'full-name' ];
    
    return {
      messageId: form.id,
      
      from: 'CastorCAD contact form <info@castorcad.com>',
      
      to: 'Samy Vincent <samyvincent52@gmail.com>',

      cc: [
        'Marcel K\' Nassik <knassik@gmail.com>',
        'Jean Vincent <uiteoi@gmail.com>'
      ],
      
      subject: 'CastorCAD Contact Form Received from ' + full_name,
      
      html: '<h3>CastorCAD Contact Form received:</h3>'
        + '<p>Full Name: <b>' + full_name + '</b></p>'
        + '<p>From: <a href="mailto' + form.email + '">' + form.email + '</a></p>'
        + '<p>Company: <b>' + ( form.company || '' ) + '</b></p>'
        + '<br />'
        + '<p>Text:<p>'
        + '<p>' + form.text + '</p>'
    };
  } )
  
  .trace( 'send email' )
  
  .send_mail( xs.configuration() )
  
  .trace( 'email sent' )
;

} // module.exports
