class Publisher<T> {
    data
    eventHandlers: ((item: T) => void)[]
    constructor(data: T[] = []) {
        this.data = data
        this.eventHandlers = []
    }
    push(...items: T[]) {
        items.forEach(
            item => {
                this.data.push(item)
                this.eventHandlers.forEach(handler => handler(item))
            }
        )
    }
    subscribe() {
        // deno-lint-ignore no-this-alias
        const that = this
        return {
            pointer: 0,
            pull() {
                return that.data[this.pointer++]
            },
            peak() {
                return that.data[this.pointer]
            },
            onPush(handler: (item: T) => void) {
                that.eventHandlers.push(handler)
            }
        }
    }
}

const join = (as: Publisher<string>, bs: Publisher<string>) => {
    const cs = new Publisher<string[]>()
    as.subscribe().onPush(a => cs.push(...bs.data.map(b => [a, b])))
    bs.subscribe().onPush(b => cs.push(...as.data.map(a => [a, b])))
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
pat.push