!function ( exports ) {
  var xs = exports.XS.xs;
  
  var contact_form_fields = xs
    .socket_io_server()
    
    .flow( 'contact_form_fields' )
    
    // use exports.contact_form_fields to load form fields faster
    // use unique_set() to prevent duplicated fields once connected to socket server
    // this allows fast loading and dynamic fields
    .plug( exports.contact_form_fields.unique_set() )
    
    .order( [ { id: "order_id" } ] )
    
    .trace( 'contact_form_fields ordered' )
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
