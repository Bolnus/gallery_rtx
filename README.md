# Gallery frontend

This is a frontent part of Gallery project. Backend part lives [here](https://github.com/Bolnus/gallery_backend). 
The app is used to display albums with images. The albums can be searched through their names and tags. Images can be viewed in full page mode one by one. Albums tags and headers can be edited.

This is a `create react app` project which is written with `typescript`. `Redux toolkit` is used as state manager.

### Desktop resolution preview

![Desktop](https://github.com/Bolnus/gallery_rtx/blob/master/public/gallery_desktop_2.gif?raw=true)

### Mobile resolution preview

![Mobile](https://github.com/Bolnus/gallery_rtx/blob/master/public/gallery_mobile.gif?raw=true)

## Preinst

Software required:
- npm 10.2.4
- NodeJS 20.11.0

## Installation

1. Run `npm install` in the root project directory. 
2. Copy `template.env` file contents to a new `.env` file.
3. Navigate to `reverse-proxy/` subdirectory and run `npm install` there. 
4. Copy `template.env` file contents to a new `.env` file
- change BACKEND_ADDR here in case your backend app is not local or the port number is different.

## Execute

1. In the project directory run reverse proxy with `node reverse-proxy/index.js`.
2. In the project directory run the main react app with `npm start`.
