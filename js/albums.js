// albums.js

!function( exports ) {

// 76e8c857-0c49-4aba-9af3-7e0d3dfc3e12
// 7d78d170-f1b4-4083-baf4-b916091dd27b
// c27b1943-8406-4f33-8597-8d3d6b7b7236

var $  = jQuery
  , xs = XS.xs
  
  , server        = xs.socket_io_server()
  , albums_images = server
      .flow( 'albums_images' )
      .plug( exports.albums_images.unique_set() )
  
  // , gallery_thumbnails  = server.flow( 'gallery_thumbnails' )
  , album_thumbnails_node = document.getElementById( 'album_thumbnails' )
  , album_carousel_node   = document.getElementById( 'album_carousel'   )
;

var by_album_id = xs
  .url_events()
  .url_parse ()
  .alter( get_album_id, { key: [ 'album_id' ], no_clone: true } )
  .last()
  .trace( 'filter by album_id' )
;

albums_images
  .filter( by_album_id )
  .alter( fix_image_name ).to_uri()
  .trace( 'current album images uris' )
  .bootstrap_photo_album( album_thumbnails_node, album_carousel_node, {
      album_name      : 'album_' //hash
    , images_flow     : 'albums_images'
    , thumbnails_flow : 'albums_images' // album_thumbnails
    , carousel_options: { pause: true, interval: false, hide_controls: false }
  } )
;

$(    album_thumbnails_node    ).click( _open  );
$( '.album-carousel-container' ).click( _close );

$( exports ).keyup( _close );

return;

// show
function _open( e ) {
  if( e.target.nodeName === 'IMG' ) $( '.album-carousel-container' ).removeClass( 'hide' );
}

// hide
function _close( e ) {
  $target = $( e.target );
  
  switch( e.type ) {
    case 'click':
      if( $target.hasClass( 'xs-modal-close' ) || $target.hasClass( 'album-carousel-container' ) ) _close_modal();
    break;
    
    case 'keyup':
      if( ! $( '.album-carousel-container' ).hasClass( 'hide' ) ) _close_modal();
    break;
  }
  
  return;
  
  function _close_modal() {
    console.log( e.type );
    
    $( '.album-carousel-container' ).addClass( 'hide' );
  }
}

function fix_image_name( image ) {
  return XS.extend_2( image, { name: 'albums/' + image.album_id + '/' + image.name } );
}

function get_album_id( value ) {
  var hash = value.hash;
  
  return hash === undefined ? {} : { album_id: hash.substr( 2 ) };
}

}( this );