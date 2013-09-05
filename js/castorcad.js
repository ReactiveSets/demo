!function ( exports ) {
  var $ = jQuery, xs = XS.xs;
  
  var images = xs
    .set( [
      { name: 'images/16.jpg', title: 'Villa à Geneve'    },
      { name: 'images/15.jpg', title: 'Villa à Geneve'    },
      { name: 'images/14.jpg', title: 'Villa à Geneve'    },
      { name: 'images/17.jpg', title: 'Villa à Geneve'    },
      { name: 'images/12.jpg', title: 'Lotus Club'        },
      { name: 'images/13.jpg', title: 'Lotus Club'        },
      { name: 'images/01.jpg', title: 'Villa à Marrakech' },
      { name: 'images/03.jpg', title: 'Villa à Marrakech' },
      { name: 'images/04.jpg', title: 'Villa à Marrakech' },
      { name: 'images/05.jpg', title: 'Villa à Marrakech' },
      { name: 'images/06.jpg', title: 'Villa à Marrakech' },
      { name: 'images/07.jpg', title: 'Villa à Marrakech' },
      { name: 'images/09.jpg', title: 'Villa à Marrakech' },
      { name: 'images/11.jpg', title: 'Résidence Deroua'  }
    ], { auto_increment: true } )
    .load_images()
    .carousel( document.getElementById( 'banner' ) )
  ;
  
  var $banner = $( '#banner'       )
    , $form   = $( '#contact_form' )
  ;
  
  $banner.length && $banner.carousel( { interval: 10000 } );
} ( this );
