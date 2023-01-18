import p5 from "p5"

export function angleToDir(angRad: number): p5.Vector {
    const vector = new p5.Vector()
    vector.x = Math.cos(angRad)
    vector.y = Math.sin(angRad)
    return vector
}