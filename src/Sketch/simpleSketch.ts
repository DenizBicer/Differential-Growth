import p5 from "p5";
import { GUI } from 'dat.gui'

import { World } from "../Core/World";
import { AddDifferentialGrowthParameters, DifferentialGrowthUpdate } from "../ForceSource/DifferentialGrowth";
import { CreateCirclePath } from "../Core/path";
import { drawPath } from "../Draw/PathDraw";
import { PlayEvents, PlayControlsUi } from "../UI/playControlsUi";

export const sketch = (p: p5) => {
    let world: World
    const events: PlayEvents = {
        updatePlay,
        nextFrame,
        restart,
        clear,
    }

    let isPlaying: boolean = false

    p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight)

        world = new World()
        const gui = new GUI()

        AddDifferentialGrowthParameters(gui)
        const playControlsUi = new PlayControlsUi( events, isPlaying)
        canvas.elt.parentElement.before(playControlsUi.element)
    }



    p.draw = () => {
        p.background(255)

        if (isPlaying) {
            update()
        }
        p.noFill()
        
        // draw path
        world.paths.forEach(path => drawPath(p, path))

        // draw nodes
        world.paths.forEach(path => {
            path.nodes.forEach(node => {
                p.fill('black')
                p.noStroke()
                p.ellipse(node.point.x, node.point.y, 4)
            })
        })
    }

    function update() {
        world.preUpdate()
        DifferentialGrowthUpdate(world.paths, world.tree)
        world.lateUpdate()
    }

    function nextFrame() {
        update()
    }
    
    function clear()
    {
        world.clear()
    }

    function restart() {
        world.clear()
        const path1 = CreateCirclePath(p.createVector(p.width / 2 - 50, p.height / 2), 50)
        const path2 = CreateCirclePath(p.createVector(p.width / 2 + 50, p.height / 2), 50)
        world.addPath(path1)
        world.addPath(path2)
    }

    function updatePlay(play: boolean) {
        isPlaying = play
    }
}
