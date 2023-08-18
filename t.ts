type Expr = Iterable<string> | symbol

const names: Record<string, Iterable<string>[]> = {
}

function* join(as: Expr, bs: Expr) {
    console.log("join")
    if (typeof as == "symbol") {
        as = [`<${as.description}>`]
    }
    if (typeof bs == "symbol") {
        bs = [`<${bs.description}>`]
    }
    for (const a of as)
        for (const b of bs)
            yield a + b
}
function* get(name: string) {
    console.log(name)
    for (const x of names[name]) {
        console.log("   ", x)
        //if (Array.isArray(x))
            yield* x as string[]
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

names.d = [
    [""],
    join(
        Symbol("d"),
        "c",
    ),
]

console.log(
    [...get("d")]
)