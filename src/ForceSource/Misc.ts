import {Path} from "../Core/Path";
import {Node} from "../Core/Node";

export function KillNodes(paths: Path[], shouldKill: (node: Node) => boolean): void {
    for (const path of paths) {

        const nodes = path.nodes

        let i = nodes.length
        while (i--) {
            if (nodes.length < 20)
                return

            const node = nodes[i]
            if (shouldKill(node)) {
                nodes.splice(i, 1)
            }
        }
    }
}
