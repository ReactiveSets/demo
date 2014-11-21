// contact.js

!function ( exports ) {
  var rs = exports.RS.rs;
  
  var contact_form_fields = rs
    .socket_io_server()
    
    .flow( 'contact_form_fields' )
    
    .trace( 'contact_form_fields after filter' )
  ;
  

  // use exports.contact_form_fields to load form fields faster
  // use unique_set() to prevent duplicated fields once connected to socket server
  // this allows fast loading and dynamic fields
  
  contact_form_fields = rs
    // ToDo: fix unique_set()
    .union( [ exports.contact_form_fields/*, contact_form_fields*/ ] )
    
    .unique_set()
    
    .order( [ { id: "order_id" } ] )
    
    .trace( 'contact_form_fields ordered' )
  ;
  
  rs.form( document.getElementById( 'contact_form' ), 'contact_form', contact_form_fields,
    {
      submit_label: 'ENVOYER',
      
      style : {
        form         : 'form-horizontal',
        submit_button: 'btn pull-right',
        error        : 'has-error',
        success      : 'has-success',
        help_text    : 'help-block'
      }
    } )
    
    // send valid and submited form to server
    .socket_io_server()
  ;
}( this );
