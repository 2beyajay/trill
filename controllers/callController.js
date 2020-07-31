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

const got = require('got')
const express = require('express');
const db = require('../util/database')

const app = express();


exports.getCall = (req, res, next) => {
	res.render('get_username', {
		docTitle: 'LastFM username',
	})
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



class Credentials {
	constructor(username, fromTimestamp, page) {
		this.user = username;
		this.from = fromTimestamp;
		this.page = page;
		this.period = '7days';
		this.limit = 200;

		// this.url = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${this.user}&period=7days&api_key=b8c9f662a983905faafe02bc920630da&format=json&limit=${this.limit}&from=${this.from}`;

		this.url = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${this.user}&api_key=b8c9f662a983905faafe02bc920630da&format=json&limit=${this.limit}&from=${this.from}&page=${this.page}`;

		this.updateURL();

		return this.url;
	}

	updateURL() {
		this.url = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${this.user}&api_key=b8c9f662a983905faafe02bc920630da&format=json&limit=${this.limit}&from=${this.from}&page=${this.page}`;
	}
}



exports.postCall = (req, res, next) => {

	let trillUTS = 0;
	// 1595981800 should be the smallest trill_uts if all goes well
	// if not, this is where things will start from

	// let tempTrillUTS = 1595000731;

	getTrilUts()
		.then(([tUts]) => {
			if (!(tUts === undefined || tUts.length == 0)) {
				// trillUTS = tUts[0].trill_uts;
			}
		})
		.then(() => {
			let creds = new Credentials(req.body.lastfmUsername, trillUTS, 1)
			creds.user = req.body.lastfmUsername
			creds.updateURL();
			callApi(creds);
		})
		.catch(err => console.log(err))


	res.redirect('/');
}


function getTrilUts() {
	return db.execute('SELECT trill_uts from scrobbles ORDER BY trill_uts DESC LIMIT 1')
}


function callApi(creds) {

	let totalPages = 1;


	(async () => {
		do {
			const {
				body
			} = await got(creds.url);
			console.log(creds.url);

			totalPages = JSON.parse(body).recenttracks['@attr'].totalPages;
			console.log(`totalPages: ${totalPages}`);
			console.log(`currentPage: ${creds.page}`);
			insertScrobbles(JSON.parse(body).recenttracks.track)
			creds.page++;
			creds.updateURL();
		} while (creds.page <= totalPages);
	})();
}


function insertScrobbles(allTracks) {

	const timestamp = Date.now() / 1000;

	for (let i = 0; i < allTracks.length; i++) {
		console.log(i);

		const imageLg = allTracks[i].image.filter(img => img.size === 'large')

		const imageUrl = imageLg[0]['#text']

		let duration = 180000;

		if (allTracks[i].artist['#text'] && allTracks[i].name) {
			let urlForDuration = `http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=b8c9f662a983905faafe02bc920630da&format=json&track=${allTracks[i].name}&artist=${allTracks[i].artist['#text']}`;

			(async () => {
				const {body} = await got(urlForDuration);
				duration = JSON.parse(body).track.duration;
				console.log(`URL for duration: ${urlForDuration}`);
				console.log(`duration: ${duration}`);
			})();
		}

		if (!allTracks[i].date) {
			allTracks[i].date = {}
			allTracks[i].date.uts = 0;
			allTracks[i].date['#text'] = '';
		}

		db.execute(
			'INSERT INTO scrobbles (title, track_mbid, album, album_mbid, artist, artist_mbid, duration, image_url, lastfm_uts, lastfm_uts_formatted, trill_uts) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
			[
				allTracks[i].name,
				allTracks[i].mbid,
				allTracks[i].album['#text'],
				allTracks[i].album.mbid,
				allTracks[i].artist['#text'],
				allTracks[i].artist.mbid,
				duration,
				imageUrl,
				allTracks[i].date.uts,
				allTracks[i].date['#text'],
				timestamp
			]
		)

	}
}