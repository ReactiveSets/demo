// gallery.js

XS.xs
  .socket_io_server()
  .order( [ { id: 'id' } ] )
  .bootstrap_photo_album( document.getElementById( 'photo_matrix' ), document.getElementById( 'banner' ), {
      album          : 'album'
    , images_flow    : 'carousel_images'
    , thumbnails_flow: 'carousel_thumbnails'
  } )
;
