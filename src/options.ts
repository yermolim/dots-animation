import { IAnimationOptions } from "./interfaces";

const defaultOptions: IAnimationOptions = {
  expectedFps: 60,
  number: null,
  density: 0.00005,
  dprDependentDensity: true,
  dprDependentDimensions: true,
  minR: 1,
  maxR: 5,
  minSpeedX: -0.5,
  maxSpeedX: 0.5,
  minSpeedY: -0.5,
  maxSpeedY: 0.5,
  blur: 0,
  fill: true,
  colorsFill: ["#ffffff", "#fff4c1", "#faefdb"],
  opacityFill: null,
  opacityFillMin: 0,
  opacityFillStep: 0,
  stroke: false,
  colorsStroke: ["#ffffff"],
  opacityStroke: 1,
  opacityStrokeMin: 0,
  opacityStrokeStep: 0,
  drawLines: true,
  lineColor: "#717892",
  lineLength: 150,
  lineWidth: 1,
  actionOnClick: true,
  actionOnHover: true,
  onClickCreate: true,
  onClickMove: true,
  onHoverMove: true,
  onHoverDrawLines: true,
  onClickCreateNDots: 10,
  onClickMoveRadius: 200,
  onHoverMoveRadius: 50,
  onHoverLineRadius: 150
};

export { IAnimationOptions, defaultOptions };
