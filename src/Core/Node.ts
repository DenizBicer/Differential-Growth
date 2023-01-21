import p5 from "p5";

export class Node {
    point: p5.Vector
    force: p5.Vector
    history: p5.Vector[] = []
    distantHistory: number[] = []

    saveHistory: boolean
    isFixed: boolean

    constructor(point: p5.Vector, saveHistory: boolean = true) {
        this.point = point
        this.force = new p5.Vector(0, 0)
        this.isFixed = false
        this.saveHistory = saveHistory
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
        this.addPointToHistory()
    }

    addPointToHistory() {
        if (!this.saveHistory)
            return

        const newHistoryPoint = new p5.Vector(this.point.x, this.point.y)

        if (this.history.length === 0) {
            this.history.push(newHistoryPoint)
            this.history.push(newHistoryPoint)
            this.distantHistory.push(0)
            this.distantHistory.push(0)
        }


        const lastPoint = this.history[this.history.length - 1]
        const lastDistance = this.distantHistory[this.distantHistory.length - 1]

        this.history.push(newHistoryPoint)
        this.distantHistory.push(lastDistance + p5.Vector.dist(lastPoint, newHistoryPoint))
    }

    getVertexAtDistanceHistory(distance: number): p5.Vector {
        for (let index = 0; index < this.distantHistory.length - 1; index++) {
            const currentDistance = this.distantHistory[index];
            const nextDistance = this.distantHistory[index + 1];
            if (distance < currentDistance || distance > nextDistance)
                continue

            const currentPoint = this.history[index]
            const nextPoint = this.history[index + 1]
            const deltaDistance = distance - currentDistance

            const position = p5.Vector.add(
                currentPoint, p5.Vector.mult(
                    p5.Vector.normalize(p5.Vector.sub(nextPoint, currentPoint)),
                    deltaDistance))
            return position
        }

        return this.history[this.history.length - 1]
    }

    getLength(): number {
        return this.distantHistory[this.distantHistory.length - 1]
    }
}