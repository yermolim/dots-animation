# Dots-animation
<p align="left">
    <a href="https://www.npmjs.com/package/dots-animation"><img
            src="https://img.shields.io/npm/v/dots-animation" alt="Npm"></a>
    <a href="https://github.com/yermolim/dots-animation/blob/master/LICENSE"><img
            src="https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-round" alt="License"></a>
    <br>
</p>
Simple module for adding to your html background container a canvas with fancy responsive dots animation.
![](demo.gif)

### Current features
<ul>
    <li>highly customizable</li>
    <li>high dpi screens support</li>
    <li>mouse interaction</li>
    <li>auto-resize</li>
    <li>light codebase: no dependencies</li>
    <li>umd and esm bundles</li>
    <li>written in typescript</li>
    <li>canvas based</li>
</ul>

## Getting started

### Install and initialize
#### With npm
```
npm install dots-animation
```

```javascript
import { DotsAnimationFactory, IAnimationOptions, IAnimationControl } from "dots-animation";

const options = {}; // provide your options implementing 'IAnimationOptions' interface
const animationControl = DotsAnimationFactory
  .createAnimation("#container-selector", "id-for-new-canvas", options);
animationControl.start(); // 'stop' and 'pause' methods are also provided
```

#### Or using CDN
```html
<script src="https://unpkg.com/dots-animation/dist/index.umd.min.js"></script>
```
```javascript
const factory = const factory = dotsAnim.DotsAnimationFactory;
const options = {};
const animationControl = factory
  .createAnimation("#container-selector", "id-for-new-canvas", options);
animationControl.start();
```

#### ⚠️for chart to function properly its container element must have relative, absolute or fixed position!

# Set your options
you can override default options by passing object with properties available in 'IAnimationOptions' interface

<details><summary>ℹ️ complete list of 'IAnimationOptions' properties with comments</summary>
<p>
  
```javascript
{
  // more fps - faster and smoother animation, highly affects performance
  // fps stability depends on client hardware
  expectedFps: 60, // positive integer  

  // number option defines maximum number of dots in canvas at the same time
  // regardless of canvas size
  // if number option is not null, density option will be ignored
  number: null, // null or positive integer, affects performance
  // density option defines maximum number of dots per canvas pixel
  density: 0.00005, // positive number, affects performance

  "dprDependentDensity": true, // use dpr in density calculation  
  "drpDependentDimensions": true, // use dpr in size and speed calculations

  // dots radius is random value between minR and MaxR
  minR: 1, // only positive values, it's desirable to use integers only for faster calculations
  maxR: 6, // only positive values, it's desirable to use integers only for faster calculations
  
  // horizontal dots speed is random value between minSpeedX and minSpeedX  
  // vertical dots speed is random value between minSpeedY and minSpeedY
  minSpeedX: -0.5, // any number, sigh defines direction of movement
  minSpeedX: 0.5, // any number, sigh defines direction of movement
  minSpeedY: -0.5, // any number, sigh defines direction of movement
  maxSpeedY: 0.5, // any number, sigh defines direction of movement
  
  blur: 1, // blur intensity in px, 0 - disabled

  fill: true, // fill dots with color
  colorsFill: ["#ffffff", "#fff4c1", "#faefdb"], // hex color strings array, color is picked randomly from color array
  opacityFill: null, // null for random opacity | from 0 to 100 where 0 means transparent
  opacityFillMin: 0, // from 0 to 100 where 0 means transparent
  opacityFillStep: 0, // from 0 to 100 where 0 means no opacity changes per frame, for creating blinking effect

  stroke: false, // circle dots with color
  colorsStroke: ["#ffffff"], // hex color strings array, color is picked randomly from color array
  opacityStroke: 1, // null for random opacity | from 0 to 100 where 0 means transparent
  opacityStrokeMin: 0, // from 0 to 100 where 0 means transparent
  opacityStrokeStep: 0, // from 0 to 100 where 0 means no opacity changes per frame, for creating blinking effect
  
  drawLines: true, // enable drawing lines between adjacent dots, most performance decreasing feature
  lineColor: "#717892", // hex color string
  lineLength: 150, // positive integer, maximum length of lines drawn between dots
  lineWidth: 2, // positive integer
  
  actionOnClick: true, // enable actions on mouse click
  actionOnHover: true, // enable actions on mouse move
  onClickCreate: false, // enable creating new dots in current mouse cursor position on click
  onClickMove: true, // enable moving adjacent dots away from mouse cursor on click
  onHoverMove: true, // enable moving adjacent dots away from mouse cursor on hover
  onHoverDrawLines: true, // enable drawing lines between mouse cursor and adjacent dots
  onClickCreateNDots: 10, // positive number, number of dots to create on mouse click
  onClickMoveRadius: 200, // positive number, minimum distance from mouse cursor to any dot after mouse click
  onHoverMoveRadius: 50, // positive number, minimum distance from mouse cursor to any dot
  onHoverLineRadius: 150 // positive number, maximum length of lines drawn between mouse cursor and adjacent dots 
}
```

</p>
</details>

you can find two json config examples in 'demo' folder of github repo

## TODO list
<ul>
    <li>add more configs</li>
    <li>optimize calculations to improve performance</li>
    <li>add tests</li>
</ul>
