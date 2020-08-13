const fs = require('fs')

const error = (err) => {
    if (!fs.existsSync('error.log')) {
        fs.writeFileSync('error.log')
    }
    fs.appendFileSync('error.log', err.toString() + '\n');
}

const info = (data) => {
    if (!fs.existsSync('info.log')) {
        fs.writeFileSync('info.log')
    }
    fs.appendFileSync('info.log', data.toString() + '\n');
}

module.exports = {
    error,
    info
}