import { map } from "../../Core/Math";
import { ParameterArea } from "./differentialGrowthControlsView";
import './nodeDistanceUi.css'

const minSliderXOffset = 3.5
const maxSliderXOffset = 70

type Slider = {
    sliderElement: SVGElement
    lineElement: SVGLineElement
    knobElement: SVGCircleElement
}

export class NodeDistanceUi {
    element: HTMLElement
    minSlider: Slider
    maxSlider: Slider
    minValue: number
    maxValue: number
    onMaxNodeDistanceChanged: ((distance: number) => void) | undefined
    onMinNodeDistanceChanged: ((distance: number) => void) | undefined

    constructor(parameterArea: ParameterArea, minValue: number, maxValue: number) {
        this.minValue = minValue
        this.maxValue = maxValue
        this.element = this.createGroup(['nodeDistanceGroup'])
        parameterArea.customAreaElement.appendChild(this.element)
        this.minSlider = this.createSlider(this.element, 'min')
        this.maxSlider = this.createSlider(this.element, 'max')

        this.minSlider.sliderElement.addEventListener('click', this.onMinSliderClicked.bind(this))
        this.maxSlider.sliderElement.addEventListener('click', this.onMaxSliderClicked.bind(this))
    }

    setMinNodeDistance(minNodeDistance: number) {

        const newOffsetX = map(minNodeDistance, this.minValue, this.maxValue, minSliderXOffset, maxSliderXOffset)
        this.setSliderOffset(this.minSlider, newOffsetX)
    }

    setMaxNodeDistance(maxNodeDistance: number) {
        const newOffsetX = map(maxNodeDistance, this.minValue, this.maxValue, minSliderXOffset, maxSliderXOffset)
        this.setSliderOffset(this.maxSlider, newOffsetX)
    }

    setSliderOffset(slider: Slider, offsetX: number) {

        slider.knobElement.setAttribute('cx', `${offsetX}`)
        slider.lineElement.setAttribute('x2', `${offsetX}`)
    }

    bindOnMaxDistanceChanged(callback: (distance: number) => void) {
        this.onMaxNodeDistanceChanged = callback
    }

    bindOnMinDistanceChanged(callback: (distance: number) => void) {
        this.onMinNodeDistanceChanged = callback
    }

    onMinSliderClicked(ev: MouseEvent) {
        const newDistance = map(ev.offsetX, minSliderXOffset, maxSliderXOffset, this.minValue, this.maxValue)
        this.onMinNodeDistanceChanged && this.onMinNodeDistanceChanged(newDistance)
    }


    onMaxSliderClicked(ev: MouseEvent) {
        const newDistance = map(ev.offsetX, minSliderXOffset, maxSliderXOffset, this.minValue, this.maxValue)
        this.onMaxNodeDistanceChanged && this.onMaxNodeDistanceChanged(newDistance)
    }

    createGroup(classNames: string[]): HTMLElement {
        const group = document.createElement('div')
        classNames.forEach(className => group.classList.add(className))
        return group
    }


    createSlider(parentElement: HTMLElement, label: string): Slider {
        const sliderArea = document.createElement('div')
        sliderArea.classList.add('sliderArea')

        const sliderLabel = document.createElement('div')
        sliderLabel.classList.add('sliderLabel')
        sliderLabel.innerText = label
        sliderArea.appendChild(sliderLabel)

        const slider = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        slider.setAttribute('width', '100')
        slider.setAttribute('height', '8')
        slider.setAttribute('viewBox', '0 0 100 8')
        slider.setAttribute('fill', '#7747FF')
        slider.setAttribute('stroke', '#9B9B9B')

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        line.setAttribute('x1', '2')
        line.setAttribute('y1', '4')
        line.setAttribute('x2', '70')
        line.setAttribute('y2', '4')
        line.setAttribute('stroke-width', '3')
        slider.appendChild(line)

        const anchorCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        anchorCircle.setAttribute('cx', '3.5')
        anchorCircle.setAttribute('cy', '4')
        anchorCircle.setAttribute('r', '3.5')
        anchorCircle.setAttribute('fill', 'black')
        slider.appendChild(anchorCircle)

        const knob = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        knob.setAttribute('cx', '0')
        knob.setAttribute('cy', '4')
        knob.setAttribute('r', '3.5')
        slider.appendChild(knob)


        sliderArea.appendChild(slider)

        parentElement.appendChild(sliderArea)

        return {
            sliderElement: slider,
            lineElement: line,
            knobElement: knob
        }
    }
}