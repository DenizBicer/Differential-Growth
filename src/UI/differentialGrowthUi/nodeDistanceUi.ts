import { ParameterArea } from "./differentialGrowthControlsView";
import './nodeDistanceUi.css'
import { Slider } from "./slider";

export class NodeDistanceUi {
    private element: HTMLElement
    private resetButton: SVGElement

    private minSlider: Slider
    private maxSlider: Slider

    private initialMinNodeDistance: number | undefined
    private initialMaxNodeDistance: number | undefined

    private onMaxNodeDistanceChanged: ((distance: number) => void) | undefined
    private onMinNodeDistanceChanged: ((distance: number) => void) | undefined

    constructor(parameterArea: ParameterArea, minValue: number, maxValue: number) {
        this.element = this.createGroup(['nodeDistanceGroup'])
        parameterArea.customAreaElement.appendChild(this.element)
        this.minSlider = new Slider(this.element, 'min', minValue, maxValue, 'circle')
        this.maxSlider = new Slider(this.element, 'max', minValue, maxValue, 'circle')

        this.minSlider.sliderElement.addEventListener('change', this.onMinSliderChanged.bind(this))
        this.maxSlider.sliderElement.addEventListener('change', this.onMaxSliderClicked.bind(this))

        this.resetButton = parameterArea.resetButton
        this.resetButton.addEventListener('click', this.onResetClicked.bind(this))
        this.setResetButtonVisibility(false)
    }

    private createGroup(classNames: string[]): HTMLElement {
        const group = document.createElement('div')
        classNames.forEach(className => group.classList.add(className))
        return group
    }

    private setResetButtonVisibility(isVisible: boolean) {
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

    bindOnMaxNodeDistanceChanged(callback: (distance: number) => void) {
        this.onMaxNodeDistanceChanged = callback
    }

    bindOnMinNodeDistanceChanged(callback: (distance: number) => void) {
        this.onMinNodeDistanceChanged = callback
    }

    private onResetClicked() {
        if (this.initialMinNodeDistance === undefined || this.initialMaxNodeDistance === undefined) {
            return
        }

        this.setResetButtonVisibility(false)
        this.onMinNodeDistanceChanged && this.onMinNodeDistanceChanged(this.initialMinNodeDistance)
        this.onMaxNodeDistanceChanged && this.onMaxNodeDistanceChanged(this.initialMaxNodeDistance)
    }

    private onMinSliderChanged() {
        this.onChange(this.minSlider.currentValue, this.onMinNodeDistanceChanged)
    }

    private onMaxSliderClicked() {
        this.onChange(this.maxSlider.currentValue, this.onMaxNodeDistanceChanged)
    }

    private onChange(newDistance: number, callback: ((distance: number) => void) | undefined) {
        this.setResetButtonVisibility(true)
        callback && callback(newDistance)
    }
}