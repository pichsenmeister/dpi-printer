const fs = require('fs')
const printer = require('./printer')
const logger = require('./logger')
const youtube = require('./plugins/youtube')
const slack = require('./plugins/slack')
const { timeStamp } = require('console')
const INTERVAL_SEC = 5

const init = () => {
  if (!fs.existsSync('files')) {
    fs.mkdirSync('files')
  }
  youtube.init()
  slack.init()
}

const run = async () => {
  const itemsYT = await youtube.run()
  const itemsSlack = await slack.run()

  const items = []
  items.push(...itemsYT)
  items.push(...itemsSlack)

  const promises = items.map(item => {
    if (process.env.PRINT)
      return printer.print(item.id, item.content)
    else
      console.log(`printing ${item.id}\n`, item.content)
  })
  return await Promise.all(promises)
}

(async () => {
  init()
  setInterval(async () => {
    try {
      await run()
    } catch (err) {
      logger.error(err)
    }
  }, INTERVAL_SEC * 1000)
})()
