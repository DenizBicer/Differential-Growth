import p5 from "p5";
import { GUI } from 'dat.gui'

import { CreateCirclePath, DrawPath } from "../Core/path";
import { World } from "../Core/World";

export const sketch = (p: p5) => {
    let world: World
    const settings = {
        debug: false,
        play: false,
        nextFrame,
        restart,
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

        if (settings.play) {
            world.update()
        }
        p.noFill()
        world.paths.forEach(path => DrawPath(p, path))

        if (settings.debug)
            drawDebug()
    }

    function nextFrame() {
        world.update()
    }

    function restart() {
        world.clear()
        const path1 = CreateCirclePath(p.createVector(p.width / 2 - 50, p.height / 2), 50)
        const path2 = CreateCirclePath(p.createVector(p.width / 2 + 50, p.height / 2), 50)
        world.addPath(path1)
        world.addPath(path2)
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