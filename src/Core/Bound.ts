import p5 from "p5";
import { Path } from "./path";

export function CircularBoundPaths(paths: Path[], center: p5.Vector, radius: number) {
    paths.forEach(path => CircularBoundPath(path, center, radius))
}

function CircularBoundPath(path: Path, center: p5.Vector, radius: number) {
    path.nodes.forEach(node => {
        const distanceToCenter = p5.Vector.dist(center, node.point)
        const isNodeInsideBound = distanceToCenter <= radius
        node.isFixed = !isNodeInsideBound
    })
}