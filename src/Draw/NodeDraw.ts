import p5 from "p5"
import { GUI } from "dat.gui"
import { Path } from "../Core/path"
import { Node } from "../Core/Node";
import { Tree } from "../Core/World"

const settings = {
    minNeighbourDistance: 0,
    maxNeighbourDistance: 42,
    minSize: 1,
    maxSize: 23,
    minOpacity: 48,
    maxOpacity: 255
}


export function AddNodeDrawParameters(gui: GUI) {
    const folder = gui.addFolder('Node Draw')
    for (const property in settings) {
        folder.add(settings, property)
    }
}

export function DrawNode(p: p5 | any, path: Path, tree: Tree) {
    p.push()
    path.nodes.forEach(n => {
        DrawNodesDependingOnNeighbourDistance(p, n, tree)
    })

    p.pop()
}


function DrawNodesDependingOnNeighbourDistance(p: p5 | any, node: Node, tree: Tree) {
    const x = node.point.x
    const y = node.point.y
    const halfSize = settings.maxNeighbourDistance / 2
    const neighbours = tree.search({
        minX: x - halfSize,
        maxX: x + halfSize,
        minY: y - halfSize,
        maxY: y + halfSize
    })

    const distanceRange = settings.maxNeighbourDistance - settings.minNeighbourDistance
    neighbours.forEach(n => {
        const distance = p5.Vector.dist(n.point, node.point)
        if (distance < settings.minNeighbourDistance)
            return

        const pct = distance / distanceRange

        const opacity = p.lerp(settings.minOpacity, settings.maxOpacity, pct)
        p.fill(0, opacity)

        const size = p.lerp(settings.minSize, settings.maxSize, pct)
        p.ellipse(x, y, size)
    })
}
