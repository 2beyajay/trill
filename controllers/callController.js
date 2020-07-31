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



class Credentials {
	constructor(username, fromTimestamp, page) {
		this.user = username;
		this.from = fromTimestamp;
		this.page = 1;
		this.period = '7days',
			this.limit = 10

		// this.url = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${this.user}&period=7days&api_key=b8c9f662a983905faafe02bc920630da&format=json&limit=${this.limit}&from=${this.from}`;

		this.url = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${this.user}&api_key=b8c9f662a983905faafe02bc920630da&format=json&limit=${this.limit}&from=${this.from}&page=${this.page}`;

		this.updateURL();

		return this.url;
	}

	updateURL() {
		this.url = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${this.user}&api_key=b8c9f662a983905faafe02bc920630da&format=json&limit=${this.limit}&from=${this.from}&page=${this.page}`;
	}
}



exports.getCall = (req, res, next) => {
	res.render('get_username', {
		docTitle: 'LastFM username',
	})
}

exports.postCall = (req, res, next) => {

	let trillUTS = 0;

	let tempTrillUTS = 1596000731;

	getTrilUts()
		.then(([tUts]) => {
			if (tUts === undefined || tUts.length == 0) {
				trillUTS = tempTrillUTS;
			} else {
				trillUTS = tUts[0].trill_uts;
			}
		})
		.then(() => {
			let creds = new Credentials(req.body.lastfmUsername, tempTrillUTS)
			creds.user = req.body.lastfmUsername
			creds.updateURL()
			callApi(creds);
		})


	res.redirect('/');
}

function getTrilUts() {
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





function callApi(creds) {

	let totalPages = 1;





		(async () => {
			do {
				const {body} = await got(creds.url);

				totalPages = JSON.parse(body).recenttracks['@attr'].totalPages;
				console.log(`totalPages: ${totalPages}`);
				console.log(`currentPage: ${creds.page}`);
				insertScrobbles(JSON.parse(body).recenttracks.track)
				creds.page++;
			} while (creds.page <= totalPages);

				
			
		})();


	/* do {
		let data = '';

		console.log(creds.url);

		requests(creds.url)
			.on('data', (chunk) => {
				data += chunk;
			})
			.on('end', () => {
				totalPages = JSON.parse(data).recenttracks['@attr'].totalPages;
				console.log(`totalPages: ${totalPages}`);
				console.log(`currentPage: ${creds.page}`);
				insertScrobbles(JSON.parse(data).recenttracks.track)
			}).on("error", (err) => {
				console.log("Error: " + err);
			});

		creds.page++;
		creds.updateURL();
		console.log(creds.page);
	} while (creds.page <= totalPages); */
}


function insertScrobbles(allTracks) {

	const timestamp = Date.now() / 1000;

	for (let i = 0; i < allTracks.length; i++) {
		console.log(i);

		const imageLg = allTracks[i].image.filter(img => img.size === 'large')

		const imageUrl = imageLg[0]['#text']


		if (!allTracks[i].date) {
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