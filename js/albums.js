// albums.js

!function( exports ) {

// 9d02dd34-dc8d-4712-b6c6-089bc5af1fb2  Alain
// 3b5f50cb-fcae-4a79-b712-606219231cff  BSEM

var $  = jQuery
  , rs = RS.rs
  
  , server = rs.socket_io_server()
  
  , by_architect_id = rs
      
      .url_events()
      
      .url_parse ()
      
      .alter( get_architect_id, { key: [ 'architect_id' ], no_clone: true } )
      
      .last()
      
      .trace( 'filter by architect_id' )
    
  , album_thumbnails_node = document.getElementById( 'album_thumbnails' )
  , album_carousel_node   = document.getElementById( 'album_carousel'   )
;

// albums details
server
  
  .filter( by_architect_id.alter( { flow: 'albums_thumbnails' } ) )
  
  .last()
  
  .trace( 'after last()' )
  
  .alter( function( album ) {
    $( '#albums_details' ).html(
        '<div>' + album.architect_name + '</div>'
      + '<div>' + album.project_name   + '</div>'
    );
  } )
;

server.bootstrap_photo_album( album_thumbnails_node, album_carousel_node, {
    album_name     : 'album'
  , images_flow    : 'albums_images'
  , thumbnails_flow: 'albums_thumbnails'
  , query          : by_architect_id
  , play           : false
  , css_classes    : { images: '' }
  , order_id       : [ { id: 'order' } ]
} );


return;

function get_architect_id( value ) {
  var hash = value.hash;
  
  return hash === undefined ? null : { architect_id: hash.substr( 2 ) };
} // get_architect_id()

function albums_metadata( image ) {
  
  if( image.flow === 'albums_images' ) image.title = image.image_name;
  
  delete image.path;
  delete image.date;
} // albums_metadata()

}( this );