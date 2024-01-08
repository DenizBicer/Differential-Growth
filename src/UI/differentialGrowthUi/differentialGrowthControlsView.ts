import { DifferentialGrowthSettings } from '../../ForceSource/DifferentialGrowth'
import './differentialGrowthControlsView.css'
import { NodeDistanceUi } from './nodeDistanceUi'

export type ParameterArea = {
    parameterAreaElement: HTMLDivElement,
    customAreaElement: HTMLDivElement
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
            customAreaElement
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