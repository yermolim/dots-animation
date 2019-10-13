interface IAnimationObject {
    start(): void;
    stop(): void;
}
declare class DotsAnimationFactory {
    private static _optionsDefault;
    static createDotsAnimation(containerSelector: string, canvasId: string, optionsJsonPath: string): Promise<IAnimationObject>;
}
export default DotsAnimationFactory;
