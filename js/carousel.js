!function ( exports ) {
  XS.xs
    .socket_io_server()
    .model( 'carousel_images' )
    .load_images()
    .carousel( document.getElementById( 'banner' ), { interval: 10000 } )
  ;
} ( this );
