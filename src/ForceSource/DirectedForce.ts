import {Path} from "../Core/Path";
import p5 from "p5";
import {GUI} from "dat.gui";

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