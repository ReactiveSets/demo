/*  castorcad.js
    
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

var rs     = require( 'toubkal' )
  , path   = require(  'path'  )
  , RS     = rs.RS
  , log    = RS.log
  , extend = RS.extend
;

require( './js/dropbox.js'            );
require( './js/directory_manifest.js' );

/* -------------------------------------------------------------------------------------------
   de&&ug()
*/
var de = true;
  
function ug( m ) {
  log( "castorcad, " + m );
} // ug()

module.exports = function( servers ) {

var client_assets = require( 'toubkal/lib/server/client_assets.js' )
  , toubkal_min = client_assets.toubkal_min()
;

/* -------------------------------------------------------------------------------------------
   Load and Serve Assets
*/

// carousel images, gallery images and projects images thumbnails
var carousel_images = require( './carousel_images.js' )
  , gallery_images  = require( './gallery_images.js'  )
  , projects_images = require( './projects_images.js' )
  , albums_images   = require( './albums_images.js'   )
;

var dropbox_assets = rs
  
  .union( [ carousel_images, albums_images, gallery_images, projects_images ] )
  
  .alter( add_dropbox_filepath )
  
  .delay( 3000 )
  
  .dropbox_public_urls()
;

var files = rs
  .set( [
    // HTML pages
    { path: 'index.html'   },
    { path: 'gallery.html' },
    { path: 'albums.html'  },
    
    // CSS files
    { path: 'css/base.css'             },
    { path: 'css/responsive_fixes.css' },
    { path: 'css/projects.css'         },
    { path: 'css/gallery.css'          },
    { path: 'css/albums.css'           },
    { path: 'css/modal.css'            },
    
    // JS files
    { path: 'contact_form_fields.js'   },
    { path: 'js/hammer.js'             },
    { path: 'js/navigation.js'         },
    { path: 'js/modal.js'              },
    { path: 'js/carousel.js'           },
    { path: 'js/gallery.js'            },
    { path: 'js/projects.js'           },
    { path: 'js/contact.js'            },
    { path: 'js/albums.js'             },
    
    // jQuery plugins
    { path: 'js/jquery.ui.totop.js'    },
    { path: 'js/jquery.easing.1.3.js'  },
    
    // additional PNG images for css styles
    { path: 'images/favicon.png'       },
    { path: 'images/logo.png'          },
    { path: 'images/sprite.png'        },
    { path: 'images/ui.totop.png'      }
    
  ] )
  .auto_increment()
  .watch( { base_directory: __dirname } )
  .union( [ toubkal_min ] )
;

servers.http_listen( files );

files.serve( servers );

var contact_form_fields = require( "./contact_form_fields.js" )
  .order( [ { id: 'order_id' } ] )
;

// Serve contact_form_fields to socket.io clients
contact_form_fields
  .union( [ dropbox_assets ] )
  
  .trace( 'contact_form_fields, images and thumbnails to clients' )
  
  // Start socket.io server, and dispatch client connections to provide contact_form_fields and get filled contact forms
  .dispatch( servers.socket_io_clients(), function( source, options ) {
    return this.socket._add_source( source );
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
      
      to: 'Info <info@castorcad.com>',
      
      bcc: [
        'Samy Vincent <svincent@castorcad.com>',
        'Marcel K\' Nassik <knassik@gmail.com>',
        'Jean Vincent <uiteoi@gmail.com>'
      ],
      
      reply_to: full_name + ' <' + form.email + '>',
      
      subject: 'CastorCAD Contact Form Received from ' + full_name,
      
      html: '<h3>CastorCAD Contact Form:</h3>'
        + '<p>From: <a href="mailto:' + full_name.replace( ' ', '%20' ) + '<' + form.email + '>">' + '<b>' + full_name + '</b> ' + form.email + '</a></p>'
        + '<p>Company: <b>' + ( form.company || '' ) + '</b></p>'
        + '<p>Message:<p>'
        + '<p>' + form.text + '</p>'
    };
  }, { no_clone: true } )
  
  .trace( 'send email' )
  
  .send_mail( rs.configuration() )
  
  .trace( 'email sent' )
;

function add_dropbox_filepath( image ) {
  image.dropbox_filepath = image.path.match( '~/Dropbox/Apps/CastorCAD/(.*)' )[ 1 ]
} // add_dropbox_filepath()

} // module.exports
