!function ( exports ) {
  var $ = jQuery, xs = XS.xs;
  
  var images = xs
    .set( [
      { src: 'images/16.jpg', title: 'Villa à Geneve'    },
      { src: 'images/15.jpg', title: 'Villa à Geneve'    },
      { src: 'images/14.jpg', title: 'Villa à Geneve'    },
      { src: 'images/17.jpg', title: 'Villa à Geneve'    },
      { src: 'images/12.jpg', title: 'Lotus Club'        },
      { src: 'images/13.jpg', title: 'Lotus Club'        },
      { src: 'images/01.jpg', title: 'Villa à Marrakech' },
      { src: 'images/03.jpg', title: 'Villa à Marrakech' },
      { src: 'images/04.jpg', title: 'Villa à Marrakech' },
      { src: 'images/05.jpg', title: 'Villa à Marrakech' },
      { src: 'images/06.jpg', title: 'Villa à Marrakech' },
      { src: 'images/07.jpg', title: 'Villa à Marrakech' },
      { src: 'images/09.jpg', title: 'Villa à Marrakech' },
      { src: 'images/11.jpg', title: 'Résidence Deroua'  }
    ], { auto_increment: true } )
    .load_images()
    .carousel( document.getElementById( 'banner' ) )
  ;
  
  var $banner = $( '#banner'       )
    , $form   = $( '#contact_form' )
  ;
  
  $banner.length && $banner.carousel( { interval: 10000 } );
} ( this );
