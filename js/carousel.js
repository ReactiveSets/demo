// carousel.js
!function ( exports ) {
/*
var xs = XS.xs
  , descriptions = xs
      .set( [
        {
          title      :   "CastorCAD",
          description:   "CastorCAD est le fruit de la réunion d’une équipe de passionnés d’animation 3D désireux de faire profiter les architectes et leurs clients des "
                       + "dernières technologies de rendu haute définition afin d’augmenter la qualité et le professionnalisme de la réalisation de projets."
        },
        {
          title      :   "Collaborateurs",
          description:   "Nos collaborateurs sont formés à l'utilisation des logiciels de modélisation et de rendu 3D dernière génération. Issus de grandes écoles "
                       + "internationales ou autodidactes passionnés, nous recrutons en fonction de compétences vérifiées par un portefeuille de réalisations."
        },
        {
          title      :   "Serveurs",
          description:   "Nos serveurs de dernière génération permettent un rendu de la plus haute qualité dans des délais rapides compatibles avec des clients de plus en plus exigeants."
        }
      ] )
      .auto_increment()
  
  , carousel_images = xs
      .socket_io_server()
      .flow( 'carousel_images' )
;

carousel_images = xs
  .union( [ exports.carousel_images.to_uri(), carousel_images ] )
  
  .unique_set()
  
  .load_images()
  
  // .join( descriptions, [ [ 'id', 'id' ] ], join )
  .bootstrap_carousel( document.getElementById( 'slider' ), { interval: 8000, auto_start: true } )
;

// function join()
function join( image, description ) {
  return XS.extend( { title: description.title, description: description.description }, image );
} // join()
*/

xs
  .socket_io_server()
  
  .flow( 'carousel_images' )
  
  .load_images()
  
  .bootstrap_carousel( document.getElementById( 'slider' ), { interval: 8000, auto_start: true } )
;

}( this );
