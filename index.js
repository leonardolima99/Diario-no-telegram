const Telegraf = require('telegraf')
const sheetdb = require('sheetdb-node')
/* const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup') */

require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? null : '.env'
})

const config = {
  address: process.env.ADDRESS,
  auth_login: process.env.BASIC_AUTH_LOGIN,
  auth_password: process.env.BASIC_AUTH_PASSWORD
}
const client = sheetdb(config)

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.on('text', ctx => {
  console.log(ctx.message.text, new Date(ctx.message.date).toLocaleString())

  client
    .create({
      id: ctx.message.message_id,
      sonho: ctx.message.text,
      data: new Date(ctx.message.date).toLocaleString()
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
