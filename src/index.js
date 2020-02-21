process.env.NTBA_FIX_319 = 1;
const TelegramBot = require('node-telegram-bot-api')
const mongoose = require('mongoose')
const config = require('./config')
const helper = require('./helper')
const keyboard = require('./keyboard')
const kb = require('./keyboard-buttons')
const database = require('../dataBase')
helper.logStart()
mongoose.connect(config.DB_URL, {
    useUnifiedTopology: true, useNewUrlParser: true
})
    .then(() => console.log('Mongo Db Conected'))
    .catch((err) => console.log(err))
require('./model/shop.model');
require('./model/user.model');
require('./model/contact.model')
const Jobs = mongoose.model('Jobs')
const User = mongoose.model('users')
const contact = mongoose.model('contact')
//database.jobs.forEach(f => new Jobs(f).save())
//database.contact.forEach(c => new contact(c).save())

const ACTION_TYPE = {
    TOGGLE_FAV_JOBS: 'tff',
    SHOW_JOBS: 'sf',
    SHOW_CONTACT: 'cff'
}

const bot = new TelegramBot(config.TOKEN, {polling: true})



bot.on('message', msg => {
    console.log('Working', msg.from.first_name)
    const chatId = helper.getChatId(msg)

    switch (msg.text) {
        case kb.favourite.order:
            showFavouriteJobs(chatId, msg.from.id)
            break
        case kb.home.Orders:
            showFavouriteJobs(chatId, msg.from.id)


            break
        case kb.home.we:
            bot.sendMessage(msg.chat.id, 'Более 10 лет на рынке и более 250 крупных объектов выполнено нами. А так же соттни довольных клиентов.\n 📱 +380933608838б 📱0967500903б, 📱 0978486926'),
                bot.sendMediaGroup(msg.chat.id, [
                    {
                        type: "photo",
                        media:
                            "http://eurohelpinc.club/wp-content/uploads/2020/02/main.jpg",
                        caption: "Наши работы"
                    },
                    {
                        type: "photo",
                        media:
                            "http://eurohelpinc.club/wp-content/uploads/2020/02/20191206_133501-2-scaled.jpg",
                    },
                    {
                        type: "photo",
                        media:
                            "http://eurohelpinc.club/wp-content/uploads/2020/02/main1.jpg",
                    }

                ]

                );

            break
        case kb.home.favourite:
            bot.sendMessage(msg.chat.id, 'Что именно Вас интересует?', {
                reply_markup: {keyboard: keyboard.favourite}
            })
            break

        case kb.home.shop:
            bot.sendMessage(msg.chat.id, 'Что именно Вас интересует?', {
                reply_markup: {keyboard: keyboard.shop}
            })
            break
        case kb.home.our:
            bot.sendMessage(msg.chat.id, 'наши работы', {reply_markup: {keyboard: keyboard.home}}),
                bot.sendMediaGroup(msg.chat.id, [
                        {
                            type: "photo",
                            media:
                                "http://eurohelpinc.club/wp-content/uploads/2020/02/main.jpg",
                            caption: "Наши работы"
                        },
                        {
                            type: "photo",
                            media:
                                "http://eurohelpinc.club/wp-content/uploads/2020/02/20191206_133501-2-scaled.jpg",
                        },
                        {
                            type: "photo",
                            media:
                                "http://eurohelpinc.club/wp-content/uploads/2020/02/main1.jpg",
                        }

                    ]

                );

            break
        case kb.back:
            bot.sendMessage(msg.chat.id, 'Что именно Вас интересует?', {
                reply_markup: {keyboard: keyboard.home}
            })
            break
        case kb.favourite.cab:
            sendJobsByQuery(chatId, {type: 'cabel'})
            break
        case kb.favourite.roz:
            sendJobsByQuery(chatId, {type: 'rozetki'})
            break
        case kb.favourite.lights:
            sendJobsByQuery(chatId, {type: 'lights'})
            break

        case kb.favourite.sv:
            sendJobsByQuery(chatId, {type: 'svetilnik'})
            break
        case kb.favourite.cra:
            sendJobsByQuery(chatId, {type: 'cra'})
            break
        case kb.shop.box:
            sendJobsByQuery(chatId, {type: 'box'})
            break
        case kb.shop.roz:
            sendJobsByQuery(chatId, {type: 'kabeli'})
            break
        case kb.shop.sv:
            sendJobsByQuery(chatId, {type: 'svet'})
            break
        case kb.shop.orders:
            showFavouriteJobs(chatId, msg.from.id)

            break
        case (kb.order.apr):
            bot.sendMessage('864051719', 'У вас новый заказ на продукцию' +
                '')
            bot.sendMessage(chatId, 'Спасибо за заказ. Можете оставить свой номер телефона или наш менеджер свяжется с вами в telegram')
            break
        case (kb.order.contact):
            bot.sendContact(chatId, '0637504903', 'Aleksandr');

            break
    }
});
bot.on('callback_query', query => {
    console.log('dsadas')
    console.log(query.data)
    const userId = query.from.id
    let data
    try {
        data = JSON.parse(query.data)
    } catch (e) {
        throw new Error('Data is not an object')
    }

    const { type } = data

    if (type === ACTION_TYPE.SHOW_Contact_MAP) {

    } else if (type === ACTION_TYPE.SHOW_CONTACTS) {
        sendContactsByQuery(userId, {uuid: {'$in': data.contactsUuids}})
    } else if (type === ACTION_TYPE.TOGGLE_FAV_JOBS) {
        toggleFavouriteJobs(userId, query.id, data)
    } else if (type === ACTION_TYPE.SHOW_JOBS) {

    }
})
bot.onText(/\/start/, msg => {

    const text = `Здравствуйте, ${msg.from.first_name}\nВы присоеденились к боту Elektric_ua\n Вы можете заказать услуги лучших электромонтажников Украины а так же заказать необходимые расходные материалы.\n Подробнее в нашем Меню⬇️`
    bot.sendMessage(helper.getChatId(msg), text, {
        reply_markup: {
            keyboard: keyboard.home
        }
    })

})

