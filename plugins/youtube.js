require('dotenv').config()
const moment = require('moment')
const fs = require('fs')
const { google } = require('googleapis')
const emojiText = require('emoji-text')
const logger = require('../logger')

const service = google.youtube('v3')
const auth = new google.auth.GoogleAuth({
    keyFile: './youtube-auth.json',
    scopes: ['https://www.googleapis.com/auth/youtube.force-ssl'],
})

const init = () => {
    if (!fs.existsSync('files/youtube')) {
        fs.mkdirSync('files/youtube')
    }
}

const checkComments = async (nextPageToken, items) => {
    items = items || []
    const opt = {
        auth: auth,
        part: [
            "snippet,replies"
        ],
        videoId: process.env.YOUTUBE_VIDEO_ID,
        order: "time",
        maxResults: 1
    }
    if (nextPageToken) opt.pageToken = nextPageToken
    const result = await service.commentThreads.list(opt)

    if (result.data && result.data.items) logger.info('API request failed')

    const newItems = result.data.items.map(item => {
        const id = 'youtube/' + item.snippet.topLevelComment.id
        if (fs.existsSync('files/' + id)) return null
        const comment = item.snippet.topLevelComment.snippet

        const content = format(comment.authorDisplayName, comment.textDisplay)
        console.log(content)
        return {
            id,
            content
        }
    }).filter(item => item != null)

    if (result.data.nextPageToken && result.data.pageInfo.totalResults === newItems.length) {
        return await checkComments(result.data.nextPageToken, items.concat(newItems))
    }
    return items.concat(newItems)

}

const format = (username, text) => {
    const date = moment().format("MMM D YYYY, h:mmA");

    return emojiText.convert(`${username}\n${date}\n--------------------------\n${text}`)
}

module.exports = {
    init,
    checkComments
}