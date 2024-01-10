
import p5 from "p5";
import { GUI } from "dat.gui";
import { Path } from "../Core/path";
import { Tree } from "../Core/World";
import { Node } from '../Core/Node';
import { DifferentialGrowthControlsView } from "../UI/differentialGrowthUi/differentialGrowthControlsView";

export type DifferentialGrowthSettings = {
    isForcesActive: boolean,
    isGrowthActive: boolean,
    isShrinkActive: boolean,
    attractionMagnitude: number,
    alignmentMagnitude: number,
    repulsionMagnitude: number,
    repulsionRadius: number,
    minNodeDistance: number,
    maxNodeDistance: number,
    maxNodeCountPerPath: number,
}
const settings: DifferentialGrowthSettings = {
    isForcesActive: true,
    isGrowthActive: true,
    isShrinkActive: true,
    attractionMagnitude: .12,
    alignmentMagnitude: .24,
    repulsionMagnitude: .63,
    repulsionRadius: 45,
    minNodeDistance: 10,
    maxNodeDistance: 25,
    maxNodeCountPerPath: 400,
}

class DifferentialGrowthModel {
    settings: DifferentialGrowthSettings
    onSettingsChanged: ((settings: DifferentialGrowthSettings) => void) | undefined = undefined
    constructor(settings: DifferentialGrowthSettings) {
        this.settings = settings
    }

    bindSettingsChanged(callback: (settings: DifferentialGrowthSettings) => void) {
        this.onSettingsChanged = callback
    }

    _commit(settings: DifferentialGrowthSettings) {
        this.onSettingsChanged && this.onSettingsChanged(settings)
    }
}

class DifferentialGrowthController {
    model: DifferentialGrowthModel
    view: DifferentialGrowthControlsView
    constructor(model: DifferentialGrowthModel, view: DifferentialGrowthControlsView) {
        this.model = model
        this.view = view

        this.model.bindSettingsChanged(this.onSettingsChanged.bind(this))
        this.view.bindMaxNodeDistanceChanged(this.maxNodeDistanceChanged.bind(this))
        this.view.bindMinNodeDistanceChanged(this.minNodeDistanceChanged.bind(this))
        this.view.bindAlignmentMagnitudeChanged(this.alignmentMagnitudeChanged.bind(this))
        this.view.bindRepulsionMagnitudeChanged(this.repulsionMagnitudeChanged.bind(this))
        this.view.bindRepulsionRadiusChanged(this.repulsionRadiusChanged.bind(this))

        this.onSettingsChanged(this.model.settings)
    }

    onSettingsChanged(settings: DifferentialGrowthSettings) {
        this.view.showSettings(settings)
    }

    minNodeDistanceChanged(nodeDistance: number) {
        const checkedNodeDistance = Math.min(nodeDistance, settings.maxNodeDistance)
        settings.minNodeDistance = checkedNodeDistance
        this.model._commit(settings)
    }

    maxNodeDistanceChanged(nodeDistance: number) {
        const checkedNodeDistance = Math.max(nodeDistance, settings.minNodeDistance)
        settings.maxNodeDistance = checkedNodeDistance
        this.model._commit(settings)
    }

    alignmentMagnitudeChanged(alignmentMagnitude: number) {
        settings.alignmentMagnitude = alignmentMagnitude
        this.model._commit(settings)
    }

    repulsionMagnitudeChanged(repulsionMagnitude: number) {
        settings.repulsionMagnitude = repulsionMagnitude
        this.model._commit(settings)
    }

    repulsionRadiusChanged(repulsionRadius: number) {
        settings.repulsionRadius = repulsionRadius
        this.model._commit(settings)
    }
}


const zeroVector = new p5.Vector(0, 0)

export function CreateDifferentialGrowthParameterUi() {
    const differentialGrowthControlsView = new DifferentialGrowthControlsView()
    new DifferentialGrowthController(new DifferentialGrowthModel(settings), differentialGrowthControlsView)

    return differentialGrowthControlsView.element
}


export function AddDifferentialGrowthParameters(gui: GUI) {
    const folder = gui.addFolder('Differential Growth')
    for (const property in settings) {
        folder.add(settings, property)
    }
}

export function DifferentialGrowthUpdate(paths: Path[], tree: Tree) {
    UpdateDifferentialGrowthForces(paths, tree)
    GrowPathsByNodeDistance(paths)
    ShrinkPathsByNodeDistance(paths)
}

function GrowPathsByNodeDistance(paths: Path[]) {
    if (!settings.isGrowthActive)
        return
    paths.forEach(p => GrowPathByNodeDistance(p, settings.maxNodeDistance))
}

function GrowPathByNodeDistance(path: Path, maxDistance: number) {
    const nodes = path.nodes

    if (nodes.length > settings.maxNodeCountPerPath)
        return


    const newNodes: { i: number, node: Node }[] = []
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
        newNode.force = new p5.Vector(node.force.x, node.force.y)
        newNodes.push({ i: i + newNodes.length + 1, node: newNode })
    }

    newNodes.forEach(n => {
        nodes.splice(n.i, 0, n.node)
    })

}

function ShrinkPathsByNodeDistance(paths: Path[]) {
    if (!settings.isShrinkActive)
        return
    paths.forEach(p => ShrinkPathByNodeDistance(p, settings.minNodeDistance))
}

function ShrinkPathByNodeDistance(path: Path, minDistance: number) {

    const nodes = path.nodes

    if (nodes.length < 20)
        return

    var i = nodes.length
    while (i--) {
        const node = nodes[i]
        const prevNode = path.tryGetPreviousNode(i)
        if (prevNode === null)
            continue

        const distance = p5.Vector.dist(node.point, prevNode.point)
        if (distance > minDistance)
            continue

        nodes.splice(i, 1)
    }
}

function UpdateDifferentialGrowthForces(paths: Path[], tree: Tree) {
    if (!settings.isForcesActive)
        return
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
    const midOfAlignmentSegment = GetMidPoint(previous, next)
    return p5.Vector.mult(p5.Vector.sub(midOfAlignmentSegment, current).normalize(), magnitude)
}

function CalculateRepulsionForce(current: p5.Vector, tree: Tree, radius: number, magnitude: number): p5.Vector {
    const x = current.x
    const y = current.y
    const halfSize = radius / 2
    const neighbours = tree.search({
        minX: x - halfSize,
        maxX: x + halfSize,
        minY: y - halfSize,
        maxY: y + halfSize
    })

    const sumOfForces = new p5.Vector()
    neighbours.forEach(neighbour => sumOfForces.add(CalculateDirectedForce(neighbour.point, current, magnitude)))

    return sumOfForces
}

function GetMidPoint(p1: p5.Vector, p2: p5.Vector): p5.Vector {
    return p5.Vector.div(p5.Vector.add(p1, p2), 2)
}