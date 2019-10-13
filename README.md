# Dots-animation
Simple module for adding to your html background container a canvas with fancy moving dots animation.
Animation is customizable by changing json config file.
# Quick start
Use code below to apply animation to your container (two default config jsons are placed in "config" folder):
```javascript
import { DotsAnimationFactory }  from "./dist/dots-animation.js";

DotsAnimationFactory.createDotsAnimation( // create IAnimationObject
    "#container-geometric", // id of existing HTMLElement (container for canvas)
    "canvas-geometric", // id for new HTMLCanvasElement 
    "./config/anim.config-geometric.json" // path to configuration json
    ).then((animationCanvas) => {
        animationCanvas.start(); // start amination
    });
```
# Configuration file
Configuration with default values and with comments:
```javascript
{
  // more fps - faster and smoother animation, highly affects performance
  // fps stability depends on client hardware
  "expectedFps": 60, // positive integer
  
  // dots radius is random value between minR and MaxR
  "minR": 1, // only positive values, it's desirable to use integers only
  "maxR": 3, // only positive values, it's desirable to use integers only
  
  // horizontal dots speed is random value between minSpeedX and minSpeedX  
  // vertical dots speed is random value between minSpeedY and minSpeedY
  "minSpeedX": -0.5, // any number, sigh defines direction of movement
  "minSpeedX": 0.5, // any number, sigh defines direction of movement
  "minSpeedY": -0.5, // any number, sigh defines direction of movement
  "maxSpeedY": 0.5, // any number, sigh defines direction of movement
  
  "blur": 1, // blur intensity in px, 0 - disabled
  "stroke": false, // circle dots with color
  "fill": true, // fill dots with color
  // color is picked randomly from colors array
  "colorsStroke": ["#FFC652", "#FFB652", "#FF9652"], // hex color strings array
  "colorsFill": ["#FFC652", "#FFB652", "#FF9652"], // hex color strings array
  // if opacity is set to null it will be applied randomly
  "opacityStroke": 0.1, // from 0 to 1 where 0 means transparent
  "opacityFill": null, // from 0 to 1 where 0 means transparent
  
  // number option defines maximum number of dots in canvas at the same time
  // regardless of canvas size
  // if number option is not null, density option will be ignored
  "number": null, // null or positive integer, affects performance
  // density option defines maximum number of dots per canvas pixel
  "density": 0.00010, // positive integer, affects performance
  
  "drawLines": true, // enable drawing lines between adjacent dots, most performance decreasing feature
  "lineColor": "#6566A7", // hex color string
  "lineLength": 200, // positive integer, maximum length of lines drawn between dots
  "lineWidth": 3, // positive integer
  
  "actionOnClick": false, // enable actions on mouse click
  "actionOnHover": true, // enable actions on mouse move
  "onClickCreate": true, // enable creating new dots in current mouse cursor position on click
  "onClickMove": true, // enable moving adjacent dots away from mouse cursor on click
  "onHoverMove": true, // enable moving adjacent dots away from mouse cursor on hover
  "onHoverDrawLines": true, // enable drawing lines between mouse cursor and adjacent dots
  "onClickCreateNDots": 10, // positive number, number of dots to create on mouse click
  "onClickMoveRadius": 200, // positive number, minimum distance from mouse cursor to any dot after mouse click
  "onHoverMoveRadius": 50, // positive number, minimum distance from mouse cursor to any dot
  "onHoverLineRadius": 150 // positive number, maximum length of lines drawn between mouse cursor and adjacent dots 
}
```
