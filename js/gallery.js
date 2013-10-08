// gallery.js
!function( exports ) {

var xs = XS.xs
  , server = xs.socket_io_server()
  , carousel_images     = server.flow( 'carousel_images' ).plug( exports.carousel_images.to_uri().unique_set() ).order( [ { id: 'id' } ] )
  , carousel_thumbnails = server.flow( 'carousel_thumbnails' ).order( [ { id: 'id' } ] )
;

xs.union( [ carousel_images, carousel_thumbnails] )
  .trace( 'carousel images and thumnails' )
  .bootstrap_photo_album( document.getElementById( 'photo_matrix' ), document.getElementById( 'banner' ), {
      album          : 'album'
    , images_flow    : 'carousel_images'
    , thumbnails_flow: 'carousel_thumbnails'
  } )
;

}( this );