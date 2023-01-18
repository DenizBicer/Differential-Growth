import p5 from "p5";
import { angleToDir } from "./Math";
import { Node } from "./Node";

export function CreateCirclePath(center: p5.Vector, radius: number, resolution: number = 30): Path {

    const nodes: Node[] = []

    for (let i = 0; i < resolution; i++) {
        const t = i / resolution
        const ang = t * Math.PI * 2
        const vector = angleToDir(ang)
        const position = p5.Vector.add(center, p5.Vector.mult(vector, radius))
        nodes.push(new Node(position))
    }
    return new Path(nodes)
}

export function DrawPath(p: p5, path: Path) {
    p.beginShape()
    path.nodes.forEach(n => p.curveVertex(n.point.x, n.point.y))
    const endShape = path.closed ? p.CLOSE : undefined
    p.endShape(endShape)
}

export class Path {
    nodes: Node[]
    closed: boolean

    constructor(nodes: Node[], closed: boolean = true) {
        this.nodes = nodes
        this.closed = closed
    }

    tryGetNextNode(index: number): Node | null {
        const i = this.closed ? ((index + 1) % this.nodes.length) : index + 1
        return i < this.nodes.length ? this.nodes[i] : null
    }

    tryGetPreviousNode(index: number): Node | null {
        const length = this.nodes.length
        const i = this.closed ? ((index - 1 + length) % length) : index - 1
        return i >= 0 ? this.nodes[i] : null
    }

}