// gallery.js
!function( exports ) {

var $  = jQuery
  , xs = XS.xs
  
  , server = xs.socket_io_server()
  , gallery_images     = server.flow( 'gallery_images'     ).plug( exports.gallery_images.to_uri().unique_set() )
  , gallery_thumbnails = server.flow( 'gallery_thumbnails' )
  , photo_matrix_node  = document.getElementById( 'photo_matrix' )
  , photo_carousel_node = document.getElementById( 'photo_carousel' )
;

xs.union( [ gallery_images, gallery_thumbnails ] )
  .trace( 'gallery images and thumnails' )
  .bootstrap_photo_album( photo_matrix_node, photo_carousel_node, {
      album_name      : 'album'
    , images_flow     : 'gallery_images'
    , thumbnails_flow : 'gallery_thumbnails'
    , carousel_options: {
        interval: 5000,
        pause   : 'click',
        controls: {
          matrix      : true,
          play        : true,
          download    : true
        }
      }
  } )
;

var timer;

$( '.icon-matrix' )
  .mouseenter( show ) // on mouseenter display the photo matrix box
  .mouseleave( hide ) // on mouseleave close the photo matrix box
;

$( photo_matrix_node )
  .mouseover ( function() { clearTimeout( timer ) } )
  .mouseleave( hide )
;

// show photo matrix
function show() {
  if( timer ) clearTimeout( timer );
  
  $( photo_matrix_node ).removeClass( 'hide' );
}

// hide photo matrix
function hide() {
  timer = setTimeout( function() { $( photo_matrix_node ).addClass( 'hide' ) }, 600 );
}

}( this );