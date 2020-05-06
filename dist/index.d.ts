// Generated by dts-bundle-generator v4.3.0

export interface IAnimationObject {
	start(): void;
	stop(): void;
	pause(): void;
}
export interface IAnimationControl {
	setPauseState(pauseState: boolean): void;
	draw(mousePosition?: IPositionObject, isMouseClicked?: boolean): void;
}
export interface IAnimationOptions {
	expectedFps: number;
	number: number | null;
	density: number;
	dprDependentDensity: boolean;
	dprDependentDimensions: boolean;
	minR: number;
	maxR: number;
	minSpeedX: number;
	maxSpeedX: number;
	minSpeedY: number;
	maxSpeedY: number;
	blur: number;
	stroke: boolean;
	colorsStroke: string[];
	opacityStroke: number | null;
	opacityStrokeMin: number;
	opacityStrokeStep: number;
	fill: boolean;
	colorsFill: string[];
	opacityFill: number | null;
	opacityFillMin: number;
	opacityFillStep: number;
	drawLines: boolean;
	lineColor: string;
	lineLength: number;
	lineWidth: number;
	actionOnClick: boolean;
	actionOnHover: boolean;
	onClickCreate: boolean;
	onClickMove: boolean;
	onHoverMove: boolean;
	onHoverDrawLines: boolean;
	onClickCreateNDots: number;
	onClickMoveRadius: number;
	onHoverMoveRadius: number;
	onHoverLineRadius: number;
}
export interface IPositionObject {
	x: number;
	y: number;
}
export declare class DotsAnimationFactory {
	static createAnimation(containerSelector: string, canvasId: string, options?: IAnimationOptions): IAnimationObject;
}

export {};
