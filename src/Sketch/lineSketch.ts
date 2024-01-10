import p5 from "p5";
import {GUI} from 'dat.gui'

import { World } from "../Core/World";
import { AddDropForce } from "../ForceSource/InkDrop";
import { AddDifferentialGrowthParameters, DifferentialGrowthUpdate } from "../ForceSource/DifferentialGrowth";
import { AddAttractionForce, AddDirectedForceParameters } from "../ForceSource/DirectedForce";
import { CreateCirclePath } from "../Core/path";
import { AddMeshDrawParameters, DrawMesh } from "../Draw/MeshDraw";
import { AddNodeDrawParameters, DrawNode } from "../Draw/NodeDraw";
import {record} from "../Record/recording";

export const sketch = (p: p5) => {
    let world: World
    let currentPushRadius: number
    let isPushing: boolean

    const settings = {
        debug: false,
        play: true,
        nextFrame,
        restart,
        toggleRecording,
        backgroundGray: 255,
        backgroundAlpha: 255,
        dropImpactFactor: 0.1,
        pushMaxRadius: 200
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
        AddNodeDrawParameters(gui)
        AddDirectedForceParameters(gui)
        restart()
    }

    p.draw = () => {
        p.background(settings.backgroundGray, settings.backgroundAlpha)

        if (isPushing) {
            const addedRadius = 2.5
            currentPushRadius += addedRadius

            currentPushRadius = currentPushRadius > settings.pushMaxRadius ? settings.pushMaxRadius : currentPushRadius

            const dropPoint = p.createVector(p.mouseX, p.mouseY)
            AddDropForce(dropPoint, currentPushRadius * settings.dropImpactFactor, world.paths)
        }

        if (settings.play) {
            update()
        }

        world.paths.forEach(path => DrawMesh(p, path, world.tree))
        world.paths.forEach(path => DrawNode(p, path, world.tree))

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

        const path = CreateCirclePath(p.createVector(p.width / 2, p.height / 2), 100)
        world.addPath(path)
    }

    function toggleRecording() {
        const canvas = document.getElementsByClassName('p5Canvas')[0] as HTMLCanvasElement

        if (!canvas)
            return

        const recording = record(canvas, 10000)

// download it
        const link$ = document.createElement('a');
        link$.setAttribute('download', 'recordingVideo')
        recording.then(url => {
            link$.setAttribute('href', url)
            link$.click()
        })
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
                p.line(node.point.x, node.point.y, node.point.x + node.prevForce.x * 10, node.point.y + node.prevForce.y * 10)
            })
        })
        p.pop()
    }

}
