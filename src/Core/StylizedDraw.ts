import p5 from "p5"
import { GUI } from "dat.gui"
import { Path } from "./path"

const settings = {
    repeatDistanceInterval: 8,
    repeatThickness: 100,
    lineThickness: 1.5,
    opacity: 100,
    deactivateDistance: 200,
    drawPoint: false,
    fill: false,
    stroke: true
}

export function AddStylizedDrawParameters(gui: GUI) {
    const folder = gui.addFolder('Draw')
    for (const property in settings) {
        folder.add(settings, property)
    }
}

export function drawPath(p: p5, path: Path) {
    p.push()
    applyFillAndStrokeSettings(p)
    p.beginShape()
    path.nodes.forEach(n => p.curveVertex(n.point.x, n.point.y))
    const endShape = path.closed ? p.CLOSE : undefined
    p.endShape(endShape)
    p.pop()
}


export function drawPathHistory(p: p5 | any, path: Path): void {
    p.push()
    p.noFill()
    p.stroke(0, 0, 0, settings.opacity)
    p.strokeWeight(settings.lineThickness)

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


export function drawPathHistoryOutline(p: p5 | any, path: Path): void {
    p.push()
    applyFillAndStrokeSettings()

    const maxDistance = path.nodes.map(p => p.getLength()).reduce((p, c) => Math.max(p, c))
    const repeatCount = maxDistance / settings.repeatDistanceInterval

    const maxThickness = repeatCount * settings.repeatDistanceInterval

    for (let index = repeatCount; index > repeatCount / 2; index--) {

        const d = index * settings.repeatDistanceInterval

        if ((maxThickness - d) > settings.repeatThickness)
            break

        p.beginShape()
        path.nodes.forEach(node => {
            const vertex = node.getVertexAtDistanceHistory(d)
            p.curveVertex(vertex.x, vertex.y)
            if (settings.drawPoint)
                p.ellipse(vertex.x, vertex.y, 4)
        })
        p.endShape(p.CLOSE)
    }
    p.pop()
}

function applyFillAndStrokeSettings(p: p5 | any) {
    if (settings.fill) {
        p.fill(0, 0, 0, settings.opacity)
    }
    else {
        p.noFill()
    }
    if (settings.stroke) {
        p.stroke(0, 0, 0, settings.opacity)
        p.strokeWeight(settings.lineThickness)
    }
    else {
        p.noStroke()
    }
}