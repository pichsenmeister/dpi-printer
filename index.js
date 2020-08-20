const fs = require('fs')
const printer = require('./printer')
const logger = require('./logger')
const youtube = require('./plugins/youtube')
const INTERVAL_SEC = 5

const init = () => {
  if (!fs.existsSync('files')) {
    fs.mkdirSync('files')
  }
  youtube.init()
}

const run = async () => {
  const items = await youtube.checkComments()
  const promises = items.map(item => {
    return printer.print(item.id, item.content)
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
  }, INTERVAL_SEC*1000)
})()
