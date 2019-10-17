//#region  common functions
function getDistance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomArbitrary(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

function hexToRgb(hex: string, opacity: number): string {
    hex = hex.replace("#", "");
    const r = parseInt(hex.substring(0, hex.length / 3), 16);
    const g = parseInt(hex.substring(hex.length / 3, 2 * hex.length / 3), 16);
    const b = parseInt(hex.substring(2 * hex.length / 3, 3 * hex.length / 3), 16);
    return "rgba(" + r + "," + g + "," + b + "," + opacity + ")";
}

function drawCircle(ctx: CanvasRenderingContext2D,
    x: number, y: number, r: number, colorS: string | null, colorF: string | null): void {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    if (colorF !== null) {
        ctx.fillStyle = colorF;
        ctx.fill();
    }
    if (colorS !== null) {
        ctx.strokeStyle = colorS;
        ctx.stroke();
    }
}

function drawLine(ctx: CanvasRenderingContext2D,
    x1: number, y1: number, x2: number, y2: number, width: number, color: string) {
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}
//#endregion


export interface IAnimationObject {
    start(): void;
    stop(): void;
}

interface IPositionObject {
    x: number;
    y: number;
}

interface IMovableObject {
    move(): void;
    moveTo(position: IPositionObject): void;
}

interface IAnimationControlFactory {
    new(canvas: HTMLCanvasElement, options: IAnimationOptions): IAnimationControl;
}

interface IAnimationControl {
    init(): void;
    draw(mousePosition?: IPositionObject, isMouseClicked?: boolean): void;
}



interface IDotProps {
    x: number;
    y: number;
    r: number;
    xSpeed: number;
    ySpeed: number;
    colorS: string | null;
    colorF: string | null;
}

class Dot implements IMovableObject {

    constructor(private _canvas: HTMLCanvasElement,
        private _offset: number,
        private _x: number,
        private _y: number,
        private _xSpeed: number,
        private _ySpeed: number,
        private _r: number,
        private _colorS: string | null,
        private _colorF: string | null) {
    }

    getProps(): IDotProps {
        return {
            x: this._x,
            y: this._y,
            r: this._r,
            xSpeed: this._xSpeed,
            ySpeed: this._ySpeed,
            colorS: this._colorS,
            colorF: this._colorF
        };
    }

    move(): void {
        let offset = Math.max(this._offset, this._r);
        let xMin = -1 * offset;
        let yMin = -1 * offset;
        let xMax = this._canvas.width + offset;
        let yMax = this._canvas.height + offset;


        if (this._x < xMin) {
            this._x = xMax;
        } else if (this._x > xMax) {
            this._x = xMin;
        } else {
            this._x += this._xSpeed;
        }

        if (this._y < yMin) {
            this._y = yMax;
        } else if (this._y > yMax) {
            this._y = yMin;
        } else {
            this._y += this._ySpeed;
        }
    }

    moveTo(position: IPositionObject): void {
        this._x = position.x;
        this._y = position.y;
    }
}

class DotControl implements IAnimationControl {

    private _array: Dot[] = [];
    private _maxNumber = 100;
    private readonly _canvas: HTMLCanvasElement;
    private readonly _canvasCtx: CanvasRenderingContext2D;
    private readonly _options: IAnimationOptions;

    constructor(canvas: HTMLCanvasElement, options: IAnimationOptions) {
        this._canvas = canvas;
        let canvasCtx = this._canvas.getContext("2d");
        if (canvasCtx === null) throw new Error("Canvas context is null");
        this._canvasCtx = canvasCtx;
        this._options = options;
    }

    // interface implementation
    init() {
        if (this._array.length !== 0) { return; }
        this._maxNumber = this._options.number ? this._options.number : this.getDotNumber();
        this.dotFactory(this._maxNumber);
    }

    draw(mousePosition: IPositionObject, isClicked: boolean) {
        // clear canvas
        this._canvasCtx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        // update dots number
        this._maxNumber = this._options.number ? this._options.number : this.getDotNumber();
        if (this._maxNumber < this._array.length) {
            this.deleteEldestDots(this._array.length - this._maxNumber);
        } else if (this._maxNumber > this._array.length) {
            this.dotFactory(this._maxNumber - this._array.length);
        }
        // move and draw dots
        for (const dot of this._array) {
            dot.move();
        }
        // draw lines
        if (this._options.drawLines) { this.drawLinesBetweenDots(); }
        // handle mouse move
        if (this._options.actionOnHover) {
            if (this._options.onHoverDrawLines) { this.drawLinesToCircleCenter(mousePosition); }
            if (this._options.onHoverMove) {
                this.moveDotsOutOfCircle(
                    mousePosition, this._options.onHoverMoveRadius);
            }
        }
        // handle mouse click
        if (isClicked && this._options.actionOnClick) {
            if (this._options.onClickMove) {
                this.moveDotsOutOfCircle(
                    mousePosition, this._options.onClickMoveRadius);
            }
            if (this._options.onClickCreate) { this.dotFactory(this._options.onClickCreateNDots, mousePosition); }
        }
        // draw dots
        for (const dot of this._array) {
            const params = dot.getProps();
            drawCircle(this._canvasCtx, params.x, params.y, params.r, params.colorS, params.colorF);
        }
    }

    // creation actions
    dotFactory(number: number, position: IPositionObject | null = null): void {
        for (let i = 0; i < number; i++) {
            const dot = this.createRandomDot(position);
            this._array.push(dot);
        }
        if (this._array.length > this._maxNumber) {
            this.deleteEldestDots(this._array.length - this._maxNumber);
        }
    }

    createRandomDot(position: IPositionObject | null): Dot {
        let x: number, y: number;
        // optional position arg
        if (position) {
            x = position.x;
            y = position.y;
        } else {
            x = getRandomInt(0, this._canvas.width);
            y = getRandomInt(0, this._canvas.height);
        }
        // required params
        const xSpeed = getRandomArbitrary(this._options.minSpeedX, this._options.maxSpeedX);
        const ySpeed = getRandomArbitrary(this._options.minSpeedY, this._options.maxSpeedY);
        const radius = getRandomInt(this._options.minR, this._options.maxR);
        // optional fill/stroke color/opacity params
        let colorS: string | null;
        let colorF: string | null;
        if (this._options.stroke) {
            const colorSRandom =
                this._options.colorsStroke[Math.floor(Math.random() * this._options.colorsStroke.length)];
            if (this._options.opacityStroke) {
                colorS = hexToRgb(colorSRandom, this._options.opacityStroke);
            } else {
                colorS = hexToRgb(colorSRandom, getRandomInt(1, 100) / 100);
            }
        } else {
            colorS = null;
        }
        if (this._options.fill) {
            const colorFRandom =
                this._options.colorsFill[Math.floor(Math.random() * this._options.colorsFill.length)];
            if (this._options.opacityFill) {
                colorF = hexToRgb(colorFRandom, this._options.opacityFill);
            } else {
                colorF = hexToRgb(colorFRandom, getRandomInt(1, 100) / 100);
            }
        } else {
            colorF = null;
        }

        let offset = this._options.drawLines ? this._options.lineLength : 0;
        return new Dot(this._canvas, offset, x, y, xSpeed, ySpeed, radius, colorS, colorF);
    }

    getDotNumber(): number {
        return Math.floor(this._canvas.width * this._canvas.height * this._options.density);
    }

    deleteEldestDots(number: number): void {
        this._array = this._array.slice(number);
        for (let i = 0; i < number; i++) {
            this._array.shift();
        }
    }

    // lines actions
    getCloseDotPairs(): number[][] {
        const dotArray = this._array;
        const closePairs: number[][] = [];
        for (let i = 0; i < dotArray.length; i++) {
            for (let j = i; j < dotArray.length; j++) {
                const dotIParams = dotArray[i].getProps();
                const dotJParams = dotArray[j].getProps();
                const distance = Math.floor(getDistance(dotIParams.x, dotIParams.y, dotJParams.x, dotJParams.y));
                if (distance <= this._options.lineLength) {
                    closePairs.push([dotIParams.x, dotIParams.y, dotJParams.x, dotJParams.y, distance]);
                }
            }
        }

        return closePairs;
    }

    drawLinesBetweenDots(): void {
        const pairs = this.getCloseDotPairs();
        const width = this._options.lineWidth;
        for (const pair of pairs) {
            const opacity = (1 - pair[4] / this._options.lineLength) / 2;
            const color = hexToRgb(this._options.lineColor, opacity);
            drawLine(this._canvasCtx, pair[0], pair[1], pair[2], pair[3], width, color);
        }
    }

    // mouse events actions
    getDotsInsideCircle(position: IPositionObject, radius: number): [Dot, number][] {
        const dotsInCircle: [Dot, number][] = [];
        for (const dot of this._array) {
            const dotParams = dot.getProps();
            const distance = getDistance(position.x, position.y, dotParams.x, dotParams.y);
            if (distance < radius) {
                dotsInCircle.push([dot, distance]);
            }
        }
        return dotsInCircle;
    }

    moveDotsOutOfCircle(position: IPositionObject, radius: number): void {
        const dotsInCircle = this.getDotsInsideCircle(position, radius);
        for (const item of dotsInCircle) {
            const dot = item[0];
            const dotParams = dot.getProps();
            const distance = item[1];
            const x = (dotParams.x - position.x) * (radius / distance) + position.x;
            const y = (dotParams.y - position.y) * (radius / distance) + position.y;
            dot.moveTo({ x: x, y: y });
        }
    }

    drawLinesToCircleCenter(position: IPositionObject): void {
        const dotsInCircle = this.getDotsInsideCircle(position, this._options.onHoverLineRadius);
        const width = this._options.lineWidth;
        for (const item of dotsInCircle) {
            const dot = item[0];
            const dotParams = dot.getProps();
            const opacity = (1 - item[1] / this._options.onHoverLineRadius);
            const color = hexToRgb(this._options.lineColor, opacity);
            drawLine(this._canvasCtx, position.x, position.y, dotParams.x, dotParams.y, width, color);
        }
    }
}

class DotsAnimation implements IAnimationObject {

    private readonly _parent: HTMLElement;
    private readonly _canvas: HTMLCanvasElement;
    private readonly _animationControl: IAnimationControl;

    private _fps: number;
    private _timer: number | undefined = undefined;

    private readonly _mousePosition: IPositionObject;
    private _isMouseClicked = false;

    static animationControlFactory(
        constructor: IAnimationControlFactory, canvas: HTMLCanvasElement, options: IAnimationOptions) {
        return new constructor(canvas, options);
    }

    constructor(parent: HTMLElement, canvasId: string,
        options: IAnimationOptions, constructor: IAnimationControlFactory) {
        this._parent = parent;

        this._mousePosition = {
            x: 0,
            y: 0,
        };

        this._fps = options.expectedFps;

        this._canvas = document.createElement("canvas");
        this._canvas.id = canvasId;
        this._canvas.style.display = "block";
        this._canvas.style.width = "100%";
        this._canvas.style.width = "100%";
        this._canvas.style.height = "100%";
        this._canvas.style.webkitFilter = `blur(${options.blur}px)`;

        this.resize();
        parent.appendChild(this._canvas);
        window.addEventListener("resize", () => { this.resize(); });

        this._animationControl = DotsAnimation.animationControlFactory(constructor, this._canvas, options);
    }

    resize() {
        const dpr = window.devicePixelRatio;
        this._canvas.width = this._parent.offsetWidth * dpr;
        this._canvas.height = this._parent.offsetHeight * dpr;
    }
    draw() {
        this._animationControl.draw(this._mousePosition, this._isMouseClicked);
        this._isMouseClicked = false;
    }

    // action methods
    start() {
        this._animationControl.init();
        window.addEventListener("mousemove", this.onMouseMove.bind(this));
        window.addEventListener("click", this.onClick.bind(this));
        this._timer = window.setInterval(() => {
            // tslint:disable-next-line:no-unused-expression
            window.requestAnimationFrame(() => { this.draw(); }) ||
                window.webkitRequestAnimationFrame(() => { this.draw(); });
        },
            1000 / this._fps);
    }
    stop() {
        clearInterval(this._timer);
        this._timer = undefined;
        const canvasCtx = this._canvas.getContext("2d");
        window.setTimeout(() => {
            if (canvasCtx !== null)
                canvasCtx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        }, 20);
    }

    // event handlers
    onClick() {
        this._isMouseClicked = true;
    }
    onMouseMove(e: MouseEvent) {
        const dpr = window.devicePixelRatio;
        const xDpr = (e.clientX - this._parent.offsetLeft + window.pageXOffset) * dpr;
        const yDpr = (e.clientY - this._parent.offsetTop + window.pageYOffset) * dpr;

        this._mousePosition.x = xDpr;
        this._mousePosition.y = yDpr;
    }
}

interface IAnimationOptions {
    expectedFps: number, // positive integer 

    minR: number, // positive number
    maxR: number, // positive number
    minSpeedX: number,
    maxSpeedX: number,
    minSpeedY: number,
    maxSpeedY: number,

    blur: number, // 0 or positive integer
    stroke: boolean,
    fill: boolean,
    colorsStroke: string[], // color array to pick from
    colorsFill: string[], // color array to pick from
    opacityStroke: number | null, // null or fixed from 0 to 1
    opacityFill: number | null, // null or fixed from 0 to 1

    number: number | null, // null(then "density" field is used) or fixed number. strongly affects performance
    density: number, // positive number. strongly affects performance

    drawLines: boolean,
    lineColor: string,
    lineLength: number,
    lineWidth: number,

    actionOnClick: boolean,
    actionOnHover: boolean,
    onClickCreate: boolean,
    onClickMove: boolean,
    onHoverMove: boolean,
    onHoverDrawLines: boolean,
    onClickCreateNDots: number, // positive integer
    onClickMoveRadius: number, // positive integer
    onHoverMoveRadius: number, // positive integer
    onHoverLineRadius: number // positive integer
}

export class DotsAnimationFactory {
    private static _optionsDefault: IAnimationOptions = {
        expectedFps: 60,
        minR: 1,
        maxR: 5,
        minSpeedX: -0.5,
        maxSpeedX: 0.5,
        minSpeedY: -0.5,
        maxSpeedY: 0.5,
        blur: 0,
        stroke: false,
        fill: true,
        colorsStroke: ["#ffffff"],
        colorsFill: ["#ffffff", "#fff4c1", "#faefdb"],
        opacityStroke: 1,
        opacityFill: null,
        number: null,
        density: 0.00005,
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

    static async createDotsAnimation(containerSelector: string, canvasId: string, optionsJsonPath: string): Promise<IAnimationObject> {
        let options: IAnimationOptions = DotsAnimationFactory._optionsDefault;
        const response = await fetch(optionsJsonPath);
        if (response.ok) {
            const text = await response.text();
            options = JSON.parse(text);
        }
        const container = document.querySelector(containerSelector);
        if (container === null) throw new Error("Container is null");
        return new DotsAnimation(container as HTMLElement, canvasId, options, DotControl);
    }
}
