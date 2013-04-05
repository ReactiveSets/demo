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
      , style    : { field: 'span4', label: 'control-label', container: 'control-group' }
      , mandatory: true
    },
    {
        id       : 'email'
      , name     : 'email'
      , type     : 'email'
      , label    : 'Email'
      , style    : { field: 'span4', label: 'control-label', container: 'control-group' }
      , mandatory: true
    },
    {
        id     : 'compagnie'
      , name   : 'compagnie'
      , type   : 'text'
      , label  : 'Société'
      , style: { field: 'span4', label: 'control-label', container: 'control-group' }
    },
    {
        id       : 'message'
      , name     : 'message'
      , type     : 'text_area'
      , label    : 'Message'
      , rows     : 8
      , style    : { field: 'input-xlarge span7', label: 'control-label', container: 'control-group demo' }
      , mandatory: true
    }
  ], {
      submit_label: 'Envoyer'
    , style : {
        submit_button: 'btn btn-primary',
        error        : 'error',
        success      : 'success'
      }
  } )
    .socket_io_server()
  ;
} ( this );
