
import p5 from "p5";
import { GUI } from "dat.gui";
import { Path } from "./path";
import { Tree } from "./World";
import knn from 'rbush-knn';

const settings = {
    attractionMagnitude: .1,
    alignmentMagnitude: .1,
    repulsionMagnitude: .1,
    repulsionRadius: 20,
}

const zeroVector = new p5.Vector(0, 0)

export function AddDifferentialGrowthParameters(gui: GUI) {
    const folder = gui.addFolder('Differential Growth')
    for (const property in settings) {
        folder.add(settings, property)
    }
}

export function UpdateDifferentialGrowthForces(paths: Path[], tree: Tree) {
    paths.forEach(p => UpdateForcesInPath(p, tree))
}

function UpdateForcesInPath(path: Path, tree: Tree) {
    const nodes = path.nodes
    for (let i = 0; i < nodes.length; i++) {
        const prevNode = path.tryGetPreviousNode(i)
        const nextNode = path.tryGetNextNode(i)
        const node = nodes[i]

        const attractionForceToPrevious = prevNode ? CalculateDirectedForce(node.point, prevNode.point, settings.attractionMagnitude) : zeroVector
        const attractionForceToNext = nextNode ? CalculateDirectedForce(node.point, nextNode.point, settings.attractionMagnitude) : zeroVector

        const alignmentForce = prevNode && nextNode ? CalculateAlignmentForce(node.point, prevNode.point, nextNode.point, settings.alignmentMagnitude) : zeroVector
        const repulsionForce = CalculateRepulsionForce(node.point, tree, settings.repulsionRadius, settings.repulsionMagnitude)

        node.addForce(attractionForceToPrevious)
        node.addForce(attractionForceToNext)
        node.addForce(alignmentForce)
        node.addForce(repulsionForce)
    }
}

function CalculateDirectedForce(from: p5.Vector, to: p5.Vector, magnitude: number): p5.Vector {
    return p5.Vector.mult(p5.Vector.sub(to, from).normalize(), magnitude)
}

function CalculateAlignmentForce(current: p5.Vector, previous: p5.Vector, next: p5.Vector, magnitude: number): p5.Vector {
    const midOfAlignmentSegment = p5.Vector.div(p5.Vector.add(previous, next), 2)
    return p5.Vector.mult(p5.Vector.sub(midOfAlignmentSegment, current).normalize(), magnitude)
}

function CalculateRepulsionForce(current: p5.Vector, tree: Tree, radius: number, magnitude: number): p5.Vector {
    const neighbours = knn(tree,
        current.x,
        current.y,
        undefined,
        undefined,
        radius * radius);

    console.log(neighbours.length)
    return zeroVector
}