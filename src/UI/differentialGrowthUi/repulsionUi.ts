import { ParameterArea } from "./differentialGrowthControlsView"
import { Slider } from "./slider"

export class RepulsionUi{
    private resetButton: SVGElement
    
    private repulsionSlider: Slider

    private initialRepulsionMagnitude: number | undefined

    private onRepulsionMagnitudeChanged: ((repulsionMagnitude: number) => void) | undefined

    constructor(parameterArea: ParameterArea, minValue: number, maxValue: number) {
        this.repulsionSlider = new Slider(parameterArea.customAreaElement, '', minValue, maxValue, 'triangle')
        this.repulsionSlider.sliderElement.addEventListener('change', this.onSliderChanged.bind(this))

        this.resetButton = parameterArea.resetButton
        this.resetButton.addEventListener('click', this.onResetClicked.bind(this))
        this.setResetButtonVisibility(false)
    }

    setRepulsionMagnitude(repulsionMagnitude: number) {
        this.initialRepulsionMagnitude = this.initialRepulsionMagnitude || repulsionMagnitude;
        this.repulsionSlider.setValue(repulsionMagnitude)
    }

    bindOnRepulsionMagnitudeChanged(callback: (repulsionMagnitude: number) => void) {
        this.onRepulsionMagnitudeChanged = callback
    }

    private setResetButtonVisibility(isVisible: boolean) {
        this.resetButton.classList.toggle('hidden', !isVisible);
    }

    private onResetClicked() {
        this.repulsionSlider.setValue(this.initialRepulsionMagnitude || 0)
        this.setResetButtonVisibility(false)
        this.onRepulsionMagnitudeChanged && this.onRepulsionMagnitudeChanged(this.repulsionSlider.currentValue)
    }

    private onSliderChanged() {
        this.setResetButtonVisibility(true)
        this.onRepulsionMagnitudeChanged && this.onRepulsionMagnitudeChanged(this.repulsionSlider.currentValue)
    }
    
}