// projects.js

!function ( exports ) {

var $  = jQuery
  , rs     = RS.rs
  , extend = RS.extend
  
  , server = rs.socket_io_server()
  
  , descriptions = rs
      .set( [
        { title: 'Hotel Ambassadeurs', city: 'Marrakech' , date: '03/2014' },
        {                              city: 'Casablanca', date: '02/2014' },
        { title: 'Villa A'           , city: 'Marrakech' , date: '01/2014' },
        { title: 'Villa B'           , city: 'Marrakech' , date: '01/2014' }
      ] )
      
      .auto_increment()
      .trace( 'descriptions' )
      
  , projects_thumbnails = server
      .flow( 'projects_thumbnails' )
      .set()
      .join( descriptions, [ [ 'id', 'id' ] ], join_projects_thumbnails, { left: true } )
      .trace( 'projects_thumbnails' )
  
  , projects_images = server
      .flow( 'projects_images' )
      .set()
      .join( descriptions, [ [ 'id', 'id' ] ], join_projects_images,     { left: true } )
      .trace( 'projects_images' )
      
  , projects_thumbnails_node = document.getElementById( 'projects_thumbnails' )
  , projects_carousel_node   = document.getElementById( 'projects_carousel'   )
;

rs.union( [ projects_thumbnails, projects_images ] )
  
  .bootstrap_photo_album( projects_thumbnails_node, projects_carousel_node, {
      album_name     : 'projects'
    , images_flow    : 'projects_images'
    , thumbnails_flow: 'projects_thumbnails'
    , play           : false
    , css_classes    : { containers: 'col-md-3' }
    , max_thumbnails : 4
  } )
;

return;

function join_projects_thumbnails( image, description ) {
  if ( description ) {
    var title = description.title || '';
    
    if( description.date ) title += ' | ' + description.date;
    if( description.city ) title += ' | ' + description.city;
    
    return extend( {}, image, { title: title, description: description.description } );
  } else {
    return image;
  }
} // join_projects_thumbnails()

function join_projects_images( image, description ) {
  return extend( {}, image, description );
} // join_projects_images()

}( this );