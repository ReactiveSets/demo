// navigation.js

!function ( exports ) {

var $ = jQuery
  
  , $navigation  = $( '#navigation ul' )
  , options_list = '<option value="" disabled>Navigation...</option>'
  , page_name    = window.location.pathname.substr( 1 )
;

$navigation
  .find ( 'li' )
  .each ( make_drop_down )
  .end  ()
  .after( '<select class="res-menu">' + options_list + '</select>' )
;

$( '.res-menu' ).on( 'change', function() { window.location = $( this ).val() } );

$().UItoTop( { easingType: 'easeOutQuart' } );

return;

// make drop down options list from navigation li
function make_drop_down() {
  var $a       = $( this ).children( 'a' )
    , value    = $a.attr( 'href' )
    , title    = $a.text()
    , selected = page_name === value ? 'selected' : ''
  ;
  
  options_list += '<option value="' + value + '" ' + selected + '>' + title + '</option>';
} // make_drop_down()

}( this );