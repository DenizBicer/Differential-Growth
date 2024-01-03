import p5 from "p5";
import { GUI } from 'dat.gui'

import { World } from "../Core/World";
import { AddDifferentialGrowthParameters, DifferentialGrowthUpdate } from "../ForceSource/DifferentialGrowth";
import { CreateCirclePath } from "../Core/path";
import { drawPath } from "../Draw/PathDraw";

export const sketch = (p: p5) => {
    let world: World
    const settings = {
        debug: true,
        play: true,
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

        AddDifferentialGrowthParameters(gui)
        restart()
    }



    p.draw = () => {
        p.background(255)

        if (settings.play) {
            update()
        }
        p.noFill()
        world.paths.forEach(path => drawPath(p, path))

        if (settings.debug)
            drawDebug()
    }

    function update() {
        world.preUpdate()
        DifferentialGrowthUpdate(world.paths, world.tree)
        world.lateUpdate()
    }

    function nextFrame() {
        update()
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
