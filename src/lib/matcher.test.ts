import { test } from "node:test"
import assert from "node:assert/strict"
import { classificaViaggi, parsePreferenze, PREFERENZE_DEFAULT } from "./matcher"

const viaggio = (id: number, price: number, durationDay: number, adrenalineLevel: number, category = "Trekking") =>
    ({ id, title: `Viaggio ${id}`, price, durationDay, adrenalineLevel, category })

const viaggi = [
    viaggio(1, 2450, 14, 5),
    viaggio(2, 450, 3, 2, "Esperienziale"),
    viaggio(3, 1100, 6, 3, "Subacquea"),
    viaggio(4, 3200, 8, 4, "Water Sports"),
]

test("il viaggio identico alle preferenze ottiene 100%", () => {
    const [primo] = classificaViaggi(viaggi, { budget: 3000, giorni: 14, adrenalina: 5, categorie: ["Trekking"] })
    assert.ok(primo)
    assert.equal(primo.viaggio.id, 1)
    assert.equal(primo.match, 100)
})

test("budget basso e relax premiano il weekend economico", () => {
    const [primo] = classificaViaggi(viaggi, { budget: 500, giorni: 3, adrenalina: 1, categorie: [] })
    assert.ok(primo)
    assert.equal(primo.viaggio.id, 2)
})

test("i risultati sono ordinati e compresi tra 0 e 100", () => {
    const risultati = classificaViaggi(viaggi, PREFERENZE_DEFAULT)
    assert.equal(risultati.length, viaggi.length)
    risultati.forEach((r, i) => {
        assert.ok(r.match >= 0 && r.match <= 100)
        if (i > 0) assert.ok((risultati[i - 1]?.match ?? Infinity) >= r.match)
    })
})

test("lo sforamento del budget è spiegato tra i contro", () => {
    const risultati = classificaViaggi(viaggi, { budget: 1000, giorni: 8, adrenalina: 4, categorie: [] })
    const caro = risultati.find(r => r.viaggio.id === 4)
    assert.ok(caro)
    assert.ok(caro.contro.some(m => m.includes("2200 €")))
})

test("preferenze salvate corrotte o parziali tornano ai default campo per campo", () => {
    assert.deepEqual(parsePreferenze(null), PREFERENZE_DEFAULT)
    assert.deepEqual(parsePreferenze("ciao"), PREFERENZE_DEFAULT)
    assert.deepEqual(
        parsePreferenze({ budget: 900, giorni: "tanti", categorie: ["Surf", 3, null] }),
        { ...PREFERENZE_DEFAULT, budget: 900, categorie: ["Surf"] },
    )
})
