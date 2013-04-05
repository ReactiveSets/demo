!function ( exports ) {
  var $ = jQuery;
  
  var $banner = $( '#banner'       )
    , $form   = $( '#contact_form' )
  ;
  
  $banner.length && $banner.carousel( { interval: 10000 } );
} ( this );
