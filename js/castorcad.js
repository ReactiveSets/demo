!function ( exports ) {
  var $ = jQuery, xs = exports.XS.xs;
  
  var $banner = $( '#banner'       )
    , $form   = $( '#contact_form' )
  ;
  
  $banner.length && $banner.carousel( { interval: 10000 } );
  
  xs.form( document.getElementById( 'contact_form' ), 'contact_form', [
    { 
        id   : 'model'
      , name : 'model'
      , type : 'hidden'
      , value: 'user_profile'
    },
    { 
        id   : 'id'
      , name : 'uuid'
      , type : 'hidden'
      , value: { type: 'UUID' }
    },
    { 
        id       : 'name'
      , name     : 'name'
      , type     : 'text'
      , label    : 'Nom & Prénom'
      , classes  : { input: 'span4', container: 'control-group' }
      , mandatory: true
    },
    { 
        id       : 'email'
      , name     : 'email'
      , type     : 'email'
      , label    : 'Email'
      , classes  : { input: 'span4', container: 'control-group' }
      , mandatory: true
    },
    {
        id     : 'compagnie'
      , name   : 'compagnie'
      , type   : 'text'
      , label  : 'Société'
      , classes: { input: 'span4', container: 'control-group' }
    },
    { 
        id       : 'message'
      , name     : 'message'
      , type     : 'text_area'
      , label    : 'Message'
      , rows     : 8
      , classes  : { input: 'input-xlarge span7', container: 'control-group' }
      , mandatory: true
    } ] )
    
    .socket_io_server()
  ;
} ( this );
