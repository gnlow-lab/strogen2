class LazyArray<T> {
    memory: T[] = []
    iterator
    constructor(iterable: Iterable<T>) {
        this.iterator = iterable[Symbol.iterator]()
    }
    at(index: number) {
        for (
            let i = this.memory.length;
            i <= index;
            i++
        ) {
            this.memory[index] = this.iterator.next().value
        }
        return this.memory[index]
    }
}

/** Inverse of Cantor Pairing Function */
const pairing = (z: number) => {
    const w = Math.floor((Math.sqrt(8 * z + 1) - 1) / 2)
    const t = w*(w+1) / 2
    const y = z - t
    const x = w - y
    return {x, y}
}

function* join(a: LazyArray<string>, b: LazyArray<string>) {
    let i = 0
    while (true) {
        // console.log(pairing(i), a.at(pairing(i).x) + b.at(pairing(i).y))
        if (a.at(pairing(i).x) && b.at(pairing(i).y))
            yield a.at(pairing(i).x) + b.at(pairing(i).y)
        else yield undefined
        i++
    }
}

import { $ } from "https://deno.land/x/iteruyo@v0.3.0/mod.ts"

console.log(
    $(join(
        new LazyArray(["a", "b", "c"]),
        new LazyArray(["x", "y", "z"]),
    )).take(13).toArray()
)