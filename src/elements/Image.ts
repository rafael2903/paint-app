import { Element, ElementProperties } from './Element'

export class ImageElement extends Element {
    readonly image: HTMLImageElement

    constructor(
        image: File | HTMLImageElement,
        private centerX: number,
        private centerY: number,
        elementProperties?: ElementProperties
    ) {
        super(elementProperties)
        if (image instanceof HTMLImageElement) {
            this.image = image
            this.setProperties()
            return
        }
        if (!image.type.startsWith('image/'))
            throw new Error('File is not an image')
        this.image = new Image()
        this.image.src = URL.createObjectURL(image)
    }

    private setProperties() {
        this.width ||= this.image.naturalWidth
        this.height ||= this.image.naturalHeight
        this.x = Math.round(this.centerX - this.width / 2)
        this.y = Math.round(this.centerY - this.height / 2)
    }

    async load() {
        await this.image.decode()
        this.setProperties()
        URL.revokeObjectURL(this.image.src)
        return this
    }

    clone() {
        return new ImageElement(this.image, this.centerX, this.centerY, this)
    }

    // isInPoint(x: number, y: number, _ctx: CanvasRenderingContext2D) {
    //     return (
    //         x >= this.x &&
    //         x <= this.x + this.width &&
    //         y >= this.y &&
    //         y <= this.y + this.height
    //     )
    // }

    // draw(ctx: CanvasRenderingContext2D) {
    //     ctx.drawImage(this.image, this.x, this.y)
    // }
}
