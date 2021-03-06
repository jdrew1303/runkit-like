"use strict"

// to run this file (with node):
//
//
// ./build && node lib/op_return_login.js
//
//
// // (node build script) - babelify with es7 (es2017) plugin
// -----------------------------------------------------------


// config:

// const ADDRESS = "1GFu2xW6LomCfLWBr3za1yzHYLTr3ntxJJ"

// const ADDRESS = "1L87KdcbuS2yy3LW3A4K87Pq8D8LUtmv4V"

const ADDRESS = "1M97nyNGSDA9ijSGwCTfoiPMKUUSVV8Vmc"

// address - 1GFu2xW6LomCfLWBr3za1yzHYLTr3ntxJJ (note: ff-osx)


// ---------


// pseudo code


// TOKEN = "abcdef"

// --> for tx in address.txs
//
// --> for op_return in txs.op_returns
//
// --> do_something! if op_return =~ /antani/
//
//
// --> login! if op_return == "EW token 0x#{TOKEN}"



// ---------



// get op-return values with blockcypher
//
// notes: fork https://runkit.com/makevoid/eternity-wall-json-opreturn

const http = require('axios')
const fs   = require('fs')
const c    = console

// const DEBUG = true // enables console.log - checks only 1 transaction (disables loop)
const DEBUG = false


const url_base = "api.blockcypher.com/v1/btc/main"

// your address
//
const address       = ADDRESS

const endpoint_addr = `addrs/${address}`

const url_addr      = `https://${url_base}/${endpoint_addr}`;



// uncomment this block to run in node
//
(async function() { // TODO: try with this, it should work: (async () => {

  // this block can run in runkit without the async function

  if (DEBUG) c.log(`URL: ${url_addr}`)
  const resp = await http.get(url_addr)

  if (DEBUG) c.log(resp.data)

  let txrefs    = resp.data.txrefs || []
  let txrefs_un = resp.data.unconfirmed_txrefs || [] // you can pull out the unconfirmed transactions by commenting this blocks
  txrefs = txrefs.concat(txrefs_un)

  // API returns only the first message - TODO FIXME api
  let tx_hashes = txrefs.map((tx) => {
    return tx.tx_hash
  })

  let txs = []

  tx_hashes = new Set(tx_hashes)
  tx_hashes = Array.from(tx_hashes)


  //// alt:
  //
  // await Promise.all(tx_hashes.forEach((tx_hash) => {
  //
  let idx = 0
  for (let tx_hash of tx_hashes) {
      if (DEBUG) c.log(`TX: ${tx_hash}`)

      let endpoint_tx = `txs/${tx_hash}`
      let url_tx      = `https://${url_base}/${endpoint_tx}`

      if (DEBUG) c.log(`URL: ${url_tx}`)

      let resp_tx = await http.get(url_tx)
      txs.push(resp_tx.data)
      if (DEBUG && idx > 2) break
      idx++
  }

  let tx_outs = []

  // get outputs ( + log out debug messages tx:, outputs: )
  //
  txs.forEach((tx) => {
    if (DEBUG) c.log(`tx: ${JSON.stringify(tx)}`)
    let outputs = tx.outputs
    if (DEBUG) c.log(`outputs: ${JSON.stringify(tx.outputs)}`)
    // tx_outs.concat(outputs)
    outputs.forEach((output) => {
        tx_outs.push(output)
    })
  })

  // take only op return outputs - map directly decoded op_return values
  //
  let op_returns = tx_outs.filter((output) => {
    return output.script_type == "null-data"
  }).map((output) => {
    if (DEBUG) c.log(`output: ${JSON.stringify(output)}`)
    return output.data_string
  })

  // additional debug
  //
  if (DEBUG) {
    c.log("OP_RETURNS:\n", op_returns)
    c.log(JSON.stringify(op_returns))
  }


  // const SHOW_OPRS = true
  const SHOW_OPRS = false


  // this comments are way to add caching to the requests above
  //
  // first option - local require
  // let blockcypher_op_returns = require("./blockcypher-opreturn")
  // let blockcypher_op_returns = fs.readFileSync("./op_returns.json").toString()
  // blockcypher_op_returns = JSON.parse(blockcypher_op_returns)
  // blockcypher_op_returns = blockcypher_op_returns.op_returns

  
  // let opReturns = blockcypher_op_returns
  //
  let opReturns = op_returns

  const cleanOpReturn = (opRet) => {
      return opRet && opRet.replace(/&#34;/g, '\"') // .substring(3)
  }

  if (SHOW_OPRS) c.log("OP_RETURNS:", opReturns, "---")

  // module.exports = opReturns
  //
  // callback(opReturns)
  
  
  // if you call runkit-like-module.js
  //
  c.log(opReturns)
  
  
  // code for running this module/script in runkit (runkit.com / runkit.io)
// ----------------------------------
  //
  // return opReturns
  //
// }
//
// module.exports = main
//
// true
//
// let ret = await main()
// c.log(ret)




}());
