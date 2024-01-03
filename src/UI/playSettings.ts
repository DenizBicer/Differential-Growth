import './playButton.css'

export type PlayEvents = {
    updatePlay: (play: boolean) => void,
    updateDebug: (debug: boolean) => void,
    nextFrame: () => void,
    restart: () => void
}

export class PlaySettingsUi {
    events: PlayEvents
    isDebugging: boolean
    isPlaying: boolean

    restartButton: HTMLElement
    playButton: HTMLElement
    pauseButton: HTMLElement
    nextFrameButton: HTMLElement

    constructor(element: HTMLElement, e: PlayEvents, isDebugging: boolean, isPlaying: boolean) {
        this.events = e
        this.isDebugging = isDebugging
        this.isPlaying = isPlaying

        const parentElement = element.parentElement

        this.restartButton = this.createButton('restart', ['playButton', 'seperator'], parentElement, this.events.restart)
        this.playButton = this.createButton('play', ['playButton'], parentElement, this.play.bind(this))
        this.pauseButton = this.createButton('pause', ['playButton'], parentElement, this.pause.bind(this))
        this.nextFrameButton = this.createButton('next-frame', ['playButton'], parentElement, this.events.nextFrame)

        this.updateButtons()
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
        this.isPlaying = true
        this.events.updatePlay(this.isPlaying)
        this.updateButtons()
    }

    pause() {
        this.isPlaying = false
        this.events.updatePlay(this.isPlaying)
        this.updateButtons()
    }

    updateButtons() {
       this.setElementActive(this.playButton, !this.isPlaying)
       this.setElementActive(this.pauseButton, this.isPlaying)
       this.setElementActive(this.nextFrameButton, !this.isPlaying)
    }

    setElementActive(element: HTMLElement, isActive: boolean) {
        if(isActive)
        {
            element.classList.add('active')
            element.classList.remove('inactive')
        }
        else
        {
            element.classList.add('inactive')
            element.classList.remove('active')
        }
    }


}