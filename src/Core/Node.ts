import p5 from "p5";

export class Node {
    point: p5.Vector
    force: p5.Vector
    isFixed: boolean

    constructor(point: p5.Vector) {
        this.point = point
        this.force = new p5.Vector(0, 0)
        this.isFixed = false
    }

    addForce(force: p5.Vector) {
        this.force.add(force)
    }

    preserveForce(forcePreserveAmount: number) {
        this.force.mult(forcePreserveAmount)
    }

    applyForce() {
        if (this.isFixed)
            return

        this.point.add(this.force)
    }
}