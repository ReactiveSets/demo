// gallery.js
!function( exports ) {

var $  = jQuery
  , xs = XS.xs
  
  , server              = xs.socket_io_server()
  , gallery_images      = server.flow( 'gallery_images'     ).plug( exports.gallery_images.to_uri().unique_set() )
  , gallery_thumbnails  = server.flow( 'gallery_thumbnails' )
  
  , photo_matrix_node   = document.getElementById( 'gallery_thumbnails' )
  , photo_carousel_node = document.getElementById( 'gallery_carousel'   )
;

xs.union( [ gallery_images, gallery_thumbnails ] )
  .trace( 'gallery images and thumnails' )
  .bootstrap_photo_album( photo_matrix_node, photo_carousel_node, {
      album_name      : 'album'
    , images_flow     : 'gallery_images'
    , thumbnails_flow : 'gallery_thumbnails'
    , carousel_options: {
        interval: false,
        pause   : true,
        controls: {
          xmatrix : true,
          xplay   : true
        }
      }
  } )
  .on( 'complete', set_thumbnails_width )
;

var $controls   = $( '.gallery-thumbnails-controls'  )
  , $container  = $( '.gallery-thumbnails-container' )
  , $thumbnails = $( '#gallery_thumbnails'           )
  , nbr_thmbnails  = 0
;

$controls.click( function( e ) {
  var $target  = $( e.target )
    , viewport_width      = $container.width()
    , thumbnails_width    = $thumbnails.width()
    , thumbnails_position = $thumbnails.position().left
    , sliding_step        = ( thumbnails_width / nbr_thmbnails ) * 3
  ;
  
  if( $target.hasClass( 'right' ) ) {
    A = thumbnails_width - viewport_width + thumbnails_position;
    
    if( A >= 0 && A < sliding_step ) sliding_step = A + 1;
    
    if( A > 0 ) $thumbnails.animate( { 'left': '-=' + sliding_step + 'px' }, 'medium' );
  }
  
  
  if( $target.hasClass( 'left' ) ) {
    if( Math.abs( thumbnails_position ) < sliding_step ) sliding_step = Math.abs( thumbnails_position );
    
    if( thumbnails_position !== 0 ) $thumbnails.animate( { 'left': '+=' + sliding_step + 'px' }, 'medium' );
  }
} );


function _left ( $node ) { $node.animate( { 'left': '+=120px' }, 'slow' ) }
function _right( $node ) { $node.animate( { 'left': '-=120px' }, 'slow' ) }

// set the thumbnails viewport width when the thumbnails are loaded
function set_thumbnails_width() {
  var width = 0
    , nodes = $thumbnails.children()
    , l     = nbr_thmbnails = nodes.length
  ;
  
  for( var i = l; i; ) width += nodes[ --i ].offsetWidth + 2;
  
  $thumbnails.width( width );
}

/*
var timer, hide_matrix_timer = 600;

if( ( /iPhone|iPad|Android/i ).test( navigator.userAgent ) ) {
  Hammer( photo_carousel_node ).on( 'tap', show );
  Hammer( photo_matrix_node   ).on( 'tap', hide );
  
  hide_matrix_timer = 300;
} else {
  $( '.icon-matrix' )
    .mouseenter( show ) // on mouseenter display the photo matrix box
    .mouseleave( hide ) // on mouseleave close the photo matrix box
  ;
  
  $( photo_matrix_node )
    .mouseover ( function() { clearTimeout( timer ) } )
    .mouseleave( hide )
  ;
}

return;

// show photo matrix
function show() {
  if( timer ) clearTimeout( timer );
  
  $( photo_matrix_node ).removeClass( 'hide' );
  
  return;
}

// hide photo matrix
function hide() {
  timer = setTimeout( function() { $( photo_matrix_node ).addClass( 'hide' ) }, 600 );
  return;
}
*/
}( this );