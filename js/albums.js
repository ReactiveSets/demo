// albums.js

!function( exports ) {

// 76e8c857-0c49-4aba-9af3-7e0d3dfc3e12 // deroua
// 7d78d170-f1b4-4083-baf4-b916091dd27b // daien
// c27b1943-8406-4f33-8597-8d3d6b7b7236 // dian

var $  = jQuery
  , xs = XS.xs
  
  , server      = xs.socket_io_server()
  , by_album_id = xs
      .url_events()
      .url_parse ()
      .alter( get_album_id, { key: [ 'album_id' ], no_clone: true } )
      .last()
      .trace( 'filter by album_id' )
    
  , album_thumbnails_node = document.getElementById( 'album_thumbnails' )
  , album_carousel_node   = document.getElementById( 'album_carousel'   )
;

server
  .bootstrap_photo_album( album_thumbnails_node, album_carousel_node, {
      album_name     : 'album' //hash
    , images_flow    : 'albums_images'
    , thumbnails_flow: 'albums_thumbnails' // album_thumbnails
    , query          : by_album_id
    , auto_start     : false
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
      if( ! $( '.album-carousel-container' ).hasClass( 'hide' ) && e.keyCode === 27 ) _close_modal();
    break;
  }
  
  return;
  
  function _close_modal() {
    $( '.album-carousel-container' ).addClass( 'hide' );
  }
}

function get_album_id( value ) {
  var hash = value.hash;
  
  return hash === undefined ? {} : { album_id: hash.substr( 2 ) };
}

}( this );