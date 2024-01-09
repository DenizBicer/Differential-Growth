import { map } from "../../Core/Math";

export class Slider {
    sliderElement: SVGElement;
    private lineElement: SVGLineElement
    private knobElement: SVGCircleElement
    private changeEvent: Event;

    minSliderXOffset = 3.5
    maxSliderXOffset = 70

    minValue: number
    maxValue: number

    currentValue: number = 0
    
    constructor(parentElement: HTMLElement, label: string, minValue: number, maxValue: number) {
        this.minValue = minValue
        this.maxValue = maxValue

        const sliderArea = document.createElement('div')
        sliderArea.classList.add('sliderArea')

        const sliderLabel = document.createElement('div')
        sliderLabel.classList.add('sliderLabel')
        sliderLabel.innerText = label
        sliderArea.appendChild(sliderLabel)

        this.sliderElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg') as SVGSVGElement
        this.sliderElement.setAttribute('width', '100')
        this.sliderElement.setAttribute('height', '8')
        this.sliderElement.setAttribute('viewBox', '0 0 100 8')
        this.sliderElement.setAttribute('fill', '#7747FF')
        this.sliderElement.setAttribute('stroke', '#9B9B9B')

        this.lineElement = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        this.lineElement.setAttribute('x1', '2')
        this.lineElement.setAttribute('y1', '4')
        this.lineElement.setAttribute('x2', '70')
        this.lineElement.setAttribute('y2', '4')
        this.lineElement.setAttribute('stroke-width', '3')
        this.sliderElement.appendChild(this.lineElement)

        const anchorCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        anchorCircle.setAttribute('cx', '3.5')
        anchorCircle.setAttribute('cy', '4')
        anchorCircle.setAttribute('r', '3.5')
        anchorCircle.setAttribute('fill', 'black')
        this.sliderElement.appendChild(anchorCircle)

        this.knobElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        this.knobElement.setAttribute('cx', '0')
        this.knobElement.setAttribute('cy', '4')
        this.knobElement.setAttribute('r', '3.5')
        this.sliderElement.appendChild(this.knobElement)

        sliderArea.appendChild(this.sliderElement)

        parentElement.appendChild(sliderArea)


        this.changeEvent = new Event('change');

        this.sliderElement.addEventListener('mousedown', this.startDrag.bind(this));
        this.sliderElement.addEventListener('touchstart', this.startDrag.bind(this));

        document.addEventListener('mouseup', this.stopDrag.bind(this));
        document.addEventListener('touchend', this.stopDrag.bind(this));

        document.addEventListener('mousemove', this.drag.bind(this));
        document.addEventListener('touchmove', this.drag.bind(this));
    }

    public setValue(value: number): void {
        const newOffsetX = map(value, this.minValue, this.maxValue, this.minSliderXOffset, this.maxSliderXOffset)
        this.currentValue = value
        this.knobElement.setAttribute('cx', `${newOffsetX}`)
        this.lineElement.setAttribute('x2', `${newOffsetX}`)
    }

    private startDrag(event: MouseEvent | TouchEvent): void {
        event.preventDefault();
        this.sliderElement.classList.add('active');
    }

    private stopDrag(event: MouseEvent | TouchEvent): void {
        if (this.sliderElement.classList.contains('active')) {
            this.currentValue = this.calculateValueBasedOnEvent(event);
            this.sliderElement.dispatchEvent(this.changeEvent);
        }
        this.sliderElement.classList.remove('active');
    }

    private drag(event: MouseEvent | TouchEvent): void {
        if (this.sliderElement.classList.contains('active')) {            
            this.currentValue = this.calculateValueBasedOnEvent(event);
            this.sliderElement.dispatchEvent(this.changeEvent);
        }
    }

    private calculateValueBasedOnEvent(event: MouseEvent | TouchEvent): number {
        let clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
        clientX -= this.sliderElement.getBoundingClientRect().left;
        return map(clientX, this.minSliderXOffset, this.maxSliderXOffset, this.minValue, this.maxValue);
    }
}