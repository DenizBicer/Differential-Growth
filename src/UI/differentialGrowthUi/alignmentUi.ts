import { ParameterArea } from "./differentialGrowthControlsView";
import { Slider } from "./slider";
import './alignmentUi.css'

export class AlignmentUi {
    private resetButton: SVGElement
    
    private alignmentSlider: Slider
    
    private initialAlignmentMagnitude: number | undefined

    private onAlignmentMagnitudeChanged: ((alignmentMagnitude: number) => void) | undefined

    constructor(parameterArea: ParameterArea, minValue: number, maxValue: number) {
        const alignmentGroup = document.createElement('div')
        alignmentGroup.classList.add('alignmentGroup')
        parameterArea.customAreaElement.appendChild(alignmentGroup)


        this.alignmentSlider = new Slider(alignmentGroup, '', minValue, maxValue, 'triangle', 56)
        this.alignmentSlider.sliderElement.addEventListener('change', this.onSliderChanged.bind(this))

        this.resetButton = parameterArea.resetButton
        this.resetButton.addEventListener('click', this.onResetClicked.bind(this))
        this.setResetButtonVisibility(false)
    }

    setAlignmentMagnitude(alignmentMagnitude: number) {
        this.initialAlignmentMagnitude = this.initialAlignmentMagnitude || alignmentMagnitude;
        this.alignmentSlider.setValue(alignmentMagnitude)
    }

    bindOnAlignmentMagnitudeChanged(callback: (alignmentMagnitude: number) => void) {
        this.onAlignmentMagnitudeChanged = callback
    }

    private setResetButtonVisibility(isVisible: boolean) {
        this.resetButton.classList.toggle('hidden', !isVisible);
    }

    private onResetClicked() {
        this.alignmentSlider.setValue(this.initialAlignmentMagnitude || 0)
        this.setResetButtonVisibility(false)
        this.onAlignmentMagnitudeChanged && this.onAlignmentMagnitudeChanged(this.alignmentSlider.currentValue)
    }

    private onSliderChanged() {
        this.setResetButtonVisibility(true)
        this.onAlignmentMagnitudeChanged && this.onAlignmentMagnitudeChanged(this.alignmentSlider.currentValue)
    }
}