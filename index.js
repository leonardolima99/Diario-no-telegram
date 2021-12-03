const { Telegraf } = require('telegraf')
const sheetdb = require('sheetdb-node')

require('dotenv').config()

const config = {
  address: process.env.ADDRESS,
  auth_login: process.env.BASIC_AUTH_LOGIN,
  auth_password: process.env.BASIC_AUTH_PASSWORD
}
const client = sheetdb(config)

/* const PORT = process.env.PORT || 8443
const URL = process.env.URL || 'https://diario2-bot.herokuapp.com/' */

const bot = new Telegraf(process.env.BOT_TOKEN)

/* bot.use(Telegraf.log()) */

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

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
