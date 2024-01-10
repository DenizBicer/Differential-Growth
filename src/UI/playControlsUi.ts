import './playControlsUi.css'

export type PlayEvents = {
    updatePlay: (play: boolean) => void,
    nextFrame: () => void,
    restart: () => void,
    clear: () => void
}

export class PlayControlsUi {
    events: PlayEvents

    isSimulationStarted: boolean
    isPaused: boolean

    element: HTMLElement

    playButton: HTMLElement
    pauseButton: HTMLElement
    nextFrameButton: HTMLElement

    constructor(e: PlayEvents, isPlaying: boolean) {
        this.events = e
        this.isSimulationStarted = isPlaying
        this.isPaused = false

        this.element = this.createGroup(['playControlsGroup'])

        this.playButton = this.createButton('play', ['playButton'], this.element, this.play.bind(this))
        this.pauseButton = this.createButton('pause', ['playButton'], this.element, this.pause.bind(this))
        this.nextFrameButton = this.createButton('next-frame', ['playButton'], this.element, this.events.nextFrame)

        this.updateButtons()
    }


    createGroup(classNames: string[]): HTMLElement {
        const group = document.createElement('div')
        classNames.forEach(className => group.classList.add(className))
        return group
    }

    createButton(iconClassName: string, classNames: string[], parentElement: HTMLElement | null, listener: (this: HTMLDivElement, ev: MouseEvent) => any): HTMLElement {
        const button = document.createElement('div')
        button.innerHTML = `<i class=${iconClassName}></i>`
        classNames.forEach(className => button.classList.add(className))
        button.addEventListener('click', listener)
        parentElement?.appendChild(button)
        return button
    }

    play() {
        if (this.isSimulationStarted) {
            this.events.clear()
        }
        else {
            this.events.restart()
        }

        this.isSimulationStarted = !this.isSimulationStarted;

        this.updatePlayState()
    }

    pause() {
        this.isPaused = !this.isPaused
        this.updatePlayState()
    }

    updatePlayState() {
        const isPlaying = this.isSimulationStarted && !this.isPaused
        this.events.updatePlay(isPlaying)
        this.updateButtons()
    }

    updateButtons() {
        const isPlayButtonActive = this.isSimulationStarted
        const isPauseButtonActive = this.isPaused
        const isNextFrameButtonEnabled = this.isSimulationStarted && this.isPaused

        this.setElementActive(this.playButton, isPlayButtonActive)
        this.setElementActive(this.pauseButton, isPauseButtonActive)
        this.setElementEnabled(this.nextFrameButton, isNextFrameButtonEnabled)
    }

    setElementActive(element: HTMLElement, isActive: boolean) {
        element.classList.toggle('active', isActive)
        element.classList.toggle('inactive', !isActive)
    }

    setElementEnabled(element: HTMLElement, isEnabled: boolean) {
        element.classList.toggle('enabled', isEnabled)
        element.classList.toggle('disabled', !isEnabled)
    }

    
}