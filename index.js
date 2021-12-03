const Telegraf = require('telegraf')
const sheetdb = require('sheetdb-node')
const express = require('express')
const expressApp = express()

require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? null : '.env'
})

const port = process.env.PORT || 3000
expressApp.get('/', (req, res) => {
  res.send('Hello World!')
})
expressApp.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

const config = {
  address: process.env.ADDRESS,
  auth_login: process.env.BASIC_AUTH_LOGIN,
  auth_password: process.env.BASIC_AUTH_PASSWORD
}
const client = sheetdb(config)

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.on('text', ctx => {
  console.log(
    ctx.message.text,
    new Date(ctx.message.date * 1000).toLocaleString()
  )

  client
    .create({
      id: ctx.message.message_id,
      sonho: ctx.message.text,
      data: new Date(ctx.message.date * 1000).toLocaleString()
    })
    .then(
      function (res) {
        console.log(res)
      },
      function (err) {
        console.log(err)
      }
    )
})

bot.launch()
