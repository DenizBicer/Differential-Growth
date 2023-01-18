
import p5 from "p5";
import { GUI } from "dat.gui";
import { Path } from "./path";
import { Tree } from "./World";
import { Node } from './Node';
import knn from 'rbush-knn';

const settings = {
    attractionMagnitude: .12,
    alignmentMagnitude: .24,
    repulsionMagnitude: .63,
    repulsionRadius: 5,
    maxNodeDistance: 30
}

const zeroVector = new p5.Vector(0, 0)

export function AddDifferentialGrowthParameters(gui: GUI) {
    const folder = gui.addFolder('Differential Growth')
    for (const property in settings) {
        folder.add(settings, property)
    }
}

export function GrowPathsByNodeDistance(paths: Path[]) {
    paths.forEach(p => GrowPathByNodeDistance(p, settings.maxNodeDistance))
}

function GrowPathByNodeDistance(path: Path, maxDistance: number) {
    const nodes = path.nodes
    const newNodes: [{ i: number, node: Node }] = []
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        const nextNode = path.tryGetNextNode(i)
        if (nextNode === null)
            continue

        const distance = p5.Vector.dist(node.point, nextNode.point)
        if (distance < maxDistance)
            continue

        const newPoint = GetMidPoint(node.point, nextNode.point)
        const newNode = new Node(newPoint)
        newNodes.push({ i: i + newNodes.length + 1, node: newNode })
    }

    newNodes.forEach(n => {
        nodes.splice(n.i, 0, n.node)
    })

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

        if (prevNode === null) {
            console.log('prev node is null', i)
        }

        if (nextNode === null) {
            console.log('next node is null', i)
        }

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
    const midOfAlignmentSegment = GetMidPoint(previous, next)
    return p5.Vector.mult(p5.Vector.sub(midOfAlignmentSegment, current).normalize(), magnitude)
}

function CalculateRepulsionForce(current: p5.Vector, tree: Tree, radius: number, magnitude: number): p5.Vector {
    const neighbours: Node[] = knn(tree,
        current.x,
        current.y,
        undefined,
        undefined,
        radius * radius);

    const sumOfForces = new p5.Vector()
    neighbours.forEach(neighbour => sumOfForces.add(CalculateDirectedForce(neighbour.point, current, magnitude)))

    return sumOfForces
}

function GetMidPoint(p1: p5.Vector, p2: p5.Vector): p5.Vector {
    return p5.Vector.div(p5.Vector.add(p1, p2), 2)
}