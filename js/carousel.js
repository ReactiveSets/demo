// carousel.js
!function ( exports ) {

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
        },
        {
          title      :   "Services aux Architectes",
          description:   "Visualisation 3D réalistes de très haute qualité, utilisant les dernières technologies de rendu issues des développements "
                       + "de l'animation 3D pour le cinéma. Permet aux architectes de proposer à leurs clients un dossier d'architecture à la pointe des technologies."
        },
        {
          title      :   "Prévenir les Surprises",
          description:   "Nous proposons des images réalistes en HD intérieur et extérieur ainsi que des vidéos de tours virtuels permettant à vos clients "
                       + "de visualiser leur projet avant la réalisation et permettant ainsi de limiter au maximum les coûts de modifications en cours de chantier."
        },
        {
          title      :   "Satisfaction Totale",
          description:   "Notre approche de satisfaction totale de nos clients est basée sur un professionnalisme exemplaire, tant en terme de qualité du résultat, "
                       + "qu'en terme de respect des délais convenus. Notre travail de collaboration directe avec les architectes et leurs designers se fait dans le "
                       + "respect de la confidentialité et une interaction réactive et proactive."
        }
      ] )
      .auto_increment()
;

xs
  .socket_io_server()
  .flow( 'carousel_images' )
  .plug( exports.carousel_images.to_uri().unique_set() )
  .load_images()
  .join( descriptions, [ [ 'id', 'id' ] ], join )
  .bootstrap_carousel( document.getElementById( 'banner' ), { interval: 10000 } )
;

// function join()
function join( image, description ) {
  return XS.extend( { title: description.title, description: description.description }, image );
} // join()

}( this );