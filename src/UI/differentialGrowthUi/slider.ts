import { map } from "../../Core/Math"

export type KnobType = 'circle' | 'triangle'

export class Slider {
    sliderElement: SVGElement
    currentValue: number = 0

    private lineElement: SVGLineElement
    private knobElement: SVGPathElement
    private changeEvent: Event

    private minSliderXOffset: number
    private maxSliderXOffset: number
    private r = 3.5

    private minValue: number
    private maxValue: number

    private knobYOffset: number = 0

    constructor(parentElement: HTMLElement, label: string, minValue: number, maxValue: number, knobType: KnobType, length: number = 80, height:number = 20, padding: number = 10) {
        this.minValue = minValue
        this.maxValue = maxValue
        this.minSliderXOffset = padding
        this.maxSliderXOffset = length

        const sliderArea = document.createElement('div')
        sliderArea.classList.add('sliderArea')

        const sliderLabel = document.createElement('div')
        sliderLabel.classList.add('sliderLabel')
        sliderLabel.innerText = label
        sliderArea.appendChild(sliderLabel)

        const width = length + padding
        const halfHeight = height / 2

        this.sliderElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg') as SVGSVGElement
        this.sliderElement.setAttribute('width', `${width}`)
        this.sliderElement.setAttribute('height', `${height}`)
        this.sliderElement.setAttribute('viewBox', `0 0 ${width} ${height}`)
        this.sliderElement.setAttribute('fill', '#7747FF')
        this.sliderElement.setAttribute('stroke', '#9B9B9B')

        this.lineElement = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        this.lineElement.setAttribute('x1', this.minSliderXOffset.toString())
        this.lineElement.setAttribute('y1', halfHeight.toString())
        this.lineElement.setAttribute('x2', '70')
        this.lineElement.setAttribute('y2', halfHeight.toString())
        this.lineElement.setAttribute('stroke-width', '3')
        this.sliderElement.appendChild(this.lineElement)

        const anchorCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        anchorCircle.setAttribute('cx', this.minSliderXOffset.toString())
        anchorCircle.setAttribute('cy', halfHeight.toString())
        anchorCircle.setAttribute('r', this.r.toString())
        anchorCircle.setAttribute('fill', 'black')
        this.sliderElement.appendChild(anchorCircle)

        if (knobType === 'triangle') {
            this.knobElement = document.createElementNS('http://www.w3.org/2000/svg', 'path')
            this.knobElement.setAttribute('d', `M8 4.5L0.5 8.83013L0.5 0.169873L8 4.5Z`)
            this.knobYOffset = halfHeight - 4.5
        }
        else {
            this.knobElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
            this.knobElement.setAttribute('cx', '0')
            this.knobElement.setAttribute('cy', '0')
            this.knobElement.setAttribute('r', this.r.toString())
            this.knobYOffset = halfHeight
        }
        
        this.sliderElement.appendChild(this.knobElement)



        sliderArea.appendChild(this.sliderElement)

        parentElement.appendChild(sliderArea)


        this.changeEvent = new Event('change')

        this.sliderElement.addEventListener('mousedown', this.startDrag.bind(this))
        this.sliderElement.addEventListener('touchstart', this.startDrag.bind(this))

        document.addEventListener('mouseup', this.stopDrag.bind(this))
        document.addEventListener('touchend', this.stopDrag.bind(this))

        document.addEventListener('mousemove', this.drag.bind(this))
        document.addEventListener('touchmove', this.drag.bind(this))
    }

    public setValue(value: number): void {
        const newOffsetX = map(value, this.minValue, this.maxValue, this.minSliderXOffset, this.maxSliderXOffset)
        this.currentValue = value
        this.knobElement.setAttribute('transform', `translate(${newOffsetX}, ${this.knobYOffset})`);
        this.lineElement.setAttribute('x2', `${newOffsetX}`)
    }

    private startDrag(event: MouseEvent | TouchEvent): void {
        event.preventDefault()
        this.sliderElement.classList.add('active')
    }

    private stopDrag(event: MouseEvent | TouchEvent): void {
        if (this.sliderElement.classList.contains('active')) {
            this.currentValue = this.calculateValueBasedOnEvent(event)
            this.sliderElement.dispatchEvent(this.changeEvent)
        }
        this.sliderElement.classList.remove('active')
    }

    private drag(event: MouseEvent | TouchEvent): void {
        if (this.sliderElement.classList.contains('active')) {            
            this.currentValue = this.calculateValueBasedOnEvent(event)
            this.sliderElement.dispatchEvent(this.changeEvent)
        }
    }

    private calculateValueBasedOnEvent(event: MouseEvent | TouchEvent): number {
        let clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
        clientX -= this.sliderElement.getBoundingClientRect().left
        return map(clientX, this.minSliderXOffset, this.maxSliderXOffset, this.minValue, this.maxValue)
    }
}