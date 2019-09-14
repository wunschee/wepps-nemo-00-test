# \<wepps-nemo-00-test\>

App for **_OpenUI5 Full-Stack Development_**

N: Node.JS

E: Express

M: MongoDB, mongoose (Atlas cloud service)

O: OpenUI5 browser library

## Sections

- [Architecture](#architecture)
- [Language](#language)
- [Development tool](#development-tool)
- [Testing tool](#testing-tool)
- [App location](#app-location)
- [Remote services](#remote-services)
- [Local CDN for OpenUI5](#local-cdn-for-openui5)
- [Automated distribution](#automated-distribution)

## Architecture

OpenUI5 *(v1.67.1)* [download](https://openui5.hana.ondemand.com)

## Language

JavaScript, XML

## Development tool

Visual Studio Code *(v1.37.0)* [download](https://code.visualstudio.com)

## Testing tool

Lite server (Node.js) [download](https://nodejs.org/en/)

## App location

Intranet: <https://hahu_openui5/sites/pmtool>

## Remote services

* *https://hahu_openui5/services/general*
* *https://hahu_openui5/services/application*
* *https://hahu_openui5/services/pmtool*

## Local CDN for OpenUI5

* *https://hahu_openui5/resources/1.67.1/resources/sap-ui-core.js*

## Automated distribution

- *npm run gulp* for creating Component-preload.js and preparation of /dist directory
- *.\_Distributor.ps1* for distribution from /dist to IIS windows share