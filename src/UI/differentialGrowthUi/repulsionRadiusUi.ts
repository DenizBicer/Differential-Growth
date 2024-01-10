import { ParameterArea } from "./differentialGrowthControlsView"
import { RadiusParameter } from "./radiusParameter"

export class RepulsionRadiusUi{
    private resetButton: SVGElement

    private repulsionRadiusParameter: RadiusParameter

    private initialRepulsionRadius: number | undefined

    private onRepulsionRadiusChanged: ((repulsionRadius: number) => void) | undefined

    constructor(parameterArea: ParameterArea, minValue: number, maxValue: number) {
        const repulsionRadiusGroup = document.createElement('div')
        repulsionRadiusGroup.classList.add('repulsionRadiusGroup')
        parameterArea.customAreaElement.appendChild(repulsionRadiusGroup)

        this.repulsionRadiusParameter = new RadiusParameter(repulsionRadiusGroup, minValue, maxValue, 10, 40)
        this.repulsionRadiusParameter.sliderElement.addEventListener('change', (() => this.onSliderChanged()).bind(this))

        this.resetButton = parameterArea.resetButton
        this.resetButton.addEventListener('click', this.onResetClicked.bind(this))
        this.setResetButtonVisibility(false)
    }

    setRepulsionRadius(repulsionRadius: number) {
        this.initialRepulsionRadius = this.initialRepulsionRadius || repulsionRadius;
        this.repulsionRadiusParameter.setValue(repulsionRadius)
    }

    bindOnRepulsionRadiusChanged(callback: (repulsionRadius: number) => void) {
        this.onRepulsionRadiusChanged = callback
    }

    private setResetButtonVisibility(isVisible: boolean) {
        this.resetButton.classList.toggle('hidden', !isVisible);
    }

    private onResetClicked() {
        this.repulsionRadiusParameter.setValue(this.initialRepulsionRadius || 0)
        this.setResetButtonVisibility(false)
        this.onRepulsionRadiusChanged && this.onRepulsionRadiusChanged(this.repulsionRadiusParameter.currentValue)
    }

    private onSliderChanged() {
        this.setResetButtonVisibility(true)
        this.onRepulsionRadiusChanged && this.onRepulsionRadiusChanged(this.repulsionRadiusParameter.currentValue)
    }
}