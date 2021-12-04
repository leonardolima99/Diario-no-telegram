const { Telegraf } = require('telegraf')
const sheetdb = require('sheetdb-node')
const express = require('express')

require('dotenv').config()

const config = {
  address: process.env.ADDRESS,
  auth_login: process.env.BASIC_AUTH_LOGIN,
  auth_password: process.env.BASIC_AUTH_PASSWORD
}
const client = sheetdb(config)

const PORT = process.env.PORT || 3000

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.on('text', ctx => {
  const dataDream = {
    id: ctx.message.message_id,
    sonho: ctx.message.text,
    data: new Date(ctx.message.date * 1000).toLocaleString('pt-BR', {
      timeZone: 'America/Campo_Grande'
    })
  }
  console.log(dataDream)

  client.create(dataDream).then(
    res => console.log(res),
    err => console.log(err)
  )
})

bot.on('edited_message', ctx => {
  if (!ctx.editedMessage.text) return console.log('Não é uma edição de texto.')
  console.log(ctx.editedMessage)

  client
    .update('id', ctx.editedMessage.message_id, {
      sonho: ctx.editedMessage.text
    })
    .then(
      res => console.log(res),
      err => console.log(err)
    )
})

bot.launch()

/* ------- Apenas para o Heroku ------- */
const app = express()
app.get('/', (req, res) => res.send('Hello World!'))

app.listen(PORT, () => {
  console.log(`Rodando na porta ${PORT}!\nSó pro servidor não reclamar...`)
})
/* ------------------------------------ */

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
