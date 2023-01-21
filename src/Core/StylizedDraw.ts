import p5 from "p5"
import { GUI } from "dat.gui"
import { Path } from "./path"

const settings = {
    repeatDistanceInterval: 4,
    repeatThickness: 100,
    lineThickness: 20,
    lineOpacity: 15,
    penWidth: 11,
    deactivateDistance: 200
}
export function AddStylizedDrawParameters(gui: GUI) {
    const folder = gui.addFolder('Draw')
    for (const property in settings) {
        folder.add(settings, property)
    }
}

export function drawPathHistory(p: p5 | any, path: Path): void {
    p.push()
    p.noFill()
    p.fill(0)
    const maxDistance = path.nodes.map(p => p.getLength()).reduce((p, c) => Math.max(p, c))
    const repeatCount = maxDistance / settings.repeatDistanceInterval

    const maxThickness = repeatCount * settings.repeatDistanceInterval
    path.nodes.forEach(node => {
        p.beginShape()
        for (let index = repeatCount; index > repeatCount / 2; index--) {

            const d = index * settings.repeatDistanceInterval

            if ((maxThickness - d) > settings.repeatThickness)
                break

            if (d > settings.deactivateDistance)
                continue

            const vertex = node.getVertexAtDistanceHistory(d)
            p.curveVertex(vertex.x, vertex.y)
        }
        p.endShape()
    })
    p.pop()
}