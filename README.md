Demo
====

This repository serves as a demonstration and beta test web application for the ConnectedSets Web Application Framework under node.

The front-end CSS is developped using the responsive framework Bootstrap.

This demonstration is running at http://www.castorcad.com/

Installation
============
````
git clone https://github.com/ConnectedSets/demo.git

npm install
````

The gallery page in this demo creates thumbnails using ImageMagick, that you also need to install on your system.
You can [download ImageMagick here](http://www.imagemagick.org/script/binary-releases.php).

If you do not have ImageMagick installed on your system, the demo will still work except for the thumbnails.

Running the server
==================
````
node demo/server.js
````

Then load the page at [http://localhost:8080/](http://localhost:8080/)

Licence
=======
The source code of the web site is licenced under AGPLv3

Images and text content may be copyrighted by their respective owners, please contact the demonstration site owner for more information regarding images licencing.
