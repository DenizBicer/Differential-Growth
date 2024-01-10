import { map } from "../../Core/Math"

type Vector = {x: number, y: number}

type ReferencePointPlacement = {
    percentage: number,
    angle: number
}

type ReferencePoint = {
    point: Vector,
    arrow: Arrow,
    placement: ReferencePointPlacement
}

type Arrow = {
    lineElement: SVGLineElement,
    arrowElement: SVGPathElement    
}


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

    private readonly referencePointPlacements: ReferencePointPlacement[] = 
        [{percentage: 0.25, angle: 20}, {percentage: 0.5, angle: 160}, {percentage: 0.75, angle: 280}]

    private referencePoints: ReferencePoint[] = []

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

        const anchorCircle = this.createNode(this.center, 3.5)
        this.sliderElement.appendChild(anchorCircle)

        this.createReferencePoints(this.center)


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

    private createReferencePoints(center: Vector): void {
        this.referencePointPlacements.forEach(placement => {
            const point = this.calculatePoint(center, placement)
            const node = this.createNode(point, 3.5)
            const arrow = this.createArrow(point, 15, this.direction(center, point))

            this.sliderElement.appendChild(arrow.lineElement)
            this.sliderElement.appendChild(arrow.arrowElement)
            this.sliderElement.appendChild(node)
            this.referencePoints.push({point, arrow, placement})
        })
    }

    private calculatePoint(center: Vector, placement: ReferencePointPlacement): Vector {
        const angle = placement.angle
        const radius = this.maxDisplayRadius * placement.percentage
        const x = center.x + radius * Math.cos(angle * Math.PI / 180)
        const y = center.y + radius * Math.sin(angle * Math.PI / 180)
        return {x, y}
    }

    private createNode(point:Vector, radius:number)
    {
        const node = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        node.setAttribute('cx', `${point.x}`)
        node.setAttribute('cy', `${point.y}`)
        node.setAttribute('r', `${radius}`)
        node.setAttribute('fill', 'black')
        return node
    }
    
    private createArrow(point: Vector, length: number, direction:Vector): Arrow {

        const endPoint = this.add(point, this.multiply(direction, length))
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        line.setAttribute('x1', `${point.x}`)
        line.setAttribute('y1', `${point.y}`)
        line.setAttribute('x2', `${endPoint.x}`)
        line.setAttribute('y2', `${endPoint.y}`)
        line.setAttribute('stroke-width', '3')
        line.setAttribute('stroke', '#9B9B9B')

        const rightDirection = this.perpendicular(direction, true)
        const leftDirection = this.perpendicular(direction, false)
       
        const arrowSize = 7
        const arrowTip = this.add(endPoint, this.multiply(direction, arrowSize))
        const arrowRight = this.add(endPoint, this.multiply(rightDirection, arrowSize/2))
        const arrowLeft = this.add(endPoint, this.multiply(leftDirection, arrowSize/2))

        const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        arrow.setAttribute('d', `M${arrowTip.x} ${arrowTip.y}L${arrowRight.x} ${arrowRight.y}L${arrowLeft.x} ${arrowLeft.y} L${arrowTip.x} ${arrowTip.y}Z`)
        arrow.setAttribute('fill', '#9B9B9B')

        return {
            lineElement: line,
            arrowElement: arrow
        }
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

    private direction(a: Vector, b: Vector): Vector {
        return this.normalize ({x: b.x-a.x, y: b.y-a.y})
    }

    private normalize(vector: Vector): Vector {
        return {x: vector.x / this.distance({x:0, y:0}, vector), y: vector.y / this.distance({x:0, y:0}, vector)}    
    }

    private add(a: Vector, b: Vector): Vector {
        return {x: a.x + b.x, y: a.y + b.y}
    }

    private multiply(a: Vector, b: number): Vector {
        return {x: a.x * b, y: a.y * b}
    }

    private perpendicular(vector: Vector, clockWise: boolean): Vector {
        if (clockWise)
            return { x: vector.y, y: -vector.x }
        else
            return { x: -vector.y, y: vector.x }
    }
}