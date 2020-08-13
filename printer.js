const exec = require('command-exec')
const fs = require('fs')
const logger = require('./logger')

const writeFile = (path, content) => {
    fs.writeFileSync(path, content)
}

const print = async (id, content) => {
    const path = `files/${id}`
    writeFile(path, content)

    const result = await exec(`lp -o cpi=14 -o lpi=7 -o page-top=0 ${path}`)
    logger.info(result)
}

module.exports = {
    print
}

