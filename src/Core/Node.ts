import p5 from "p5";

export class Node {
    point: p5.Vector
    force: p5.Vector

    constructor(point: p5.Vector) {
        this.point = point
        this.force = new p5.Vector(0, 0)
    }

    addForce(force: p5.Vector) {
        this.force.add(force)
    }

    applyForce() {
        this.point.add(this.force)
        this.force.sub(this.force)
    }
}