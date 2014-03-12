// gallery.js
!function( exports ) {

var $  = jQuery
  , xs = XS.xs
  
  , server      = xs.socket_io_server()
    
  , gallery_thumbnails_node = document.getElementById( 'gallery_thumbnails' )
  , gallery_carousel_node   = document.getElementById( 'gallery_carousel'   )
;

server
  .bootstrap_photo_album( gallery_thumbnails_node, gallery_carousel_node, {
      album_name     : ''
    , images_flow    : 'gallery_images'
    , thumbnails_flow: 'gallery_thumbnails'
    , auto_start     : false
    , download       : false
  } )
;

var $controls = $( '.gallery-thumbnails-controls'  )
  , $slider   = $( '.gallery-thumbnails-container' )  // this.slider = slider
  , $content  = $( '#gallery_thumbnails'           )  // this.content = slider.children().first()
  
  , item_index = 0, offset = 2 // offset for div margin: 2px
;

$controls.click( function( e ) {
  var $target     = $( e.target )
    , $pages      = $content.children() // this.pages = content.children()
    , total_item  = $pages.length
    , total_width = 0
  ;
  
  // set the viewport width
  $pages.each( function ( index, page ) {
    total_width += $( page ).width();
  } );
  
  $content.width( total_width );
  
  if( $target.hasClass( 'glyphicon-chevron-left' ) && ! $target.parent().hasClass( 'desactive' ) ) {
    if( item_index > 0 ) move( item_index -= 1 );
  }
  
  if( $target.hasClass( 'glyphicon-chevron-right' ) && ! $target.parent().hasClass( 'desactive' ) ) {
    if( item_index < total_item ) move( item_index += 1 );
  }
  
  return;
  
  function move( index ) {
    var position = $pages.eq( index ).position()
      , delta    = total_width - $slider.width() // difference between the viewport and the container
      , rest     = ( total_width - $slider.width() - position.left ) + ( index * offset )
      , amount   = -1 * position.left
    ;
    
    $( '.gallery-thumbnails-controls.left'  )[ index === 0 ? 'addClass' : 'removeClass' ]( 'desactive' );
    $( '.gallery-thumbnails-controls.right' )[ rest   <  0 ? 'addClass' : 'removeClass' ]( 'desactive' );
    
    if( rest < 0 ) amount += Math.abs( rest ) + 2;
    
    $content
      .css( 'transition', 'all 500ms ease' )
      .css( 'transform' , 'translate3d( ' + amount + 'px, 0, 0 )' )
    ;
  }
} );
}( this );