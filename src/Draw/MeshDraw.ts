import p5 from "p5";
import {GUI} from "dat.gui"
import {Path} from "../Core/Path";
import {Tree} from "../Core/World";
import {Node} from "../Core/Node";

const settings = {
    maxNeighbourDistance: 55,
    lineThickness: 1,
    minOpacity: 23,
    maxOpacity: 120,
}

export function AddMeshDrawParameters(gui: GUI) {
    const folder = gui.addFolder('Draw')
    for (const property in settings) {
        folder.add(settings, property)
    }
}

export function DrawMesh(p: p5 | any, path: Path, tree: Tree) {
    p.push()
    p.noFill()
    p.strokeWeight(settings.lineThickness)

    path.nodes.forEach(n => DrawNeighbourLines(p, n, tree))

    p.pop()
}

function DrawNeighbourLines(p: p5 | any, node: Node, tree: Tree) {
    const x = node.point.x
    const y = node.point.y
    const halfSize = settings.maxNeighbourDistance / 2
    const neighbours = tree.search({
        minX: x - halfSize,
        maxX: x + halfSize,
        minY: y - halfSize,
        maxY: y + halfSize
    })

    neighbours.forEach(n => {
        const distance = p5.Vector.dist(n.point, node.point)
        const pct = 1 - distance / settings.maxNeighbourDistance
        const opacity = p.lerp(settings.minOpacity, settings.maxOpacity, pct)
        p.stroke(0, 0, 0, opacity)
        p.line(x, y, n.point.x, n.point.y)
    })
}