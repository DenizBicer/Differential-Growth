import './styles/reset.css'
import './styles/index.css'
import './styles/article-image.css'
import './styles/article.css'
import './styles/button.css'
import './styles/text.css'

import { sketchManager, SketchMap } from './Sketch/manageSketches'
import { sketch } from './Sketch/simpleSketch'

const sketches: SketchMap[] = [
  {
    id: 'sketch',
    sketch,
  }
]

new sketchManager(sketches)