import p5 from "p5";
import { GUI } from 'dat.gui'


import { AddParametersToGui, UpdateDifferentialGrowthForces } from "../Core/DifferentialGrowth";
import { CreateCirclePath, DrawPath } from "../Core/path";
import { World } from "../Core/World";

export const mainSketch = (p: p5) => {
    let world: World
    const settings = {
        debug: false,
    }

    p.setup = () => {
        p.createCanvas(400, 400)
        const path = CreateCirclePath(p.createVector(p.width / 2, p.height / 2), 100)
        world = new World
        world.addPath(path)


        const gui = new GUI()
        const folder = gui.addFolder('sketch')
        for (const property in settings) {
            folder.add(settings, property)
        }

        AddParametersToGui(gui)
    }

    p.draw = () => {
        p.background(255)

        UpdateDifferentialGrowthForces(world)
        if (settings.debug) { drawDebug() }

        world.applyForces()


        world.paths.forEach(path => DrawPath(p, path))
    }

    function drawDebug() {
        p.push()
        p.stroke('red')
        world.paths.forEach(path => {
            path.nodes.forEach(node => {
                p.line(node.point.x, node.point.y, node.point.x + node.force.x, node.point.y + node.force.y)
            })
        })
        p.pop()
    }
}