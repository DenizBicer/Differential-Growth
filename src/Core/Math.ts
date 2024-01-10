import p5 from "p5"

export function angleToDir(angRad: number): p5.Vector {
    const vector = new p5.Vector()
    vector.x = Math.cos(angRad)
    vector.y = Math.sin(angRad)
    return vector
}

export function getRandom(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

// https://gist.github.com/xposedbones/75ebaef3c10060a3ee3b246166caab56
export function clamp(input: number, min: number, max: number): number {
    return input < min ? min : input > max ? max : input;
}

// https://gist.github.com/xposedbones/75ebaef3c10060a3ee3b246166caab56
export function map(current: number, in_min: number, in_max: number, out_min: number, out_max: number): number {
    const mapped: number = ((current - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
    const actualMin = Math.min(out_min, out_max);
    const actualMax = Math.max(out_min, out_max);
    return clamp(mapped, actualMin, actualMax);
}