let one = require("fs").readFileSync("../logs/2007/2007-11/20071102.json", { encoding: "utf-8", flag: 'r'}).trim();
let two = require("fs").readFileSync("../logs/2007/2007-11/20071104.json", { encoding: "utf-8", flag: 'r'}).trim();
let three = require("fs").readFileSync("../logs/2007/2007-11/20071105.json", { encoding: "utf-8", flag: 'r'}).trim();
let four = require("fs").readFileSync("../logs/2007/2007-11/20071105generalchat.json", { encoding: "utf-8", flag: 'r'}).trim();
let five = require("fs").readFileSync("../logs/2007/2007-11/20071105technicalanalysis.json", { encoding: "utf-8", flag: 'r'}).trim();
let six = require("fs").readFileSync("../logs/2007/2007-11/20071105worldofwarcraft.json", { encoding: "utf-8", flag: 'r'}).trim();
let arr = JSON.parse(one).records.concat(
	JSON.parse(two).records,
	JSON.parse(three).records,
	JSON.parse(four).records,
	JSON.parse(five).records,
	JSON.parse(six).records)
//import json above

//records.JSON of all data
let json = JSON.stringify(arr);
require("fs").writeFileSync('../logs/2007/2007records.json', json);

//SET of unique active dates
let listUniqueDates = new Set();
//records.md of all data
let md = "| **Date** | **Image** |  **Description** | **wbmURL** | **Backup** |\n|:--------:|:---:|:-------------:|:---:|:---:|\n";
for(let i=0;i<arr.length;i++) {
 	md +=	`| ${arr[i].dateOfActivity} ` +
	`| [:framed_picture:](${arr[i].imageStampURL}) | ${arr[i].description} ` +
	`| [:link:](${arr[i].wbmURL}) | [:floppy_disk:](${arr[i].backupURL}) |\n`

}
require("fs").writeFileSync('../logs/2007/2007records.md', md);

//records.CSV of all data
console.log(arr.length);
//loop through array of record objects

//SET of unique active dates
//let listUniqueDates = new Set();
//records.CSV of all data
//records.JSON of all data
//records.md of all data



