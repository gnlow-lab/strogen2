type Expr =
    | {op: string, a: Expr}
    | {op: string, a: Expr, b: Expr}
    | string

const monoOp =
    (op: string) =>
    (a: Expr) =>
    ({op, a})

const ref = monoOp("ref")

const binOp =
    (op: string) =>
    (a: Expr, b: Expr) =>
    ({op, a, b})

const def = binOp("def")
const or = binOp("or")
const join = binOp("join")

const pat = 
    or(
        "x",
        join(
            ref("pat"),
            "a"
        )
    )

import { match, P } from "npm:ts-pattern@5.0.5"

const calc = (query: Expr) => (expr: Expr) => {
    match(query)
    .with({op: "ref", a: P.select(P.string)}, name => {
        match(expr)
        .with({op: "def", a: name, b: P.select(P.not(P.nullish))}, value => {
            return value
        })
    })
}

calc(ref("pat"))(def("pat", pat))