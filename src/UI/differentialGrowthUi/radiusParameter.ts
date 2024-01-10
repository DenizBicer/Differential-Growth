import { map } from "../../Core/Math"

type Vector = {x: number, y: number}

export class RadiusParameter{
    currentValue: number = 0
    sliderElement: SVGElement

    private circleElement: SVGCircleElement

    private changeEvent: Event

    private minDisplayRadius: number // display radius
    private maxDisplayRadius: number

    private minValue: number // actual value
    private maxValue: number

    private center: Vector

    constructor(parentElement:HTMLElement, minValue:number, maxValue:number, 
                minDisplayRadius:number, maxDisplayRadius:number, 
                padding: number = 10) {
        this.minDisplayRadius = minDisplayRadius
        this.maxDisplayRadius = maxDisplayRadius
        
        this.minValue = minValue
        this.maxValue = maxValue

        const radiusParameterArea = document.createElement('div')
        radiusParameterArea.classList.add('radiusParameterArea')
        parentElement.appendChild(radiusParameterArea)
                    
        
        const width = maxDisplayRadius *2 + padding
        const height = maxDisplayRadius *2 + padding
        
        this.sliderElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg') 
        this.sliderElement.setAttribute('width', `${width}`)
        this.sliderElement.setAttribute('height', `${height}`)
        this.sliderElement.setAttribute('viewBox', `0 0 ${width} ${height}`)
        this.sliderElement.setAttribute('fill', 'none')
        this.sliderElement.setAttribute('stroke', 'none')
        radiusParameterArea.appendChild(this.sliderElement)
        
        this.center = {x: width/2, y: height/2}
        this.circleElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        this.circleElement.setAttribute('cx', `${this.center.x}`)
        this.circleElement.setAttribute('cy', `${this.center.y}`)
        this.circleElement.setAttribute('r', `${maxDisplayRadius}`)
        this.circleElement.setAttribute('fill', 'none')
        this.circleElement.setAttribute('stroke-linecap', 'round')
        this.circleElement.setAttribute('stroke', '#7747FF')
        this.circleElement.setAttribute('stroke-dasharray', '4 4')
        this.sliderElement.appendChild(this.circleElement)


        this.changeEvent = new Event('change')

        this.sliderElement.addEventListener('mousedown', this.startDrag.bind(this))
        this.sliderElement.addEventListener('touchstart', this.startDrag.bind(this))

        document.addEventListener('mouseup', this.stopDrag.bind(this))
        document.addEventListener('touchend', this.stopDrag.bind(this))

        document.addEventListener('mousemove', this.drag.bind(this))
        document.addEventListener('touchmove', this.drag.bind(this))
    }


    public setValue(value: number): void {
        const newRadius = map(value, this.minValue, this.maxValue, this.minDisplayRadius, this.maxDisplayRadius)
        this.currentValue = value
        this.circleElement.setAttribute('r', `${newRadius}`)
    }

    private startDrag(event: MouseEvent | TouchEvent): void {
        event.preventDefault()
        this.sliderElement.classList.add('active')
    }

    private stopDrag(event: MouseEvent | TouchEvent): void {
        if (this.sliderElement.classList.contains('active')) {
            this.currentValue = this.calculateValueBasedOnEvent(event)
            this.sliderElement.dispatchEvent(this.changeEvent)
            
            this.setValue(this.currentValue)
        }
        this.sliderElement.classList.remove('active')
    }

    private drag(event: MouseEvent | TouchEvent): void {
        if (this.sliderElement.classList.contains('active')) {            
            this.currentValue = this.calculateValueBasedOnEvent(event)
            this.sliderElement.dispatchEvent(this.changeEvent)

            this.setValue(this.currentValue)
        }
    }

    private calculateValueBasedOnEvent(event: MouseEvent | TouchEvent): number {
        
        // Get the clientX and clientY values from the event
        let clientX: number;
        let clientY: number;

        if ('touches' in event) {
            // TypeScript now knows that event is a TouchEvent
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        } else {
            // TypeScript now knows that event is a MouseEvent
            clientX = event.clientX;
            clientY = event.clientY;
        }
        // Adjust the clientX and clientY values based on the slider element's position
        let sliderRect = this.sliderElement.getBoundingClientRect();
        clientX -= sliderRect.left;
        clientY -= sliderRect.top;

        // Create a vector from the adjusted clientX and clientY values
        let clientVector = {x: clientX, y: clientY};

        // Calculate the distance from the client vector to the center
        const distance = this.distance(clientVector, this.center);
        return map(distance, this.minDisplayRadius, this.maxDisplayRadius, this.minValue, this.maxValue)
    }

    private distance(a: Vector, b: Vector): number {
        return Math.sqrt(Math.pow(a.x-b.x,2) + Math.pow(a.y-b.y,2))
    }
}