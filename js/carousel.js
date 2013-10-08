// carousel.js
!function ( exports ) {

XS.xs
  .socket_io_server()
  .flow( 'carousel_images' )
  .plug( exports.carousel_images.to_uri().unique_set() )
  .load_images()
  .bootstrap_carousel( document.getElementById( 'banner' ), { interval: 10000 } )
;

}( this );