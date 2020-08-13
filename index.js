const exec = require('command-exec')
const fs = require('fs')
const moment = require('moment')
const INTERVAL_SEC = 1

const writeFile = (path, content) => {
  fs.writeFileSync(path, content)
}
 
const print = async (path) => {
  const result = await exec(`lp -o cpi=14 -o lpi=7 -o page-top=0 ${path}`)
  console.log(result);
}

const format = (username, text) => {
  const date =  moment().format("ddd, MMM D YY, h:mmA");

  return `${username}\n\n${text}\n\n${date}\n\n\n`
}

const run = async () => {
  const content = format('David builds stuff', 'Hello\nnew\nline')
  const path = `files/1`
  writeFile(path, content)
  await print(path)
}

(async () => {
  // setInterval(async () => {
    await run()
  // }, INTERVAL_SEC*1000)
})()
