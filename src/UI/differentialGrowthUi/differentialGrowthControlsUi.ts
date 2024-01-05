import './differentialGrowthControlsUi.css'
export type ParameterChangeEvents = {
    maxNodeDistanceChanged: (nodeDistance: number) => void
}

export class DifferentialGrowthControlsUi {
    changeEvents: ParameterChangeEvents

    element: HTMLElement

    constructor(e: ParameterChangeEvents) {
        this.changeEvents = e
        this.element = this.createGroup(['differentialGrowthControlsGroup'])
        this.createParameterArea(this.element, 'Alignment')
        this.createParameterArea(this.element, 'Repulsion')
        this.createParameterArea(this.element, 'Repulsion Radius')
        this.createParameterArea(this.element, 'Node Distance')
    }

    createGroup(classNames: string[]): HTMLElement {
        const group = document.createElement('div')
        classNames.forEach(className => group.classList.add(className))
        return group
    }

    createParameterArea(parentElement: HTMLElement, title:string): HTMLElement {
        const area = document.createElement('div')
        area.classList.add('parameterArea')

        const customArea = document.createElement('div')
        customArea.classList.add('customArea')
        area.appendChild(customArea)
        
        const text = document.createElement('div')
        text.classList.add('parameterTitle')
        text.innerText = title
        area.appendChild(text)
        parentElement.appendChild(area)
        return area
    }
}