"use strict"

// runkit runtime
module.exports = (async () => {
// runkit runtime ENDS
// ------------------------


// get op-return values with blockcypher
//
// notes: fork https://runkit.com/makevoid/eternity-wall-json-opreturn


const http = require('axios')
const c    = console

const DEBUG = true // enables console.log
// const DEBUG = false


const url_base = "api.blockcypher.com/v1/btc/main"

// specify your address
//
const address  = "12RXhCqxnXgJyfJLL2mvcqT3jCQ2o6rMAR"

const endpoint_addr = `addrs/${address}`

const url_addr      = `https://${url_base}/${endpoint_addr}`


if (DEBUG) c.log(`URL: ${url_addr}`)
const resp = await http.get(url_addr)

if (DEBUG) c.log(resp.data)

// API returns only the first message - TODO FIXME api
let tx_hashes = resp.data.txrefs.map((tx) => {
    return tx.tx_hash
})

let txs = []

tx_hashes = new Set(tx_hashes)

await Promise.all(tx_hashes.forEach(async (tx_hash) => {
    c.log(`TX: ${tx_hash}`)

    let endpoint_tx = `tx/${address}`
    let url_tx      = `https://${url_base}/${endpoint_tx}`

    let resp_tx
    resp_tx = await http.get(url_tx)
    txs.push(resp_tx)
    // break
}))

// txs = txs.select((tx) => {
//     return tx
// }).map((tx) => {
//     return tx
// })

c.log("Transactions:\n", txs)


// other OP_RETURN

// http://api.coinsecrets.org/block/353197 - http://api.coinsecrets.org/block/NUMBER ( need to scan all the blocks from x to y - needs caching - background task - request limited - 1rps by api policy rules - use redis cache maybe?  )

// ------------------------
// runkit runtime
})
// runkit runtime ENDS
