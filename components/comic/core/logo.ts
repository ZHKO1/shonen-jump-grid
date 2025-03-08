import { Container, Sprite } from 'pixi.js';

/**
 * The game logo, presented in the Home screen
 */
export class Logo extends Container {
    /** The logo image */
    private image: Sprite;
    constructor(url: string) {
        super();
        this.scale.set(1);
        this.image = Sprite.from(url);
        this.image.anchor.set(0.5);
        this.addChild(this.image);
    }
}
