import p5 from "p5";
import { Path } from "./path";

export type Rect = {
    minX: number,
    minY: number,
    maxX: number,
    maxY: number
}

export function RectBoundPath(path: Path, rect: Rect) {
    path.nodes.forEach(node => {
        const x = node.point.x
        const y = node.point.y
        const isNodeInRect = x > rect.minX && x < rect.maxX && y > rect.minY && y < rect.maxY
        node.isFixed = !isNodeInRect
    })
}

export function CircularBoundPath(path: Path, center: p5.Vector, radius: number) {
    path.nodes.forEach(node => {
        const distanceToCenter = p5.Vector.dist(center, node.point)
        const isNodeInsideBound = distanceToCenter <= radius
        node.isFixed = !isNodeInsideBound
    })
}