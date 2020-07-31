// Example POST method implementation:
async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url);

    return response.json(); // parses JSON response into native JavaScript objects
}




window.onload = function () {
    postData('http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=ajaydubey541997&period=7days&api_key=b8c9f662a983905faafe02bc920630da&format=json&limit=10')
    .then(data => {
        console.log(data);
    });
};















function filterData(allTracks) {
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