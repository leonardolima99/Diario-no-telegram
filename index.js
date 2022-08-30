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

const USER_ID = process.env.USER_ID

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.command('editDate', ctx => {
  if (ctx.message.from.id != USER_ID) {
    ctx.reply('Você não é o usuário deste bot.\nPor favor, pare de tentar usá-lo.')
    return 0
  }
  
  const [, day, month, hour, minutes, ...text] = ctx.message.text.split(' ')
  const newDate = new Date()
  const date = new Date(
    `${month}-${day}-${newDate.getFullYear()} ${hour}:${minutes}`
  )

  /* date.setMinutes(date.getMinutes + ) */

  if (date instanceof Date && isNaN(date)) {
    ctx.reply(
      'Data inválida, siga este modelo:\n/editDate dia mes hora minutos<espaço>\nTexto'
    )
    return 0
  }

  const dataDream = {
    id: ctx.message.message_id,
    sonho: text.join(' '),
    data: date.toLocaleString()
  }

  client.create(dataDream).then(
    res => ctx.reply('Sonho com data editada registrado.'),
    err => console.log(err)
  )
})
bot.on('message', ctx => {
  if (ctx.message.from.id != USER_ID) {
    ctx.reply('Você não é o usuário deste bot.\nPor favor, pare de tentar usá-lo.')
    return 0
  }

  const date = new Date(ctx.message.date * 1000).toLocaleString()

  const dataDream = {
    id: ctx.message.message_id,
    sonho: ctx.message.text,
    data: date
  }

  console.log('User: ' + ctx.message.from.id)
  console.log('Date: ' + date, typeof date)
  client.create(dataDream).then(
    res => console.log(res),
    err => console.log(err)
  )
})

bot.on('edited_message', ctx => {
  if (ctx.message.from.id != USER_ID) {
    ctx.reply('Você não é o usuário deste bot.\nPor favor, pare de tentar usá-lo.')
    return 0
  }
  
  if (!ctx.editedMessage.text) return

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
