// projects.js

!function ( exports ) {

var $  = jQuery
  , xs     = XS.xs
  , extend = XS.extend_2
  
  , server = xs.socket_io_server()
  
  , descriptions = xs
      .set( [
        { title: 'Villa A', city: 'Marrakech', date: '06/01/2014',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut in lacus rhoncus elit egestas luctus. Nullam at lectus augue. Ut tristique'
        },
        { title: 'Villa B', city: 'Marrakech', date: '13/01/2014',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut in lacus rhoncus elit egestas luctus. Nullam at lectus augue. Ut tristique'
        },
        { title: 'Villa C', city: 'Marrakech', date: '20/01/2014',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut in lacus rhoncus elit egestas luctus. Nullam at lectus augue. Ut tristique'
        },
        { title: 'Villa D', city: 'Marrakech', date: '27/01/2014',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut in lacus rhoncus elit egestas luctus. Nullam at lectus augue. Ut tristique'
        },
        { title: 'Villa E', city: 'Marrakech', date: '02/02/2014',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut in lacus rhoncus elit egestas luctus. Nullam at lectus augue. Ut tristique'
        },
        { title: 'Villa F', city: 'Marrakech', date: '09/01/2014',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut in lacus rhoncus elit egestas luctus. Nullam at lectus augue. Ut tristique'
        }
      ] )
      
      .auto_increment()
  
  , projects_thumbnails_node = document.getElementById( 'projects_thumbnails' )
  , projects_carousel_node   = document.getElementById( 'projects_carousel'   )
;

server
  .join( descriptions, [ [ 'id', 'id' ] ], join, { left: true } )
  
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

function join( image, description ) {
  var value = {};
  
  if( image.flow === 'projects_thumbnails' ) {
    var title = description.title || '';
    
    if( description.date ) title += ' | ' + description.date;
    if( description.city ) title += ' | ' + description.city;
    
    value = extend( image, { title: title, description: description.description } );
  } else if( image.flow === 'projects_images' ) {
    value = extend( image, description );
  }
  
  return value;
}

}( this );