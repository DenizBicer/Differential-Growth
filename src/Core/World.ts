import { Path } from "./path";

export class World {
    paths: Path[] = []

    addPath(path: Path) {
        this.paths.push(path)
    }

    applyForces() {
        this.paths.forEach(p => p.nodes.forEach(n => n.applyForce()))
    }
}