

let arr = JSON.parse(require("fs").readFileSync("../logs/2001/2001-04/20010408-0.json", { encoding: "utf-8", flag: 'r'}).trim()).concat(
	JSON.parse(require("fs").readFileSync("../logs/2001/2001-04/20010408-1.json", { encoding: "utf-8", flag: 'r'}).trim()),
	JSON.parse(require("fs").readFileSync("../logs/2001/2001-04/20010408-2.json", { encoding: "utf-8", flag: 'r'}).trim()),
	JSON.parse(require("fs").readFileSync("../logs/2001/2001-04/20010408-3.json", { encoding: "utf-8", flag: 'r'}).trim()),
	JSON.parse(require("fs").readFileSync("../logs/2001/2001-04/20010408-4.json", { encoding: "utf-8", flag: 'r'}).trim()),
	JSON.parse(require("fs").readFileSync("../logs/2001/2001-04/20010409-0.json", { encoding: "utf-8", flag: 'r'}).trim()),
	JSON.parse(require("fs").readFileSync("../logs/2001/2001-04/20010426-0.json", { encoding: "utf-8", flag: 'r'}).trim()),
	JSON.parse(require("fs").readFileSync("../logs/2001/2001-04/20010427-0.json", { encoding: "utf-8", flag: 'r'}).trim()),
	JSON.parse(require("fs").readFileSync("../logs/2001/2001-04/20010427-1.json", { encoding: "utf-8", flag: 'r'}).trim()),
	JSON.parse(require("fs").readFileSync("../logs/2001/2001-06/20010617-0.json", { encoding: "utf-8", flag: 'r'}).trim()),
	JSON.parse(require("fs").readFileSync("../logs/2001/2001-06/20010619-0.json", { encoding: "utf-8", flag: 'r'}).trim()),
	JSON.parse(require("fs").readFileSync("../logs/2001/2001-06/20010619-1.json", { encoding: "utf-8", flag: 'r'}).trim()),
	JSON.parse(require("fs").readFileSync("../logs/2001/2001-06/20010619-2.json", { encoding: "utf-8", flag: 'r'}).trim()),
	JSON.parse(require("fs").readFileSync("../logs/2001/2001-06/20010619-3.json", { encoding: "utf-8", flag: 'r'}).trim()),
	JSON.parse(require("fs").readFileSync("../logs/2001/2001-06/20010619-4.json", { encoding: "utf-8", flag: 'r'}).trim()),
	JSON.parse(require("fs").readFileSync("../logs/2001/2001-07/20010707-0.json", { encoding: "utf-8", flag: 'r'}).trim()),
	JSON.parse(require("fs").readFileSync("../logs/2001/2001-07/20010714-0.json", { encoding: "utf-8", flag: 'r'}).trim()),
	JSON.parse(require("fs").readFileSync("../logs/2001/2001-07/20010714-1.json", { encoding: "utf-8", flag: 'r'}).trim()),
	JSON.parse(require("fs").readFileSync("../logs/2001/2001-07/20010714-2.json", { encoding: "utf-8", flag: 'r'}).trim()),
	JSON.parse(require("fs").readFileSync("../logs/2001/2001-07/20010727-0.json", { encoding: "utf-8", flag: 'r'}).trim()),
	JSON.parse(require("fs").readFileSync("../logs/2001/2001-07/20010727-1.json", { encoding: "utf-8", flag: 'r'}).trim()),
	JSON.parse(require("fs").readFileSync("../logs/2001/2001-07/20010727-2.json", { encoding: "utf-8", flag: 'r'}).trim()),
	JSON.parse(require("fs").readFileSync("../logs/2001/2001-07/20010727-3.json", { encoding: "utf-8", flag: 'r'}).trim()),
	JSON.parse(require("fs").readFileSync("../logs/2001/2001-08/20010818-0.json", { encoding: "utf-8", flag: 'r'}).trim()),
	JSON.parse(require("fs").readFileSync("../logs/2001/2001-11/20011112-0.json", { encoding: "utf-8", flag: 'r'}).trim()),
	JSON.parse(require("fs").readFileSync("../logs/2001/2001-12/20011205-0.json", { encoding: "utf-8", flag: 'r'}).trim()),

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