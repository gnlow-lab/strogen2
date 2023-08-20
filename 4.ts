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
    .otherwise(() => ({literal: "any"}))
}

console.log(calc({ref: "pat"})({def: ["pat", pat]}))