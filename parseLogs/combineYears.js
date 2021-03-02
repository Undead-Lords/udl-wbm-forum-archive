
let arr = JSON.parse(require("fs").readFileSync("../logs/2001/2001records.json", { encoding: "utf-8", flag: 'r'}).trim()).concat(
	JSON.parse(require("fs").readFileSync("../logs/2002/2002records.json", { encoding: "utf-8", flag: 'r'}).trim()),
	JSON.parse(require("fs").readFileSync("../logs/2003/2003records.json", { encoding: "utf-8", flag: 'r'}).trim()),
	JSON.parse(require("fs").readFileSync("../logs/2004/2004records.json", { encoding: "utf-8", flag: 'r'}).trim()),
	JSON.parse(require("fs").readFileSync("../logs/2005/2005records.json", { encoding: "utf-8", flag: 'r'}).trim()),
	JSON.parse(require("fs").readFileSync("../logs/2006/2006records.json", { encoding: "utf-8", flag: 'r'}).trim()),
	JSON.parse(require("fs").readFileSync("../logs/2007/2007records.json", { encoding: "utf-8", flag: 'r'}).trim())
);
//import json above

//gets the year for file names from the first entry


//sort json by date asc
arr = arr.sort((a,b)=> {return a.dateOfActivity.replace(/-/g,'') - b.dateOfActivity.replace(/-/g,'');});

//records.JSON of all data
let json = JSON.stringify(arr);
require("fs").writeFileSync(`../logs/records.json`, json);


//readme.md with all data
let md = "| **Date** | **Image** |  **Description** | **wbmURL** | **Backup** |\n|:---------:|:---:|:----------:|:---:|:---:|\n";
for(let i=0;i<arr.length;i++) {
	md +=	`| ${arr[i].dateOfActivity} ` +
		`| [:framed_picture:](${arr[i].imageStampURL}) | ${arr[i].description} ` +
		`| [:link:](${arr[i].wbmURL}) | [:floppy_disk:](${arr[i].backupURL}) |\n`
}
require("fs").writeFileSync(`../logs/README.md`, md);

//records.CSV of all data
const { Parser } = require('json2csv');

const fields = ['dateOfActivity',  'description', 'imageStampURL', 'wbmURL', 'backupURL'];
const opts = { fields };

try {
	const parser = new Parser(opts);
	const csv = parser.parse(arr);
	require("fs").writeFileSync(`../logs/records.csv`, csv);
} catch (err) {
	console.error(err);
}
