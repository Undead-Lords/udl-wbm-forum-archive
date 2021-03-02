

let arr = JSON.parse(require("fs").readFileSync("../logs/2006/2006-05/20060518-0.json", { encoding: "utf-8", flag: 'r'}).trim()) .concat(
	JSON.parse(require("fs").readFileSync("../logs/2006/2006-10/20061026-0.json", { encoding: "utf-8", flag: 'r'}).trim()),
	JSON.parse(require("fs").readFileSync("../logs/2006/2006-11/20061108-0.json", { encoding: "utf-8", flag: 'r'}).trim()),
	JSON.parse(require("fs").readFileSync("../logs/2006/2006-11/20061117-0.json", { encoding: "utf-8", flag: 'r'}).trim()),
	JSON.parse(require("fs").readFileSync("../logs/2006/2006-11/20061127-0.json", { encoding: "utf-8", flag: 'r'}).trim())
	)
//import json above

//gets the year for file names from the first entry
let year = arr[0].dateOfStamp.substr(0,4);

//sort json by date asc
arr = arr.sort((a,b)=> {return a.dateOfActivity.replace(/-/g,'') - b.dateOfActivity.replace(/-/g,'');});

//records.JSON of all data
let json = JSON.stringify(arr);
require("fs").writeFileSync(`../logs/${year}/${year}records.json`, json);

//SET of unique active dates
let listUniqueDates = new Set();
//readme.md with all data
let md = "| **Date** | **Image** |  **Description** | **wbmURL** | **Backup** |\n|:---------:|:---:|:----------:|:---:|:---:|\n";
for(let i=0;i<arr.length;i++) {
 	md +=	`| ${arr[i].dateOfActivity} ` +
	`| [:framed_picture:](${arr[i].imageStampURL}) | ${arr[i].description} ` +
	`| [:link:](${arr[i].wbmURL}) | [:floppy_disk:](${arr[i].backupURL}) |\n`
	listUniqueDates.add(arr[i].dateOfActivity);
}
require("fs").writeFileSync(`../logs/${year}/README.md`, md);


//records.CSV of all data
const { Parser } = require('json2csv');

const fields = ['dateOfActivity',  'description', 'imageStampURL', 'wbmURL', 'backupURL'];
const opts = { fields };

try {
	const parser = new Parser(opts);
	const csv = parser.parse(arr);
	//console.log(csv);
	require("fs").writeFileSync(`../logs/${year}/${year}records.csv`, csv);
} catch (err) {
	console.error(err);
}

//SET of unique active dates
console.log(listUniqueDates);