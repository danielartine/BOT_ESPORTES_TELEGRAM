var TelegramBot = require('node-telegram-bot-api');
var token = '<token>';
var bot = new TelegramBot(token, {
    polling: true
});


var cbf = {
    nome: '',
    lastNews: '',
    users: {}
};

var array = [];
const rssparser = require('rss-parser');

var GE_URL = 'http://globoesporte.globo.com/servico/semantica/editorias/plantao/futebol/times/';

var times = ['botafogo', 'flamengo', 'vasco', 'fluminense'];

function inicializa() {
    console.log('length' + times.length);
    for (var j = 0; j < times.length; j++) {
        var link = GE_URL + times[j] + '/feed.rss';
        console.log(times[j]); //printa o nome do time
        rssparser.parseURL(link, function(err, parsed) {
            console.log(times[0]); //printa undefined
            cbf.nome = times[j];
            cbf.lastNews = parsed.feed.entries[0];
            array.push(cbf);
        });
    }
    console.log('INICIALIZADO');
}
inicializa();

console.log('rodando...');



function verifica(time, chatId) {
    for (var i = 0; i < array.length; i++) {
        console.log('i: ' + i);
        if (time == array[i].nome) {
            console.log(time + ' ' + array[i].nome);
            if (array[i].users[chatId] == 1) {
                console.log('JA TO AQUI');
                break;
            } else {
                array[i].users[chatId] = 1;
            }
        }
    }
}

bot.on('message', (msg) => {
    console.log(msg.text);
    var chatId = msg.chat.id;
    var text = msg.text;
    verifica(text, chatId);
    var link = GE_URL + text + '/feed.rss';
    var string;
    rssparser.parseURL(link, function(err, parsed) {
        parsed.feed.entries.forEach(function(entry, i) {
            if (i == 0)
                string = (entry.title + ':' + entry.link);
        });
        console.log("PARSEADO: " + string);
        bot.sendMessage(chatId, string);
    });

});