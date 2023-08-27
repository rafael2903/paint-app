import { Canvas } from '../Canvas'
import { Rectangle } from '../elements/Rectangle'
import { Tool } from '../types'
import { Path } from '../elements/Path'

export class Select extends Tool {
    static cursor = 'default'
    private static currentPath: Path
    private static selecting = false
    private static pointerEvents: PointerEvent[] = []
    private static interactionCanvas: Canvas
    private static elementsCanvas: Canvas
    private static selectedPaths: Path[] = []
    private static startPoint: { x: number; y: number } | null = null

    // private static draw() {
    //     if (!Select.selecting) return
    //     while (Select.pointerEvents.length > 0) {
    //         const e = Select.pointerEvents.shift()!
    //         Select.currentPath.lineTo(e.pageX, e.pageY)
    //         Select.currentPath.moveTo(e.pageX, e.pageY)
    //         Select.interactionCanvas.paths[0] = Select.currentPath
    //         Select.interactionCanvas.redraw()
    //     }
    //     requestAnimationFrame(Select.draw)
    // }

    static pointerDown(e: PointerEvent) {
        if (e.button === 0) {
            // Select.erasing = true
            const selectedPath = Select.elementsCanvas.getPathInPoint(
                e.clientX,
                e.clientY
            )

            if (selectedPath) {
                Select.selectedPaths.push(selectedPath)
            } else {
                Select.selecting = true
                Select.startPoint = { x: e.clientX, y: e.clientY }
            }
        }
    }

    static pointerMove(e: PointerEvent) {
        if (!Select.selecting) return

        const selectRectangle = new Rectangle(Select.startPoint!, {
            x: e.clientX,
            y: e.clientY,
        })
        selectRectangle.filled = true
        selectRectangle.strokeStyle = '#0078d7'
        selectRectangle.lineWidth = 1
        selectRectangle.fillStyle = 'rgba(0, 120, 215, 0.1)'
        Select.interactionCanvas.clear()
        Select.interactionCanvas.addPath(selectRectangle)
    }

    static pointerUp() {
        if (!Select.selecting) return
        Select.selecting = false
        Select.interactionCanvas.clear()
        // Select.pointerEvents.length = 0
        // Select.interactionCanvas.paths.length = 0
        // Select.currentPath.offset.x = Select.elementsCanvas.offset.x
        // Select.currentPath.offset.y = Select.elementsCanvas.offset.y
        // Select.elementsCanvas.paths.push(Select.currentPath)
        // Select.elementsCanvas.redraw()
    }

    static setUp(interactionCanvas: Canvas, elementsCanvas: Canvas) {
        Select.interactionCanvas = interactionCanvas
        Select.elementsCanvas = elementsCanvas
        Select.interactionCanvas.element.addEventListener(
            'pointerdown',
            Select.pointerDown
        )
        window.addEventListener('pointermove', Select.pointerMove)
        window.addEventListener('pointerup', Select.pointerUp)
    }

    static tearDown() {
        Select.interactionCanvas.element.removeEventListener(
            'pointerdown',
            Select.pointerDown
        )
        window.removeEventListener('pointermove', Select.pointerMove)
        window.removeEventListener('pointerup', Select.pointerUp)
    }
}
