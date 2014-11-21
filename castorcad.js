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

var RS     = require( 'toubkal' ).RS
  , path   = require(  'path'  )
  , rs     = RS.rs
  , log    = RS.log
  , extend = RS.extend
;

require( 'toubkal/lib/server/file.js'              );
require( 'toubkal/lib/server/http.js'              );
require( 'toubkal/lib/server/socket_io_clients.js' );
require( 'toubkal/lib/server/uglify.js'            );
require( 'toubkal/lib/server/mailer.js'            );
require( 'toubkal/lib/server/thumbnails.js'        );

require( 'toubkal/lib/uri.js'   );
require( 'toubkal/lib/join.js'  );
require( 'toubkal/lib/order.js' );
require( 'toubkal/lib/form.js'  );

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

/* -------------------------------------------------------------------------------------------
   Load and Serve Assets
*/

var client_min = rs
  .union( [
    rs.set( [
      { path: 'js/es5.js'   },
      { path: 'js/json2.js' },
      { path: 'js/uuid.js'  }
    ] ),
    
    rs.set( [
      // rs.core
      { name: 'toubkal/lib/rs.js'           },
      { name: 'toubkal/lib/code.js'         },
      { name: 'toubkal/lib/query.js'        },
      { name: 'toubkal/lib/transactions.js' },
      { name: 'toubkal/lib/pipelet.js'      },
      { name: 'toubkal/lib/filter.js'       },
      { name: 'toubkal/lib/order.js'        },
      { name: 'toubkal/lib/aggregate.js'    },
      { name: 'toubkal/lib/join.js'         },
      { name: 'toubkal/lib/events.js'       },
      { name: 'toubkal/lib/uri.js'          },
      { name: 'toubkal/lib/last.js'         },
      
      // rs.ui
      { name: 'toubkal/lib/selector.js'                },
      { name: 'toubkal/lib/client/animation_frames.js' },
      { name: 'toubkal/lib/client/url.js'              },
      { name: 'toubkal/lib/form.js'                    },
      { name: 'toubkal/lib/load_images.js'             },
      { name: 'toubkal/lib/bootstrap_photo_album.js'   },
      { name: 'toubkal/lib/bootstrap_carousel.js'      },
      
      // socket.io server access
      { name: 'toubkal/lib/socket_io_crossover.js' },
      { name: 'toubkal/lib/socket_io_server.js'    }
    ] )
    .require_resolve(),
    
    rs.set( [
      { path: 'contact_form_fields.js' }
    ] )
  ] )
  
  .auto_increment()
  
  .watch( { base_directory: __dirname } )
  
  .order( [ { id: 'id' } ] ) // order loaded files
  
  .uglify( 'js/toubkal-0.2.4.min.js', { warnings: false } )
;

// carousel images, gallery images and projects images thumbnails
var carousel_images = require( './carousel_images.js' )
  , gallery_images  = require( './gallery_images.js'  )
  //, projects_images = require( './projects_images.js' )
  , albums_images   = require( './albums_images.js'   )
;

/*
var projects_thumbnails = projects_images
  .thumbnails( { width: 700, height: 520, base_directory: __dirname } )
  .set_flow( 'projects_thumbnails' )
;
*/
var dropbox_assets = rs
  
  .union( [ carousel_images, albums_images, gallery_images/*, projects_images*/ ] )
  
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
  .union( [ client_min ] )
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
