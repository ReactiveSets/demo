// gallery.js
!function( exports ) {

var xs = XS.xs
  , server = xs.socket_io_server()
  , gallery_images     = server.flow( 'gallery_images'     ).plug( exports.gallery_images.to_uri().unique_set() ).order( [ { id: 'id' } ] )
  , gallery_thumbnails = server.flow( 'gallery_thumbnails' ).order( [ { id: 'id' } ] )
;

xs.union( [ gallery_images, gallery_thumbnails ] )
  .trace( 'gallery images and thumnails' )
  .bootstrap_photo_album( document.getElementById( 'photo_matrix' ), document.getElementById( 'photo_carousel' ), {
      album          : 'album'
    , images_flow    : 'gallery_images'
    , thumbnails_flow: 'gallery_thumbnails'
  } )
;

// mouse events
var timer;

jQuery( '#photo_matrix_control' ).mouseenter( show );  // on mouseenter display the photo matrix box

jQuery( '#photo_matrix' )
  .mouseover ( function() { clearTimeout( timer ); } ) // on mouseover clear timer to prevent box closing
  .mouseleave( hide )                                  // on mouseleave close the photo matrix box

// show photo matrix
function show() {
  jQuery( '#photo_matrix' ).removeClass( 'hide' );
}

// hide photo matrix
function hide() {
  timer = setTimeout( function() { jQuery( '#photo_matrix' ).addClass( 'hide' ) }, 600 );
}

}( this );