import { $ } from "https://deno.land/x/iteruyo@v0.3.0/mod.ts"

const names: Record<string, Iterable<string>[]> = {
}

function* join(as: Iterable<string>, bs: Iterable<string>) {
    console.log("join")
    for (const a of as)
        for (const b of bs)
            yield a + b
}
function* get(name: string) {
    console.log(name)
    for (const x of names[name]) {
        console.log("   ", x)
        yield* x
    }
}

names.pattern = [
    [""],
    join(
        get("pattern"),
        [
            "x",
            "-",
        ]
    ),
    join(
        join(
            ["("],
            get("pattern"),
        ),
        [")"],
    ),
]

names.d = [join(
        ["c", "d"],
        get("d"),
)]

console.log(
    ...names.d[0]
)