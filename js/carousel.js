// carousel.js

XS.xs
  .socket_io_server()
  .model( 'carousel_images' )
  .load_images()
  .bootstrap_carousel( document.getElementById( 'banner' ), { interval: 10000 } )
;
