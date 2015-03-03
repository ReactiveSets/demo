// navigation.js

!function ( exports ) {

var $ = jQuery;


$( '#projects_thumbnails, #album_thumbnails' ).click( _open  );

$( '.rs-modal' ).click( _close );

$( exports ).keyup( _close );

return;

// open modal window
function _open( e ) {
  console.log( 'here trash', e.target.nodeName === 'IMG' );
  
  if( e.target.nodeName === 'IMG' ) $( '.rs-modal' ).removeClass( 'hide' );
}

// close modal window
function _close( e ) {
  $target = $( e.target );
  
  switch( e.type ) {
    case 'click':
      if( $target.hasClass( 'rs-modal-close' ) || $target.hasClass( 'rs-modal' ) || $target.parent().hasClass( 'rs-modal' ) ) _close_modal();
    break;
    
    case 'keyup':
      if( ! $( '.rs-modal' ).hasClass( 'hide' ) && e.keyCode === 27 ) _close_modal();
    break;
  }
  
  return;
  
  function _close_modal() {
    $( '.rs-modal' ).addClass( 'hide' );
  }
}

}( this );