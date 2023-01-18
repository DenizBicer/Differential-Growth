import p5 from "p5";
import { Path } from "../Core/path";

export function AddDropForce(dropPoint: p5.Vector, radius: number, paths: Path[]) {
    paths.forEach(p => {
        p.nodes.forEach(n => {
            const dropForce = dropForceForNode(n.point, dropPoint, radius)
            n.addForce(dropForce)
        })
    })
}

function dropForceForNode(point: p5.Vector, dropPoint: p5.Vector, radius: number): p5.Vector {
    const distanceToDrop = p5.Vector.dist(point, dropPoint)
    const forceAmount = Math.sqrt(1 + (radius * radius) / (distanceToDrop * distanceToDrop)) // not sure about the variable name
    const direction = p5.Vector.sub(point, dropPoint)
    const totalDisplacementFromDropPoint = p5.Vector.mult(direction, forceAmount) // not sure about the variable name
    const nextP = p5.Vector.add(dropPoint, totalDisplacementFromDropPoint)
    return nextP.sub(point)
}