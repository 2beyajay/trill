let fs = require('fs');
let fetch = require('node-fetch')

/* 
let apiKey = {
    "Application name": "Trill",
    "API key": "b8c9f662a983905faafe02bc920630da",
    "Shared secret": "7d654ffebe42ef21e96d5cb2f95bb6a6",
    "Registered to": "ajaydubey541997"
}


let myData = []

fetch('http://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=ajaydubey541997&period=7days&api_key=b8c9f662a983905faafe02bc920630da&format=json&limit=1')
    // .then(response => response.json())
    .then(data => myData.push(data))
    .then(showData())


function showData() {
    console.log(myData);
} */




/* .then(
    fs.writeFileSync("myTracks.json", myData, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    })
); */

let parameters = {
    method: "user.getrecenttracks",
    user: "ajaydubey541997",
    period: "7days",
    api_key: "b8c9f662a983905faafe02bc920630da",
    format: "json",
    limit: 1
}

let url = `http://ws.audioscrobbler.com/2.0/?method=${parameters.method}&user=${parameters.user}&period=${parameters.period}&api_key=${parameters.api_key}&format=${parameters.format}&limit=${parameters.limit}`;


async function getMyTracks(url) {
    // const response = await fetch('http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=ajaydubey541997&period=7days&api_key=b8c9f662a983905faafe02bc920630da&format=json&limit=5')

    const response = await fetch(url);
    
    const resultJson = await response.json();
    console.log(resultJson.recenttracks.track);
    const result = JSON.stringify(resultJson)

    fs.writeFileSync("myTracks.json", result, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    })
}

getMyTracks(url)








// json to csv conversion
/* const items = json3.items
const replacer = (key, value) => {
    value === null ? '' : value
}

const header = Object.keys(items[0])

let csv = items.map(row => header.map(fieldName => {
    JSON.stringify(row[fieldName], replacer)
}).join(','))

csv.unshift(header.join(','))

csv = csv.join('\r\n')

console.log(csv) */