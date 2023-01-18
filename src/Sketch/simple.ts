import p5 from "p5";
import { GUI } from 'dat.gui'

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
        world = new World()
        world.addPath(path)


        const gui = new GUI()
        const folder = gui.addFolder('sketch')
        for (const property in settings) {
            folder.add(settings, property)
        }

        world.addParametersToGui(gui)
    }

    p.draw = () => {
        p.background(255)
        world.update()
        world.paths.forEach(path => DrawPath(p, path))
    }

}