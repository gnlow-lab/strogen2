type EventHandler<T> = (item: T) => Promise<void>

const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

class Publisher<T> {
    data
    eventHandlers: EventHandler<T>[]
    constructor(data: T[] = []) {
        this.data = data
        this.eventHandlers = []
    }
    async push(...items: T[]) {
        //console.log(items)
        await delay(2)
        for (const item of items) {
            this.data.push(item)
            await Promise.all(this.eventHandlers.map(handler => handler(item)))
        }
    }
    onPush(handler: EventHandler<T>) {
        this.eventHandlers.push(handler)
    }
    concat(p: Publisher<T>) {
        p.onPush(item => this.push(item))
    }
    map<O>(f: (item: T) => O) {
        const p = new Publisher<O>()
        this.onPush(item => p.push(f(item)))
        return p
    }
}

const join = (as: Publisher<string>, bs: Publisher<string>) => {
    const cs = new Publisher<string[]>()
    as.onPush(a => cs.push(...bs.data.map(b => [a, b])))
    bs.onPush(b => cs.push(...as.data.map(a => [a, b])))
    return cs
}

const as = new Publisher<string>()
const bs = new Publisher<string>()
const cs = join(as, bs)

as.push("a", "b")
bs.push("x", "y")
console.log(cs.data)

let pat = new Publisher<string>()
const aa = new Publisher<string>()
aa.push("a")
pat.concat(join(pat, aa).map(([a, b]) => a + b))

pat.onPush(async s => console.log(s))
pat.push("x")

