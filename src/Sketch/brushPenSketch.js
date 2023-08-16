import p5 from "p5"
import p5Svg from "p5.js-svg"
import { GUI } from 'dat.gui'

p5Svg(p5)


function perpendicularClockwise(vector) {
    const magnitude = Math.sqrt((vector.x * vector.x) + (vector.y * vector.y))
    const normalized = { x: vector.x / magnitude, y: vector.y / magnitude }
    return { x: normalized.y, y: -normalized.x }
}


export const sketch = (p) => {
    let mmToPx = 5
    let saveNextDraw = false
    let svgG

    function save() {
        saveNextDraw = true
        svgG = p.createGraphics(p.width, p.height, p.SVG)
    }

    function getNormal(pointA, pointB) {
        let vector = {
            x: pointA.x - pointB.x,
            y: pointA.y - pointB.y
        }
        return perpendicularClockwise(vector)
    }

    const settings = {
        gap: 1.3,
        gapOffset: 0.1,
        xMargin: 20,
        yMargin: 20,
        length: 108.5,
        count: 130,
        randomWidth: 10,
        randomHeight: 50,
        seed: 92,
        save
    }

    p.setup = () => {
        p.createCanvas(210 * mmToPx, 148.5 * mmToPx)

        const gui = new GUI()
        const folder = gui.addFolder('sketch')
        for (const property in settings) {
            folder.add(settings, property)
        }
        folder.open()
    }

    function drawStraightLines(count, xMargin, yMargin, gap, length, renderer) {
        for (let index = 0; index < count; index++) {

            const x = xMargin + gap * index
            const yStart = yMargin
            renderer.line(x, yStart, x, yStart + length)
        }
    }

    function drawRandomLines(count, xMargin, yMargin, gap, length, renderer) {
        let randomWidth = settings.randomWidth
        let randomHeight = settings.randomHeight

        let x = xMargin
        let y = yMargin
        let lastPath = [{ x, y }]

        // one point in first half
        x = x + Math.round(p.random(-randomWidth, randomWidth)) * gap
        y = y + (p.random(-randomHeight, randomHeight))
        lastPath.push({ x, y })
        let normals = [getNormal(lastPath[lastPath.length - 1], lastPath[lastPath.length - 2])]

        // one point in second half
        x = x + Math.round(p.random(-randomWidth, randomWidth)) * gap
        y = y + (p.random(-randomHeight, randomHeight))
        lastPath.push({ x, y })
        normals.push(getNormal(lastPath[lastPath.length - 1], lastPath[lastPath.length - 2]))

        // one point on bottom
        // x = x + Math.round(p.random(-randomWidth, randomWidth)) * gap
        x = xMargin - gap
        y = p.height - yMargin
        lastPath.push({ x, y })
        normals.push(getNormal(lastPath[lastPath.length - 1], lastPath[lastPath.length - 2]))

        for (let index = 0; index < count; index++) {

            let x = xMargin + gap * index
            let y = yMargin

            renderer.noFill()
            renderer.beginShape()
            renderer.curveVertex(x, y)
            renderer.curveVertex(x, y)

            for (let step = 0; step < 2; step++) {

                let referencePoint = lastPath[step + 1]
                let normal = normals[step]

                x = referencePoint.x + normal.x * gap
                y = referencePoint.y + normal.y * gap
                renderer.curveVertex(x, y)
                lastPath[step + 1] = { x, y }
            }
            let lastPoint = { x: xMargin + gap * index, y: yMargin + length }
            renderer.curveVertex(lastPoint.x, lastPoint.y)
            renderer.curveVertex(lastPoint.x, lastPoint.y)

            renderer.endShape()

            // 
        }
    }

    p.draw = () => {
        const renderer = saveNextDraw ? svgG : p;
        p.randomSeed(settings.seed)
        renderer.background(255, 255, 255)
        renderer.stroke(55, 129, 62, 60)
        renderer.strokeWeight(mmToPx)

        const gap = settings.gap * mmToPx
        const gapOffset = settings.gapOffset * mmToPx

        const xMargin = settings.xMargin * mmToPx
        const yMargin = settings.yMargin * mmToPx
        const length = settings.length * mmToPx
        const count = settings.count


        drawStraightLines(count, xMargin, yMargin, gap, length, renderer)
        drawStraightLines(count, xMargin, yMargin, gap + gapOffset, length, renderer)

        // drawRandomLines(count, xMargin, yMargin, gap, length, renderer)
        // drawRandomLines(count, xMargin, yMargin, gap, length, renderer)
        if (saveNextDraw) {
            svgG.save('print.svg')
            saveNextDraw = false
        }
    }
}