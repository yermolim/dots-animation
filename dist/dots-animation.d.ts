export interface IAnimationObject {
    start(): void;
    stop(): void;
    pause(): void;
}
export declare class DotsAnimationFactory {
    private static _optionsDefault;
    static createDotsAnimation(containerSelector: string, canvasId: string, optionsJsonPath: string): Promise<IAnimationObject>;
}
