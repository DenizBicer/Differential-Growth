import p5 from "p5";
import { GUI } from 'dat.gui'

import { CreateCirclePath, DrawPath } from "../Core/path";
import { World } from "../Core/World";
import { AddDropForce } from "../ForceSource/InkDrop";

export const sketch = (p: p5) => {
    let world: World
    let currentDropRadius: number

    const settings = {
        debug: false,
        play: true,
        nextFrame,
        restart,
        dropMinRadius: 20,
    }

    p.setup = () => {
        p.createCanvas(600, 600)

        world = new World()
        const gui = new GUI()
        const folder = gui.addFolder('sketch')
        for (const property in settings) {
            folder.add(settings, property)
        }

        world.addParametersToGui(gui)
        restart()
    }

    p.draw = () => {
        p.background(255)

        if (p.mouseIsPressed) {
            currentDropRadius += 2.5
            p.ellipse(p.mouseX, p.mouseY, currentDropRadius)
        }

        if (settings.play) {
            world.update()
        }

        p.noFill()
        world.paths.forEach(path => DrawPath(p, path))

        if (settings.debug)
            drawDebug()
    }

    p.mousePressed = () => {
        currentDropRadius = 0
    }

    p.mouseReleased = () => {
        if (currentDropRadius < settings.dropMinRadius)
            return
        const dropPoint = p.createVector(p.mouseX, p.mouseY)
        const path = CreateCirclePath(dropPoint, currentDropRadius)
        AddDropForce(dropPoint, currentDropRadius, world.paths)
        world.addPath(path)
    }

    function nextFrame() {
        world.update()
    }

    function restart() {
        world.clear()
    }

    function drawDebug() {
        p.push()


        world.paths.forEach(path => {
            path.nodes.forEach(node => {
                p.fill('blue')
                p.noStroke()
                p.ellipse(node.point.x, node.point.y, 5)

                p.noFill()
                p.stroke('red')
                p.line(node.point.x, node.point.y, node.point.x + node.force.x, node.point.y + node.force.y)
            })
        })
        p.pop()
    }

}