bot.onText(/\/f(.+)/, (msg, [source, match]) => {
    const jobsUuid = helper.getItemUuid(source)
    const chatId = helper.getChatId(msg)
    Promise.all([
        Jobs.findOne({uuid: jobsUuid}),
        User.findOne({telegramId: msg.from.id})
    ]).then(([jobs,user]) => {
        let isFav = false

        if (user) {
            isFav = user.jobs.indexOf(jobs.uuid) !== -1
        }

        const favText = isFav ? 'Удалить из заказов' : 'Добавить к заказам'

        const caption = `Название: ${jobs.name}\nОписание: ${jobs.description}\nЦена: ${jobs.price}`

        bot.sendPhoto(chatId, jobs.picture, {
            caption: caption,
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: favText,
                            callback_data: JSON.stringify({
                                type: ACTION_TYPE.TOGGLE_FAV_JOBS,
                                jobsUuid: jobs.uuid,
                                isFav: isFav
                            })
                        }],

                    [
                        {
                            text: 'Связатся с менеджером',
                            url: 'http://t.me/Alexelektro'
                        }
                    ]

                ]
            }
        })
    })
})


function sendJobsByQuery(chatId, query) {
    Jobs.find(query).then(jobs => {
        const html = jobs.map((f, i) => {
            return `<b>${i + 1}</b> ${f.name} -👉 /f${f.uuid}👈`
        }).join('\n')

        sendHTML(chatId, html, 'Jobs')
    })
}


function sendHTML(chatId, html, kbName = null) {
    const options = {
        parse_mode: 'HTML'
    }

    if (kbName) {
        options['reply_markup'] = {
            keyboard: keyboard[kbName]
        }
    }

    bot.sendMessage(chatId, html, options).then(r =>{
        const options = {
            parse_mode: 'HTML'
    } })
}
function toggleFavouriteJobs(userId, queryId, {jobsUuid, isFav}) {

    let userPromise

    User.findOne({telegramId: userId})
        .then(user => {
            if (user) {
                if (isFav) {
                    user.jobs = user.jobs.filter(fUuid => fUuid !== jobsUuid)
                } else {
                    user.jobs.push(jobsUuid)
                }
                userPromise = user
            } else {
                userPromise = new User({
                    telegramId: userId,
                    jobs: [jobsUuid]
                })
            }

            const answerText = isFav ? 'Удалено' : 'Добавлено'

            userPromise.save().then(_ => {
                bot.answerCallbackQuery(
                    callback_query_id = queryId,
                    text = answerText,
                    show_alert = true
                )
            }).catch(err => console.log(err))
        }).catch(err => console.log(err))
}

function showFavouriteJobs(chatId, telegramId) {
    User.findOne({telegramId})
        .then(user => {
            if (user) {
                Jobs.find({uuid: {'$in': user.jobs}}).then(jobs => {
                    let html

                    if (jobs.length) {
                        html = jobs.map((f, i) => {
                            return `<b>${i + 1}</b> ${f.name} - <b>${f.price}</b> <b>👉</b> /f${f.uuid}👈`
                        }).join('\n')
                    } else {
                        html = 'Вы пока ничего не добавили'
                    }

                    sendHTML(chatId, html, 'order')
                }).catch(e => console.log(e))
            } else {
                sendHTML(chatId, 'Вы пока ничего не добавили', 'home')
            }

        }).catch(e => console.log(e))
}
exports.handler = (event, context, callback) => {
    const tmp = JSON.parse(event.body); // get data passed to us
    bot.handleUpdate(tmp); // make Telegraf process that data
    return callback(null, { // return something for webhook, so it doesn't try to send same stuff again
        statusCode: 200,
        body: '',
    });
};