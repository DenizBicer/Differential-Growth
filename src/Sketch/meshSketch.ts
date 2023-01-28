import p5 from "p5";
import { GUI } from 'dat.gui'

import { CreateCirclePath } from "../Core/path";
import { World } from "../Core/World";
import { AddDropForce } from "../ForceSource/InkDrop";
import { AddDifferentialGrowthParameters, DifferentialGrowthUpdate } from "../ForceSource/DifferentialGrowth";
import { AddMeshDrawParameters, DrawMesh } from "../Draw/MeshDraw";
import { AddAttractionForce, AddDirectedForceParameters } from "../ForceSource/DirectedForce";

export const sketch = (p: p5) => {
    let world: World
    let currentDropRadius: number
    let isDropping: boolean

    const settings = {
        debug: false,
        play: true,
        nextFrame,
        restart,
        backgroundGray: 255,
        backgroundAlpha: 255,
        dropMinRadius: 20,
        dropImpactFactor: 0.1,
        addNewPathToWorld: true,
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

        if (isDropping) {
            const addedRadius = 2.5
            currentDropRadius += addedRadius

            currentDropRadius = currentDropRadius > 100 ? 100 : currentDropRadius

            if (settings.addNewPathToWorld)
                p.ellipse(p.mouseX, p.mouseY, currentDropRadius * 2)

            const dropPoint = p.createVector(p.mouseX, p.mouseY)
            AddDropForce(dropPoint, currentDropRadius * settings.dropImpactFactor, world.paths)
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
        currentDropRadius = 0

        isDropping = true

    }

    function mouseReleased() {

        if (!isDropping)
            return

        isDropping = false

        if (currentDropRadius < settings.dropMinRadius)
            return

        if (!settings.addNewPathToWorld)
            return

        const dropPoint = p.createVector(p.mouseX, p.mouseY)
        const path = CreateCirclePath(dropPoint, currentDropRadius, 20)
        world.addPath(path)
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
