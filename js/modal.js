// navigation.js

!function ( exports ) {

var $ = jQuery;


$( '#projects_thumbnails, #album_thumbnails' ).click( _open  );

$( '.xs-modal' ).click( _close );

$( exports ).keyup( _close );

return;

// open modal window
function _open( e ) {
  if( e.target.nodeName === 'IMG' ) $( '.xs-modal' ).removeClass( 'hide' );
}

// close modal window
function _close( e ) {
  $target = $( e.target );
  
  switch( e.type ) {
    case 'click':
      if( $target.hasClass( 'xs-modal-close' ) || $target.hasClass( 'xs-modal' ) ) _close_modal();
    break;
    
    case 'keyup':
      if( ! $( '.xs-modal' ).hasClass( 'hide' ) && e.keyCode === 27 ) _close_modal();
    break;
  }
  
  return;
  
  function _close_modal() {
    $( '.xs-modal' ).addClass( 'hide' );
  }
}

}( this );