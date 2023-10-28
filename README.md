# Overview

I'm doing this project to get a feel for the ARCGIS JavaScript SDK API and practice using the ES modules. 

Currently the Software just works with live server to display a map of Teton National Park and including trailhead data from the National Park Service. Other datasets could easily be added as layers or features of the map. 

My purpose was to get some practice with using the ARCGIS API with Javascript.


[Software Demo Video](https://youtu.be/DBPxeeuYmsA)

# Development Environment

I worked with a variety of tools during development, but the finished product does not use them all. I experimented with AMD modules, Typescript, and finally settled on the ES Modules feature with some NodeJS. @arcgis/core should be installed using npm. 

I used JavaScript, HTML, CSS, @arcgis/core, and a subset of arcgis modules described in their API documetation. Live Server was used for testing. I have not deployed this map yet. 

# Useful Websites

* [NPS open data ArcGIS](https://public-nps.opendata.arcgis.com/datasets/nps::grand-teton-national-park-trailhead/about)
* [Esri API Docs](https://developers.arcgis.com/javascript/latest/tooling-intro/)

# Future Work

* I would like to deploy the map to a hosting service. 
* I would like to try deploying with REACT as I have not used that in depth before
* I would like to add more layers and filters for this and other datasets.
* I'd like to implement oauth so I can use the edit feature to edit instead of just displaying data.