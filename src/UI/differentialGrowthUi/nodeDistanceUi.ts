import { ParameterArea } from "./differentialGrowthControlsView";
import './nodeDistanceUi.css'
import { Slider } from "./slider";

export class NodeDistanceUi {
    element: HTMLElement
    resetButton: SVGElement

    minSlider: Slider
    maxSlider: Slider

    initialMinNodeDistance: number | undefined
    initialMaxNodeDistance: number | undefined

    onMaxNodeDistanceChanged: ((distance: number) => void) | undefined
    onMinNodeDistanceChanged: ((distance: number) => void) | undefined

    constructor(parameterArea: ParameterArea, minValue: number, maxValue: number) {
        this.element = this.createGroup(['nodeDistanceGroup'])
        parameterArea.customAreaElement.appendChild(this.element)
        this.minSlider = new Slider(this.element, 'min', minValue, maxValue)
        this.maxSlider = new Slider(this.element, 'max', minValue, maxValue)

        this.minSlider.sliderElement.addEventListener('change', this.onMinSliderChanged.bind(this))
        this.maxSlider.sliderElement.addEventListener('change', this.onMaxSliderClicked.bind(this))

        this.resetButton = parameterArea.resetButton
        this.resetButton.addEventListener('click', this.onResetClicked.bind(this))
        this.setResetButtonVisibility(false)
    }

    createGroup(classNames: string[]): HTMLElement {
        const group = document.createElement('div')
        classNames.forEach(className => group.classList.add(className))
        return group
    }

    setResetButtonVisibility(isVisible: boolean) {
        this.resetButton.classList.toggle('hidden', !isVisible);
    }

    setMinNodeDistance(minNodeDistance: number) {
        this.initialMinNodeDistance = this.initialMinNodeDistance || minNodeDistance;
        this.minSlider.setValue(minNodeDistance)
    }

    setMaxNodeDistance(maxNodeDistance: number) {
        this.initialMaxNodeDistance = this.initialMaxNodeDistance || maxNodeDistance;
        this.maxSlider.setValue(maxNodeDistance)
    }

    bindOnMaxDistanceChanged(callback: (distance: number) => void) {
        this.onMaxNodeDistanceChanged = callback
    }

    bindOnMinDistanceChanged(callback: (distance: number) => void) {
        this.onMinNodeDistanceChanged = callback
    }

    onResetClicked() {
        if (this.initialMinNodeDistance === undefined || this.initialMaxNodeDistance === undefined) {
            return
        }

        this.setResetButtonVisibility(false)
        this.onMinNodeDistanceChanged && this.onMinNodeDistanceChanged(this.initialMinNodeDistance)
        this.onMaxNodeDistanceChanged && this.onMaxNodeDistanceChanged(this.initialMaxNodeDistance)
    }

    onMinSliderChanged() {
        this.onChange(this.minSlider.currentValue, this.onMinNodeDistanceChanged)
    }

    onMaxSliderClicked() {
        this.onChange(this.maxSlider.currentValue, this.onMaxNodeDistanceChanged)
    }

    onChange(newDistance: number, callback: ((distance: number) => void) | undefined) {
        this.setResetButtonVisibility(true)
        callback && callback(newDistance)
    }
}