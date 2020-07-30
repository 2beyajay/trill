const Tracks = require('../models/Tracks');


const requests = require('requests');
const path = require('path');
const express = require('express');
const { DateTime } = require('luxon');
const moment = require('moment');
// const Datastore = require('nedb');
const db = require('../util/database')

// const database = new Datastore(path.join(__dirname, '../', 'data', 'tracks.db'));
// database.loadDatabase();

const app = express();

/* let parameters = {
	method: "user.getrecenttracks",
	user: "ajaydubey541997",
	period: "7days",
	api_key: "b8c9f662a983905faafe02bc920630da",
	format: "json",
	limit: 10
}

let url = `http://ws.audioscrobbler.com/2.0/?method=${parameters.method}&user=${parameters.user}&period=${parameters.period}&api_key=${parameters.api_key}&format=${parameters.format}&limit=${parameters.limit}`; 
 */


class Credentials {
	constructor(username, fromTimestamp, page){
		this.user = username;
		this.from = fromTimestamp;
		this.page = 1;
		this.period = '7days'
		// this.url = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${this.user}&period=7days&api_key=b8c9f662a983905faafe02bc920630da&format=json&limit=${this.limit}&from=${this.from}`;
		
		this.url = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${this.user}&period=${this.period}&api_key=b8c9f662a983905faafe02bc920630da&format=json&limit=200&from=${this.from}&page=${this.page}`;
		
		console.log(this.url);

		return this.url;
	}
}

exports.filteredData = [];




exports.getCall = (req, res, next) => {
	// res.sendFile(path.join(__dirname, '../', 'views', 'index.html'));
	res.render('get_username', {
		docTitle: 'LastFM username',
	})
}

exports.postCall = (req, res, next) => {

	let trillUTS = 0;

	getTrilUts()
		.then(([trillUts]) => {
			if(this.trillUts) {
				trillUTS = trillUts[0]
			}
		})
		.then(() => {
			console.log(trillUTS);
			let creds = new Credentials(req.body.lastfmUsername, trillUTS)
			creds.user = req.body.lastfmUsername
			callApi(creds);
		})
	
	


	// let creds = new Credentials(req.body.lastfmUsername, trillUTS)
	// creds.user = req.body.lastfmUsername
	// console.log(creds.url + ' from the postCall' );

	// callApi(creds);
	// res.redirect('/charts');
	res.redirect('/');
}

function getTrilUts(){
	return db.execute('SELECT trill_uts from scrobbles ORDER BY trill_uts DESC LIMIT 1')
}


exports.getLoading = (req, res, next) => {
    res.render('loading', {
		docTitle: 'Loading....',
	})
}

exports.getCharts = (req, res, next) => {
    res.render('show_charts', {
		docTitle: 'Your Charts',
	})
}





function callApi(creds){
	// console.log(creds.url + ' from the callApi'); 
	let data = '';

	requests(creds.url)
	.on('data', (chunk) => {
		data += chunk;
	})
	.on('end', () => {
		
		// filterData(JSON.parse(data).recenttracks.track)
		insertScrobbles(JSON.parse(data).recenttracks.track)
	}).on("error", (err) => {
		console.log("Error: " + err);
	});
}


function insertScrobbles(allTracks){

	const timestamp = Date.now() / 1000;

	for (let i = 0; i < allTracks.length; i++) {
		console.log(i);
		
		const imageLg = allTracks[i].image.filter(img => img.size === 'large' )

		const imageUrl = imageLg[0]['#text']

		console.log(allTracks[i].date);


		if(!allTracks[i].date){
			allTracks[i].date = {}
			allTracks[i].date.uts = 0;
			allTracks[i].date['#text'] = '';
		}

		db.execute(
			'INSERT INTO scrobbles (title, album, artist, image_url, lastfm_uts, lastfm_uts_formatted, trill_uts) VALUES (?, ?, ?, ?, ?, ?, ?)',
			[allTracks[i].name, allTracks[i].album['#text'], allTracks[i].artist['#text'], imageUrl, allTracks[i].date.uts, allTracks[i].date['#text'], timestamp]
		)

	}
}


function filterData(allTracks){
	const timestamp = Date.now();

	for (let i = 0; i < allTracks.length; i++) {
		console.log(i);
		console.log(allTracks[i].name);
		

	}

	/* const trackName = allTracks.map((track) => track.name)
	const albumName = allTracks.map((track) => track.album['#text'])
	const artitstName = allTracks.map(track => track.artist['#text'])

	const whenDate = allTracks.map(track => track.date)
	const whenUTS = whenDate.map(date => date['uts'])
	const whenFormatted = whenDate.map(date => date['#text'])

	const imageO = allTracks.map(track => track.image)

	let imageUrl = [];
	imageO.forEach(imgO => {
		imgO.filter(img => {
			img.size == 'large'
			if (img.size == 'large') {
				imageUrl.push(img['#text']);
			}
		})
	}); */
}