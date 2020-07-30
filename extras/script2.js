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