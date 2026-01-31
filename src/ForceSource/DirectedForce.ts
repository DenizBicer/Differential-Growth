import {Path} from "../Core/Path";
import p5 from "p5";
import {GUI} from "dat.gui";
import {Node} from "../Core/Node";

const settings = {
    force: .2,
}

export function AddDirectedForceParameters(gui: GUI) {
    const folder = gui.addFolder('Directed Force')
    for (const property in settings) {
        folder.add(settings, property)
    }
}

export function AddAttractionForce(sourcePoint: p5.Vector, paths: Path[]) {
    paths.forEach(p => {
        p.nodes.forEach(n => {
            const force = CalculateDirectedForce(n.point, sourcePoint, settings.force)
            n.addForce(force)
        })
    })

}

function CalculateDirectedForce(from: p5.Vector, to: p5.Vector, magnitude: number): p5.Vector {
    return p5.Vector.mult(p5.Vector.sub(to, from).normalize(), magnitude)
}

export function AddCustomForce(paths: Path[], calculateForce: (node: Node) => p5.Vector) {
    for (const path of paths) {
        for (const node of path.nodes) {
            const force = calculateForce(node)
            node.addForce(force)
        }
    }
}
