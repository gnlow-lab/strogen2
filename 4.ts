type Expr =
    | {ref: string}
    | {literal: string}
    | {def: [string, Expr]}
    | {join: [Expr, Expr]}
    | {or: [Expr, Expr]}

const pat: Expr =
    {or: [
        {literal: "x"},
        {join: [
            {ref: "pat"},
            {literal: "a"},
        ]},
    ]}

import { match, P } from "npm:ts-pattern@5.0.5"

const calc = (query: Expr) => (expr: Expr): Expr => {
    return match(query)
    .with({ref: P.select()}, name =>
        match(expr)
        .with({def: [name, P.select()]}, value => {
            return value
        })
        .otherwise(() => ({literal: "any"}))
    )
    .with(P.select({literal: P.string}), x => x)
    .otherwise(q => q)
}

const expand = (query: Expr) => (expr: Expr): Expr[] => {
    return match(calc(query)(expr))
    .with({or: [P.select("a"), P.select("b")]}, ({a, b}) => {
        return [
            ...expand(a)(expr),
            ...expand(b)(expr),
        ]
    })
    .with({join: [P.select("a"), P.select("b")]}, ({a, b}) => {
        return []
    })
    .otherwise(x => [x])
}

console.log(expand({ref: "pat"})({def: ["pat", pat]}))

console.log(expand(
    {or: [
        {literal: "a"},
        {literal: "b"},
    ]}
)({literal: "any"}))