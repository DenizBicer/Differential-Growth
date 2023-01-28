import './style.css'
import { sketchManager, SketchMap } from './Sketch/manageSketches'
import { sketch } from './Sketch/lineSketch'

const sketches: SketchMap[] = [
  {
    id: 'sketch',
    sketch,
  }
]

new sketchManager(sketches)