import { DifferentialGrowthSettings } from '../../ForceSource/DifferentialGrowth'
import './differentialGrowthControlsView.css'
import { NodeDistanceUi } from './nodeDistanceUi'

export type ParameterArea = {
    parameterAreaElement: HTMLDivElement,
    customAreaElement: HTMLDivElement,
    resetButton: SVGElement
}

export class DifferentialGrowthControlsView {

    element: HTMLElement
    nodeDistanceUi: NodeDistanceUi

    constructor() {
        this.element = this.createGroup(['differentialGrowthControlsGroup'])
        this.createParameterArea(this.element, 'Alignment')
        this.createParameterArea(this.element, 'Repulsion')
        this.createParameterArea(this.element, 'Repulsion Radius')
        const nodeDistanceParameterArea = this.createParameterArea(this.element, 'Node Distance')

        this.nodeDistanceUi = new NodeDistanceUi(nodeDistanceParameterArea, 5, 30)
    }

    createGroup(classNames: string[]): HTMLElement {
        const group = document.createElement('div')
        classNames.forEach(className => group.classList.add(className))
        return group
    }

    createParameterArea(parentElement: HTMLElement, title: string): ParameterArea {
        const parameterAreaElement = document.createElement('div')
        parameterAreaElement.classList.add('parameterArea')

        const topButtonArea = document.createElement('div')
        topButtonArea.classList.add('topButtonArea')
        parameterAreaElement.appendChild(topButtonArea)

        const resetButton = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        resetButton.setAttribute('width', '24')
        resetButton.setAttribute('height', '24')
        resetButton.setAttribute('viewBox', '0 0 24 24')
        resetButton.setAttribute('stroke-width', '1.5')
        resetButton.setAttribute('fill', 'none')

        resetButton.innerHTML = `
        <path d="M4.5 8C8.5 8 11 8 15 8C15 8 15 8 15 8C15 8 20 8 20 12.7059C20 18 15 18 15 18C11.5714 18 9.71429 18 6.28571 18" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M7.5 11.5C6.13317 10.1332 5.36683 9.36683 4 8C5.36683 6.63317 6.13317 5.86683 7.5 4.5"  stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
        `
        resetButton.classList.add('resetButton')
        parameterAreaElement.appendChild(resetButton)
        topButtonArea.appendChild(resetButton)
        
        const customAreaElement = document.createElement('div')
        customAreaElement.classList.add('customArea')
        parameterAreaElement.appendChild(customAreaElement)

        const text = document.createElement('div')
        text.classList.add('parameterTitle')
        text.innerText = title
        parameterAreaElement.appendChild(text)
        parentElement.appendChild(parameterAreaElement)
        return {
            parameterAreaElement,
            customAreaElement,
            resetButton
        }
    }
    showSettings(settings: DifferentialGrowthSettings) {
        this.nodeDistanceUi.setMaxNodeDistance(settings.maxNodeDistance)
        this.nodeDistanceUi.setMinNodeDistance(settings.minNodeDistance)
    }

    bindMinNodeDistanceChanged(callback: (distance: number) => void) {
        this.nodeDistanceUi.bindOnMinDistanceChanged(callback)
    }

    bindMaxNodeDistanceChanged(callback: (distance: number) => void) {
        this.nodeDistanceUi.bindOnMaxDistanceChanged(callback)
    }


}