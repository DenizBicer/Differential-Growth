import { ParameterArea } from "./differentialGrowthControlsView";
import './nodeDistanceUi.css'
export class NodeDistanceUi {
    element: HTMLElement
    onMaxNodeDistanceChanged: ((distance: number) => void) | undefined

    constructor(parameterArea: ParameterArea) {
        this.element = this.createGroup(['nodeDistanceGroup'])
        parameterArea.customAreaElement.appendChild(this.element)
        this.createSlider(this.element, 'min')
        this.createSlider(this.element, 'max')
    }

    setMinNodeDistance(minNodeDistance: number) {

    }
    setMaxNodeDistance(maxNodeDistance: number) {

    }

    bindOnMaxDistanceChanged(callback: (distance: number) => void) {
        this.onMaxNodeDistanceChanged = callback
    }

    createGroup(classNames: string[]): HTMLElement {
        const group = document.createElement('div')
        classNames.forEach(className => group.classList.add(className))
        return group
    }


    createSlider(parentElement: HTMLElement, label: string) {
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
        knob.setAttribute('cx', '70')
        knob.setAttribute('cy', '4')
        knob.setAttribute('r', '3.5')
        slider.appendChild(knob)


        sliderArea.appendChild(slider)


        parentElement.appendChild(sliderArea)
    }
}