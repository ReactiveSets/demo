// projects.js

!function ( exports ) {


var xs     = XS.xs
  , server = xs.socket_io_server()
  
  // required pipelets
  , Pipelet                     = XS.Pipelet
  , Bootstrap_Photos_Matrix     = XS.Bootstrap_Photos_Matrix
  , Bootstrap_Photos_Matrix_add = Bootstrap_Photos_Matrix.prototype.add
  
  , add_class    = XS.add_class
  , remove_class = XS.remove_class
  
  // flows
  , projects_images     = server.flow( 'projects_images'     ).plug( exports.projects_images.to_uri().unique_set() )
  , projects_thumbnails = server.flow( 'projects_thumbnails' )
  
  
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
;

// -------------------------------------------------------------------------------------------
//   Projects Gellery
// -------------------------------------------------------------------------------------------

Pipelet.Compose( 'projects_gallery', function( source, dom_node, options ) {
  var flow_name       = 'projects_'
    , carousel_events = xs.pass_through() // tmp pipelet for graph loop
    
    , $thumbnails      = document.createElement( 'div' ) // projects thumbnails container
    , $carousel        = document.createElement( 'div' ) // projects carousel container
    , $modal_window    = document.createElement( 'div' ) // projects modal window
    , $btn_close       = document.createElement( 'div' )
    , carousel_options = { pause: true, interval: false, hide_controls: false }
  ;
  
  $carousel.id = 'projects_carousel';
  
  add_class( $modal_window, 'xs-modal hide'  );
  add_class( $btn_close   , 'xs-modal-close' );
  
  dom_node     .appendChild( $thumbnails   );
  $modal_window.appendChild( $btn_close    );
  $modal_window.appendChild( $carousel     );
  document.body.appendChild( $modal_window );
  
  $( '.xs-modal-close' ).click( _close );
  
  options.thumbnails_flow        || ( options.thumbnails_flow        = flow_name + 'thumbnails' );
  options.thumbnails_events_name || ( options.thumbnails_events_name = flow_name + 'select'     );
  
  options.images_flow            || ( options.images_flow            = flow_name + 'images'     );
  options.images_events_name     || ( options.images_events_name     = flow_name + 'carousel'   );
  
  var thumbnails_events = source
    .flow ( options.thumbnails_flow )
    .order( [ { id: 'id' } ] )
    .load_images()
    .projects_details( $thumbnails, options )
    .events_metadata( { name: options.thumbnails_events_name } )
    .on( 'add', _open )
  ;
  
  return source
    .flow( options.images_flow )
    .order( [ { id: 'id' } ] )
    .load_images()
    .bootstrap_carousel( $carousel, XS.extend( { input_events: thumbnails_events }, carousel_options ) )
    .events_metadata( { name: options.images_events_name } )
    .plug( carousel_events )
    .union( [ thumbnails_events ] )
  ;
  
  // open modal window
  function _open( values, options ) {
    var v = values[ 0 ];
    
    if( v.flow !== 'event' ) return;
    
    if( v.name === 'projects_select' ) {
      $( '.xs-modal' ).removeClass(     'hide'    );
      $(   'body'    ).addClass   ( 'desactivate' );
    }
  }
  
  // close modal window
  function _close() {
    $( '.xs-modal' ).addClass   (     'hide'    );
    $(   'body'    ).removeClass( 'desactivate' );
  }
} );

// Projects_Details()

function Projects_Details( dom_node, options ) {
  Bootstrap_Photos_Matrix.call( this, dom_node, options );
  
  add_class( dom_node, 'xs-projects' );
  
  return this;
}

Bootstrap_Photos_Matrix.Build( 'projects_details', Projects_Details, {
  add: function( added, options ) {
    var l = added.length;
    
    if( l === undefined ) return this;
    
    var $photos_matrix_node = this.photos_matrix_node
      , options             = this.options
      , display             = options.display
      , value, item
    ;
    
    for( var i = -1; ++i < l; ) {
      // number of thumbnails to display
      if( display && $photos_matrix_node.childNodes.length >= display ) continue;
      
      Bootstrap_Photos_Matrix_add.call( this, [ value = added[ i ] ], options );
      
      item = $photos_matrix_node.lastChild;
      
      var title = document.createElement( 'h4' )
        , descr = document.createElement( 'p'  )
        , image = item.firstChild
      ;
      
      if( value.title       ) title.innerHTML  = value.title;
      if( value.city        ) title.innerHTML += ' | ' + value.city;
      if( value.date        ) title.innerHTML += ' | ' + value.date;
      if( value.description ) descr.innerHTML  = value.description;
      
      add_class   ( item , 'col-md-3'      );
      remove_class( image, 'img-thumbnail' );
      
      if( value.title || value.city || value.date ) item.appendChild( title );
      if(            value.description            ) item.appendChild( descr );
    }
    
    return this;
  } // add()
} );

xs.union( [ projects_thumbnails, projects_images ] )
  .join( descriptions, [ [ 'id', 'id' ] ], join )
  .projects_gallery( document.getElementById( 'projects' ), { display: 4 } )
;

// function join()
function join( image, description ) {
  return XS.extend( { title: description.title, city: description.city, date: description.date, description: description.description }, image );
} // join()

}( this );