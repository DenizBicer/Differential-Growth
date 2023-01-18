import './style.css'
import { sketchManager, SketchMap } from './Sketch/manageSketches'
import { mainSketch } from './Sketch/simple'

const sketches: SketchMap[] = [
  {
    id: 'sketch',
    sketch: mainSketch,
  }
]

new sketchManager(sketches)