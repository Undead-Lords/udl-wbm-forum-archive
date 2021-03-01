
let list = [];
let needle = '<p>The Wayback Machine has not archived that URL.</p>'
const https = require('https');
const handleRequest = (url, i) => {
	https.get(url, (resp) => {
		let data = '';
		resp.on('data', (chunk) => {
			data += chunk;
		});
		resp.on('end', () => {
			console.log(i);
			if(!data.includes(needle)){
				let x = require("fs").readFileSync("./listOfProfileURLs.md", { encoding: "utf-8", flag: 'r'}).trim();
				x += "\n" + url;
				require("fs").writeFileSync(`./listOfProfileURLs.md`, x);
			}
		});
	}).on("error", (err) => {
		console.log("Error: " + err.message);
	})
}

async function permute(i){
		let link = `https://web.archive.org/web/20051224093807/http://www.undeadlords.net/forums/index.php?showuser=${i}`;
		let result = await handleRequest(link, i);
		return result;
}
for(let i = 0; i <= 333; i++) {
setTimeout(() => {
	list.push(permute(i));
}, 1000 * i);
}











