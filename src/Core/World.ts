import { GUI } from "dat.gui";
import RBush from "rbush";
import { AddDifferentialGrowthParameters, DifferentialGrowthUpdate } from "../ForceSource/DifferentialGrowth";
import { Path } from "./path";
import { Node } from "./Node"

export class Tree extends RBush<Node> {
    toBBox(t: Node) { return { minX: t.point.x, minY: t.point.y, maxX: t.point.x, maxY: t.point.y }; }
    compareMinX(a: Node, b: Node) { return a.point.x - b.point.x; }
    compareMinY(a: Node, b: Node) { return a.point.y - b.point.y; }
}

export class World {
    paths: Path[] = []
    tree: Tree

    constructor() {
        this.tree = new Tree()
    }

    clear() {
        this.paths.splice(0, this.paths.length)
    }

    addParametersToGui(gui: GUI) {
        AddDifferentialGrowthParameters(gui)
    }

    addPath(path: Path) {
        this.paths.push(path)
    }

    update() {
        this.buildTree()
        DifferentialGrowthUpdate(this.paths, this.tree)

        this.applyForces()
    }


    applyForces() {
        this.paths.forEach(p => p.nodes.forEach(n => n.applyForce()))
    }

    buildTree() {
        this.tree.clear()
        this.paths.forEach(p => this.tree.load(p.nodes))
    }
}