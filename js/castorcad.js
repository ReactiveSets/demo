!function ( exports ) {
  var $ = jQuery, xs = XS.xs;
  
  xs
    .socket_io_server()
    .model( 'carousel_images' )
    .load_images()
    .carousel( document.getElementById( 'banner' ) )
  ;
  
  var $banner = $( '#banner' );
  
  $banner.length && $banner.carousel( { interval: 10000 } );
} ( this );
