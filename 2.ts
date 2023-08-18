class Publisher<T> {
    data
    constructor(data: T[] = []) {
        this.data = data
    }
    push(item: T) {
        this.data.push(item)
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
            }
        }
    }
}

const join = (a: Publisher<string>, b: Publisher<string>) => {

}