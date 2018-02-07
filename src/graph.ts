export type Graph<K extends string> = { [key in K]: K[] }

export class NodesNotDefined<T extends string> extends Error {
    public data: {
        graph: Graph<T>
        nodes: T[]
    }
    constructor(graph: Graph<T>, nodes: T[]) {
        super('Nodes not defined')
        this.data = { graph, nodes }
    }
}

export class CyclesDetected<T extends string> extends Error {
    public data: { graph: Graph<T>; cycles: T[][] }

    constructor(graph: Graph<T>, cycles: T[][]) {
        super('Cycles detected')
        this.data = { graph, cycles }
    }
}

function getRoots<K extends string>(graph: Graph<K>): K[] {
    return Object.keys(graph) as K[]
}

function getLeaves<K extends string>(graph: Graph<K>): K[] {
    const values = Object.values(graph) as K[][]
    return values
        .reduce((a, b) => a.concat(b), [])
        .filter((a, i, arr) => arr.indexOf(a) === i)
}

function getCycles<K extends string>(graph: Graph<K>): K[][] {
    return getRoots(graph).reduce(
        (memo, key: K) => memo.concat(getCyclesOf(key, graph)),
        [] as K[][]
    )
}

function getCyclesOf<K extends string, A extends K>(
    id: A,
    graph: Graph<K>,
    stack: K[] = []
): K[][] {
    return stack.indexOf(id) > -1
        ? [stack.concat(id)]
        : graph[id].reduce(
              (memo: K[][], depId) =>
                  memo.concat(getCyclesOf(depId, graph, stack.concat(id))),
              []
          )
}

function getMissing<K extends string>(graph: Graph<K>): K[] {
    const roots = getRoots(graph)

    return getLeaves(graph)
        .reduce(
            (missing, node) =>
                roots.includes(node) ? missing : [...missing, node],
            [] as K[]
        )
        .filter((a, i, arr) => arr.indexOf(a) === i)
}

function assertNodesDefined<K extends string>(graph: Graph<K>): void {
    const missing = getMissing(graph)
    if (missing.length) throw new NodesNotDefined(graph, missing)
}

function assertNotAcyclic<K extends string>(graph: Graph<K>): void {
    const cycles = getCycles(graph)
    if (cycles.length) throw new CyclesDetected(graph, cycles)
}

export function validate<K extends string>(graph: Graph<K>): void {
    assertNodesDefined(graph)
    assertNotAcyclic(graph)
}
