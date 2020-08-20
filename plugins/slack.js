require('dotenv').config()
const moment = require('moment')
const fs = require('fs')
const axios = require('axios')
const logger = require('../logger')

// axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.SLACK_TOKEN}`

const init = () => {
    if (!fs.existsSync('files/slack')) {
        fs.mkdirSync('files/slack')
    }
}

const run = async () => {
    const channels = await checkChannels()
    const messages = await Promise.all(channels.map(async channel => await checkMessages(channel)))
    return [].concat.apply([], messages)
}

const checkChannels = async () => {
    const result = await axios.get(`https://slack.com/api/users.conversations?token=${process.env.SLACK_TOKEN}&types=public_channel%2Cprivate_channel`)
    return result.data && result.data.channels.map(channel => channel.id) || []
}

const checkMessages = async (channel,) => {
    const oldest = (moment().unix() - 5)
    const url = `https://slack.com/api/conversations.history?token=${process.env.SLACK_TOKEN}&channel=${channel}&oldest=${oldest}`

    const result = await axios.get(url)

    const items = await Promise.all(result.data.messages.map(async item => {
        if (!item.user) return null
        const id = 'slack/' + channel + '_' + item.ts
        if (fs.existsSync('files/' + id)) return null

        const user = await axios.get(`https://slack.com/api/users.info?token=${process.env.SLACK_TOKEN}&user=${item.user}`)
        const username = user.data.user.profile.display_name || user.data.user.profile.real_name

        const content = format(username, item.text)
        return {
            id,
            content
        }
    }))

    return items.filter(item => item != null)
}

const format = (username, text) => {
    const date = moment().format("MMM D YYYY, h:mmA");

    return `${username}\n${date}\n--------------------------\n${text}`
}

module.exports = {
    init,
    run
}