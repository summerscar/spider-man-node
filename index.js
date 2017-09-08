const http = require('http')
const fs = require('fs')
const cheerio = require('cheerio')
const request = require('request') 
const moment = require('moment')
const arguments = process.argv.splice(2);

const url = 'http://www.cilikankan.net/fengmian/'
let textData = '车牌,热度,日期,图片链接,下载链接'

getImage(arguments[0] || 1);

function getImage (i) {
    request(`${url}index_${i}.html`, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(body)
            const items = $('.item ')
           
            for (let i = 0; i < items.length; i++) {
    
                let title = items[i].children[1].children[1].children[1].attribs.title
                let targetSrc = items[i].children[1].attribs.href
                let src = items[i].children[1].children[1].children[1].attribs.src
                let date = items[i].children[1].children[3].children[1].children[3].children[0].data
                let heat = items[i].children[1].children[3].children[1].children[6].children[0].data.substr(3)
                textData += `\r\n${title},${parseInt(heat)},${date},${src},${targetSrc}` 
                let imgName = `./images/${heat} ${title}.jpg`
                request(src).pipe(fs.createWriteStream(imgName))
            }
        }
        fs.writeFile(`./开车时间：${moment().format('MM-DD')} page：${arguments[0]}.csv`, textData, (err) => {
            if(err) {
                return console.log(err);
            }
            console.log("写入完成。");
        })
    })
}