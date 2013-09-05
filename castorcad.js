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
require( 'excess/lib/server/configuration.js' );
require( 'excess/lib/server/mailer.js' );
require( 'excess/lib/order.js' );
require( 'excess/lib/form.js' );

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
    { name: 'js/uuid.js'   },
    
    // xs.core
    { name: 'node_modules/excess/lib/xs.js'                  },
    { name: 'node_modules/excess/lib/code.js'                },
    { name: 'node_modules/excess/lib/pipelet.js'             },
    { name: 'node_modules/excess/lib/filter.js'              },
    { name: 'node_modules/excess/lib/order.js'               },
    { name: 'node_modules/excess/lib/aggregate.js'           },
    { name: 'node_modules/excess/lib/join.js'                },
    
    // xs.ui
    { name: 'node_modules/excess/lib/selector.js'            },
    { name: 'node_modules/excess/lib/form.js'                },
    { name: 'node_modules/excess/lib/load_images.js'         },
    { name: 'node_modules/excess/lib/carousel.js'            },
    
    // socket.io server access
    { name: 'node_modules/excess/lib/socket_io_crossover.js' },
    { name: 'node_modules/excess/lib/socket_io_server.js'    }
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
    { name: 'js/contact.js' },
    { name: 'bootstrap/img/glyphicons-halflings.png' },
    { name: 'images/01.jpg' },
    { name: 'images/03.jpg' },
    { name: 'images/04.jpg' },
    { name: 'images/05.jpg' },
    { name: 'images/06.jpg' },
    { name: 'images/07.jpg' },
    { name: 'images/09.jpg' },
    { name: 'images/11.jpg' },
    { name: 'images/12.jpg' },
    { name: 'images/13.jpg' },
    { name: 'images/14.jpg' },
    { name: 'images/15.jpg' },
    { name: 'images/16.jpg' },
    { name: 'images/17.jpg' },
    { name: 'images/contact.jpg' }
  ], { auto_increment: true } )
  .watch()
  .union( [ client_min ] )
  .serve( servers )
;

var contact_form_fields = xs
  .set(
    [
      {
          id   : 'model'
        , type : 'hidden'
        , value: 'contact_form'
      },
      
      {
          id   : 'id'
        , type : 'hidden'
        , value: { type: 'UUID' }
      },
      
      {
          id       : 'full-name'
        , type     : 'text'
        , label    : 'Prénom & Nom'
        , style    : { field: 'span4', label: 'control-label', container: 'control-group' }
        , mandatory: true
      },
      
      {
          id       : 'email'
        , type     : 'email'
        , label    : 'Email'
        , style    : { field: 'span4', label: 'control-label', container: 'control-group' }
        , mandatory: true
      },
      
      {
          id     : 'company'
        , type   : 'text'
        , label  : 'Société'
        , style: { field: 'span4', label: 'control-label', container: 'control-group' }
      },
      
      {
          id       : 'text'
        , type     : 'text_area'
        , label    : 'Message'
        , rows     : 8
        , style    : { field: 'input-xlarge span7', label: 'control-label', container: 'control-group demo' }
        , mandatory: true
      }
    ],
    
    { auto_increment: 'order_id', set_model: 'contact_form_fields' }
  )
  .order( [ { id: 'order_id' } ] )
;

// Serve contact_form_fields to socket.io clients
contact_form_fields
  .trace( 'contact_form_fields to clients' )
  
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
  
  .model( 'contact_form' ) // filter errors out
  
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
