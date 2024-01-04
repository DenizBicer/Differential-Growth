import './playButton.css'

export type PlayEvents = {
    updatePlay: (play: boolean) => void,
    updateDebug: (debug: boolean) => void,
    nextFrame: () => void,
    restart: () => void,
    clear: () => void
}

export type PlayEnum = 'not-playing' | 'not-playing-paused' | 'playing' | 'paused'

export class PlayControlsUi {
    events: PlayEvents
    isDebugging: boolean
    playingState: PlayEnum

    isSimulationStarted: boolean
    isPaused: boolean

    playButton: HTMLElement
    pauseButton: HTMLElement
    nextFrameButton: HTMLElement

    constructor(element: HTMLElement, e: PlayEvents, isDebugging: boolean, isPlaying: boolean) {
        this.events = e
        this.isDebugging = isDebugging
        this.playingState = isPlaying ? 'playing' : 'not-playing'
        this.isSimulationStarted = isPlaying
        this.isPaused = false

        const parentElement = element.parentElement
        const groupElement = this.createGroup(['playControlsGroup'])
        parentElement?.before(groupElement)

        this.playButton = this.createButton('play', ['playButton'], groupElement, this.play.bind(this))
        this.pauseButton = this.createButton('pause', ['playButton'], groupElement, this.pause.bind(this))
        this.nextFrameButton = this.createButton('next-frame', ['playButton'], groupElement, this.events.nextFrame)

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
        //    this.setElementActive(this.playButton, !this.isPlaying)
        //    this.setElementActive(this.pauseButton, this.isPlaying)
        //    this.setElementActive(this.nextFrameButton, !this.isPlaying)

        const isPlayButtonActive = this.isSimulationStarted
        const isPauseButtonActive = this.isPaused
        const isNextFrameButtonEnabled = this.isSimulationStarted && this.isPaused

        this.setElementActive(this.playButton, isPlayButtonActive)
        this.setElementActive(this.pauseButton, isPauseButtonActive)
        this.setElementEnabled(this.nextFrameButton, isNextFrameButtonEnabled)
    }

    setElementActive(element: HTMLElement, isActive: boolean) {
        this.setElementClassNameFlag(element, isActive, 'active', 'inactive')
    }

    setElementEnabled(element: HTMLElement, isEnabled: boolean) {
        this.setElementClassNameFlag(element, isEnabled, 'enabled', 'disabled')
    }

    setElementClassNameFlag(element: HTMLElement, flag: boolean, trueClassName: string, falseClassName: string) {
        if (flag) {
            this.exchangeClassNames(element, trueClassName, falseClassName)
        }
        else {
            this.exchangeClassNames(element, falseClassName, trueClassName)
        }
    }

    exchangeClassNames(element: HTMLElement, newClassName: string, oldClassName: string) {
        element.classList.add(newClassName)
        element.classList.remove(oldClassName)
    }
}