import p5 from "p5";
import { GUI } from 'dat.gui'

import { World } from "../Core/World";
import { AddDropForce } from "../ForceSource/InkDrop";
import { AddDifferentialGrowthParameters, DifferentialGrowthUpdate } from "../ForceSource/DifferentialGrowth";
import { AddAttractionForce, AddDirectedForceParameters } from "../ForceSource/DirectedForce";
import { CreateLinePath } from "../Core/path";
import { AddMeshDrawParameters, DrawMesh } from "../Draw/MeshDraw";

export const sketch = (p: p5) => {
    let world: World
    let currentPushRadius: number
    let isPushing: boolean

    const settings = {
        debug: false,
        play: true,
        nextFrame,
        restart,
        backgroundGray: 255,
        backgroundAlpha: 255,
        dropImpactFactor: 0.1
    }

    p.setup = () => {
        const canvas = p.createCanvas(800, 600)
        canvas.mousePressed(mousePressed)
        canvas.mouseReleased(mouseReleased)

        world = new World()
        const gui = new GUI()
        const folder = gui.addFolder('sketch')
        for (const property in settings) {
            folder.add(settings, property)
        }

        world.addWorldParameters(gui)
        AddDifferentialGrowthParameters(gui)
        AddMeshDrawParameters(gui)
        AddDirectedForceParameters(gui)
        restart()
    }

    p.draw = () => {
        p.background(settings.backgroundGray, settings.backgroundAlpha)

        if (isPushing) {
            const addedRadius = 2.5
            currentPushRadius += addedRadius

            currentPushRadius = currentPushRadius > 100 ? 100 : currentPushRadius

            const dropPoint = p.createVector(p.mouseX, p.mouseY)
            AddDropForce(dropPoint, currentPushRadius * settings.dropImpactFactor, world.paths)
        }

        if (settings.play) {
            update()
        }

        world.paths.forEach(path => DrawMesh(p, path, world.tree))


        p.noFill()

        if (settings.debug)
            drawDebug()
    }

    function mousePressed() {
        currentPushRadius = 0

        isPushing = true

    }

    function mouseReleased() {

        isPushing = false;
    }


    function update() {
        const center = p.createVector(p.width / 2, p.height / 2)

        world.preUpdate()

        DifferentialGrowthUpdate(world.paths, world.tree)
        AddAttractionForce(center, world.paths)
        world.lateUpdate()



    }


    function nextFrame() {
        update()
    }

    function restart() {
        world.clear()

        const margin = p.width / 20
        const y = p.height / 2
        const path = CreateLinePath(p.createVector(margin, y), p.createVector(p.width - margin, y))
        world.addPath(path)
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
