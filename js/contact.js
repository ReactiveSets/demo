!function ( exports ) {
  var xs = exports.XS.xs;
  
  var contact_form_fields = xs
    .socket_io_server()
    .model( 'contact_form_fields' )
    .trace( 'contact_form_fields' )
    .set() // store contact_form_fields and prevent form from fetching indefinitly
  ;
  
  xs.form( document.getElementById( 'contact_form' ), 'contact_form', contact_form_fields,
    {
      submit_label: 'Envoyer',
      
      style : {
        submit_button: 'btn btn-primary',
        error        : 'error',
        success      : 'success'
      }
    } )
    
    // send valid and submited form to server
    .socket_io_server()
  ;
}( this );
