const https = require('https');

function callKline(callback){
    https.get('https://bit2c.co.il/Exchanges/BtcNis/KLines?resolution=D&from=1358176602&to=1663706201', (resp) => {
        let data = '';

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            callback(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
}

let bit2c = {
    kLines: callKline
};

if (typeof window !== 'undefined') {
    window.bit2c = bit2c;
}
if (typeof self !== 'undefined') {
    self.bit2c = bit2c;
}
if (typeof module !== 'undefined') {
    module.exports = bit2c;
}
