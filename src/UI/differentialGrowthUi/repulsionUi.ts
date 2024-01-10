import { ParameterArea } from "./differentialGrowthControlsView"
import { Slider } from "./slider"
import './repulsionUi.css'

export class RepulsionUi{
    private resetButton: SVGElement
    
    private repulsionSlider: Slider
    private repulsionDuplicateSlider: Slider

    private initialRepulsionMagnitude: number | undefined

    private onRepulsionMagnitudeChanged: ((repulsionMagnitude: number) => void) | undefined

    constructor(parameterArea: ParameterArea, minValue: number, maxValue: number) {
        const repulsionGroup = document.createElement('div')
        repulsionGroup.classList.add('repulsionGroup')
        parameterArea.customAreaElement.appendChild(repulsionGroup)

        const sliderLength = 60

        this.repulsionSlider = new Slider(repulsionGroup, '', minValue, maxValue, 'triangle', sliderLength,
                                            20,10, 'backward')
        this.repulsionSlider.sliderElement.addEventListener('change', (() => this.onSliderChanged(this.repulsionSlider)).bind(this))

        this.repulsionDuplicateSlider = new Slider(repulsionGroup, '', minValue, maxValue, 'triangle', sliderLength)
        this.repulsionDuplicateSlider.sliderElement.addEventListener('change', (() => this.onSliderChanged(this.repulsionDuplicateSlider)).bind(this))

        this.resetButton = parameterArea.resetButton
        this.resetButton.addEventListener('click', this.onResetClicked.bind(this))
        this.setResetButtonVisibility(false)
    }

    setRepulsionMagnitude(repulsionMagnitude: number) {
        this.initialRepulsionMagnitude = this.initialRepulsionMagnitude || repulsionMagnitude;
        this.repulsionSlider.setValue(repulsionMagnitude)
        this.repulsionDuplicateSlider.setValue(repulsionMagnitude)
    }

    bindOnRepulsionMagnitudeChanged(callback: (repulsionMagnitude: number) => void) {
        this.onRepulsionMagnitudeChanged = callback
    }

    private setResetButtonVisibility(isVisible: boolean) {
        this.resetButton.classList.toggle('hidden', !isVisible);
    }

    private onResetClicked() {
        this.repulsionSlider.setValue(this.initialRepulsionMagnitude || 0)
        this.repulsionDuplicateSlider.setValue(this.initialRepulsionMagnitude || 0)
        this.setResetButtonVisibility(false)
        this.onRepulsionMagnitudeChanged && this.onRepulsionMagnitudeChanged(this.repulsionSlider.currentValue)
    }

    private onSliderChanged(slider: Slider) {
        this.setResetButtonVisibility(true)
        this.onRepulsionMagnitudeChanged && this.onRepulsionMagnitudeChanged(slider.currentValue)
    }
    
}