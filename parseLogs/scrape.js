const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

const addDashes = (date) => {
	return `${date.substr(0, 4)}-${date.substr(4, 2)}-${date.substr(6, 2)}`
}
const removeDashes = (date) => {
	return date.replace(/-/g, '');
}
const fileExists = (file) => {
	let filetype = file.substring(file.lastIndexOf('.'));
	//console.log(`filetype: ${filetype} `)

	file = file.substring(0, file.lastIndexOf('.'));
	//console.log(`file path: ${file}`)

	//console.log(`file substr -4: ${file.substr(-4)}`)
	if(!file.substr(-4).includes('-')) {

		file += '-0';
	} else {
		let num = Number(file.substr(file.lastIndexOf('-') + 1));
		num++;
		file = `${file.substring(0, file.lastIndexOf('-') + 1)}${num}`;
		//console.log(`file after num: ${file}`)
	}
	file = file + filetype

	if(fs.existsSync(file)) {
		return fileExists(file);
	} else {
		return file;
	}
}
const parseURL = async (url) => {
	let wbmURL = url;
	let dateOfStamp = addDashes(wbmURL.slice(wbmURL.indexOf('web.archive.org/web/') + 20, wbmURL.indexOf('web.archive.org/web/') + 28));
	let imageSavePath = fileExists(`../archive/timestamps/${dateOfStamp.substr(0, 4)}/${dateOfStamp.substr(0, 7)}/${removeDashes(dateOfStamp)}.png`);
	let imageStampURL = `https://github.com/Undead-Lords/udl-wbm-forum-archive/blob/main/${imageSavePath.substr(3)}`
	let backupSavePath = fileExists(`../archive/backups/${dateOfStamp.substr(0, 4)}/${dateOfStamp.substr(0, 7)}/${removeDashes(dateOfStamp)}.html`);
	let backupURL = `https://github.com/Undead-Lords/udl-wbm-forum-archive/blob/main/${backupSavePath.substr(3)}`
	let logSavePath = fileExists(`../logs/${dateOfStamp.substr(0, 4)}/${dateOfStamp.substr(0, 7)}/${removeDashes(dateOfStamp)}.json`);

	console.log(`opening connection...`);
	const browser = await puppeteer.launch()
	console.log(`puppet launched.`);
	const page = await browser.newPage()
	console.log(`opened page...`);
	await page.setViewport({width: 1280, height: 800})
	console.log(`navigating...`);
	await page.goto(url)
	console.log(`navigated.`);

	//save html
	await fs.promises.mkdir(path.dirname(backupSavePath), {recursive: true})
	const html = await page.content();
	await fs.writeFileSync(backupSavePath, html);
	console.log(`html saved to 	${backupSavePath}`);

	//save screenshot
	await fs.promises.mkdir(path.dirname(imageSavePath), {recursive: true})
	await page.screenshot({path: imageSavePath, fullPage: true})
	console.log(`image saved to 	${imageSavePath}`);

	//save array of json objects
	let json = parseHTML(html, dateOfStamp);
	json.forEach((x) => {
		x['wbmURL'] = wbmURL;
		x['dateOfStamp'] = dateOfStamp;
		x['imageStampURL'] = imageStampURL;
		x['backupURL'] = backupURL;
	})
	json = JSON.stringify(json);
	await fs.promises.mkdir(path.dirname(logSavePath), {recursive: true})
	await fs.writeFileSync(logSavePath, json);
	console.log(`json saved to		${logSavePath}`);

	console.log(`closing connection...`);
	await browser.close();
	return json;
};
const parseHTML = (html, date) => {
	const pHtml = html
	let jsonArr = [];
	let regexp;
	let tempArr = [];
	// 2004 online users ticker
	regexp = /<b>\d*<\/b>\susers\sonline/g;
	if(pHtml.match(regexp) !== null) {
		tempArr = [...pHtml.match(regexp)];
		let tempDesc = tempArr[0].substring(3, tempArr[0].lastIndexOf('<'))

		if(Number(tempDesc) > 1) {
			jsonArr.push({
				"dateOfActivity": date,
				"description": `${tempDesc} people using the forum at the time of the snapshot`
			})
		}
	}


	// early 2001 user made a post
	regexp = /face="Verdana">.{2,30}<\/font><\/td>\s*<td\salign="CENTER"\svalign="TOP"\snowrap=""><font\ssize="1"\scolor="#FFFFFF"\sface="Verdana">\w{3}-\d\d-\d\d\s\d\d:\d\d&nbsp;\w\w<\/font>/g;
	if(pHtml.match(regexp) !== null) {
		tempArr = [...pHtml.match(regexp)];
		for(let i = 0; i < tempArr.length; i++) {
			let tempDesc = tempArr[i].match(/">.{2,30}<\/font>/)
			tempDesc = `${tempDesc[0].substr(2, tempDesc[0].length - 9)} made a forum post`;
			let tempDate = tempArr[i].match(/\w{3}-\d\d-\d\d/);
			tempDate = tempDate[0].split('-');
			tempDate = `${valYear(tempDate[2])}-${valMonth(tempDate[0])}-${tempDate[1]}`;
			if(!tempDesc.includes('Guest')) {
				jsonArr.push({"dateOfActivity": tempDate, "description": tempDesc})
			}
		}
	}
	// sept 2001 through early 2003 user made a post
	regexp = /face="Verdana">\w{3}-\d\d-\d\d\s\d\d:\d\d&nbsp;\w\w\s<br>by\s.{2,30}<\/font><\/td>/g;
	if(pHtml.match(regexp) !== null) {
		tempArr = [...pHtml.match(regexp)];
		for(let i = 0; i < tempArr.length; i++) {
			let tempDesc = tempArr[i].match(/by\s.{2,30}<\/font>/)
			tempDesc = `${tempDesc[0].substr(3, tempDesc[0].length - 10)} made a forum post`;
			let tempDate = tempArr[i].match(/\w{3}-\d\d-\d\d/);
			tempDate = tempDate[0].split('-');
			tempDate = `${valYear(tempDate[2])}-${valMonth(tempDate[0])}-${tempDate[1]}`;
			jsonArr.push({"dateOfActivity": tempDate, "description": tempDesc})
		}
	}

	//2004 user made a post
	regexp = /<span\sclass="gensmall">\w{3}\s\w{3}\s\d\d?,\s\d{4}\s\d\d?:\d\d\s\w\w<br><a\shref="\S{20,100}">.{2,20}<\/a>\s<a\shref="view/g;
	if(pHtml.match(regexp) !== null) {
		tempArr = [...pHtml.match(regexp)];
		for(let i = 0; i < tempArr.length; i++) {
			let tempDesc = tempArr[i].match(/">.{2,20}<\/a>\s<a\shref="view/)
			tempDesc = `${tempDesc[0].substr(2, tempDesc[0].length - 20)} made a forum post`;
			let tempDate = tempArr[i].match(/\w{3}\s\d\d?,\s\d{4}/);
			tempDate = `${tempDate[0].substr(-4)}-${valMonth(tempDate[0].substr(0, 3))}-${tempDate[0].substr(4, 2)}`
			jsonArr.push({"dateOfActivity": tempDate, "description": tempDesc})
		}
	}
	//2004 most active date
	regexp = /Most\susers\sever\sonline\swas\s<b>\d*<\/b>\son\s\w{3}\s\w{3}\s\d\d?,\s\d{4}/g;
	if(pHtml.match(regexp) !== null) {
		tempArr = [...pHtml.match(regexp)];
		let tempDesc = tempArr[0].substring(tempArr[0].indexOf('>') + 1, tempArr[0].lastIndexOf('<'))
		if(Number(tempDesc) > 1) {
			let tempDate = tempArr[0].match(/\w{3}\s\d\d?,\s\d{4}/);
			tempDate = `${tempDate[0].substr(-4)}-${valMonth(tempDate[0].substr(0, 3))}-${tempDate[0].substr(4, 2)}`
			jsonArr.push({
				"dateOfActivity": tempDate,
				"description": `${tempDesc} highest record of people using the forums on ${tempDate}`
			})
		}
	}

	//2005 profile last active
	regexp = /<b>Last\sActive<\/b><\/td>\s*<td\sclass="row1">\d\d?\w\w\s\w{3,9}\s\d{4}\s-\s\d\d?:\d\d\s\w\w<\/td>|<b>Last\sActive<\/b><\/td>\s*<td\sclass="row1">\w{2,6}day,\s\d\d?:\d\d\s\w\w<\/td>/g;
	if(pHtml.match(regexp) !== null) {
		tempArr = [...pHtml.match(regexp)];
		let tempDate = tempArr[0].substring(tempArr[0].indexOf('row1">') + 6, tempArr[0].lastIndexOf('</td>'))
		if(tempDate.substr(0, 5).toLowerCase() === 'today') {
			tempDate = date;
		} else if(tempDate.substr(0, 9).toLowerCase() === 'yesterday') {
			tempDate = date.split('-');
			tempDate[2] = Number(tempDate[2]) - 1;
			tempDate = tempDate.join('-');
		} else {
			tempDate = tempDate.match(/\d\d?\w\w\s\w{3,9}\s\d{4}/);
			tempDate = `${tempDate[0].substr(-4)}-${valMonth(tempDate[0].substr(4, tempDate[0].length - 5))}-${valDay(tempDate[0].substr(0, 2))}`
		}
		jsonArr.push({"dateOfActivity": tempDate, "description": `user's last activity was on ${tempDate}`});
		//if(Number(tempDesc) > 1) {
		//	let tempDate = tempArr[0].match(/\w{3}\s\d\d?,\s\d{4}/);
		//	tempDate = `${tempDate[0].substr(-4)}-${valMonth(tempDate[0].substr(0,3))}-${tempDate[0].substr(4,2)}`
		//	jsonArr.push({"dateOfActivity": tempDate, "description": `${tempDesc} highest record of people using the forums on ${tempDate}`})
		//}
	}
	//2005 profile joined date
	regexp = /\d\d?-\w{3,9}\s\d\d\s*<\/div>\s*<!--{WARN_LEVEL}-->/g
	if(pHtml.match(regexp) !== null) {
		tempArr = [...pHtml.match(regexp)];
		let tempDate = `20${tempArr[0].substr(tempArr[0].indexOf(' ') + 1, 2)}-${valMonth(tempArr[0].substring(tempArr[0].indexOf('-') + 1, tempArr[0].indexOf(' ')))}-${valDay(tempArr[0].substring(0, tempArr[0].indexOf('-')))}`
		jsonArr.push({"dateOfActivity": tempDate, "description": `user made their forum account on ${tempDate}`});
	}
	//2005 user made a post
	regexp = /"lastaction">\d\d?\w\w\s\w{3,9}\s\d{4}\s-\s\d\d?:\d\d\s\w\w<br><a\s\w{4}="\w{4}\w?:\/\/web\.archive\.org\/web\/\d{14}\/\w{4}\w?:\/\/\S{20,100}>Last\spost\sby:<\/a>\s<b><a\shref="\S{20,100}">.{2,20}<\/a><\/b><\/span>/g;
	if(pHtml.match(regexp) !== null) {
		tempArr = [...pHtml.match(regexp)];
		for(let i = 0; i < tempArr.length; i++) {
			let tempDesc = tempArr[i].match(/\?showuser=\d{1,3}">.{2,20}<\/a><\/b><\/span>/)
			tempDesc = `${tempDesc[0].substr(tempDesc[0].indexOf('>') + 1, tempDesc[0].length - 15 - (tempDesc[0].indexOf('>') + 1))} made a forum post`;
			let tempDate = tempArr[i].match(/\d\d?\w\w\s\w{3,9}\s\d{4}/);
			tempDate = `${tempDate[0].substr(-4)}-${valMonth(tempDate[0].substr(4, tempDate[0].length - 5))}-${valDay(tempDate[0].substr(0, 2))}`
			jsonArr.push({"dateOfActivity": tempDate, "description": tempDesc})
		}
	}
	// 2005 online users ticker
	regexp = /\d*\sUser\(s\)\sare\sbrowsing\sthis\sforum\s\(\d*\sGuests\sand\s\d*\sAnonymous\sUsers\)/g;
	if(pHtml.match(regexp) !== null) {
		tempArr = [...pHtml.match(regexp)];
		let tempDesc = tempArr[0].substring(0, tempArr[0].indexOf('U'))
		if(Number(tempDesc) > 1) {
			jsonArr.push({
				"dateOfActivity": date,
				"description": `${tempDesc} people using the forum at the time of the snapshot`
			})
		}
	}

	//2006 online users ticker
	regexp = /\d*\suser\(s\)\sactive\sin\sthe\spast\s15\sminutes/g;
	if(pHtml.match(regexp) !== null) {
		tempArr = [...pHtml.match(regexp)];
		let tempDesc = tempArr[0].substring(0, tempArr[0].indexOf('u'))
		if(Number(tempDesc) > 1) {
			jsonArr.push({
				"dateOfActivity": date,
				"description": `${tempDesc} people using the forum at the time of the snapshot`
			})
		}
	}
	//2006 user made a post
	regexp = /alt="Last\sPost"><\/a>\s<span>(\w{3}\s\d\d?\s\d{4}|\w{2,6}day),\s\d\d:\d\d\s\w\w<br><b>In:<\/b>&nbsp;<a\shref=".{20,150}"\stitle="Go\sto\sthe\sfirst\sunread\spost:\s.{2,80}">.{2,80}<\/a><br><b>By:<\/b>\s<a\shref=".{20,100}">.{2,20}<\/a><\/span><\/td>/g;
	if(pHtml.match(regexp) !== null) {
		tempArr = [...pHtml.match(regexp)];
		for(let i = 0; i < tempArr.length; i++) {
			let tempDesc = tempArr[i].match(/\?showuser=\d{1,3}">.{2,20}<\/a><\/span><\/td>/g)
			tempDesc = `${tempDesc[0].substr(tempDesc[0].indexOf('>') + 1, tempDesc[0].length - 16 - (tempDesc[0].indexOf('>') + 1))} made a forum post`;
			let tempDate = tempArr[i].match(/(\w{3}\s\d\d?\s\d{4}|\w{2,6}day),\s\d\d:\d\d\s\w\w/);
			if(tempDate[0].substr(0, 5).toLowerCase() === 'today') {
				tempDate = date;
			} else if(tempDate[0].substr(0, 9).toLowerCase() === 'yesterday') {
				tempDate = date.split('-');
				tempDate[2] = valDay(Number(tempDate[2]) - 1);
				tempDate = tempDate.join('-');
			} else {
				tempDate = tempDate[0].match(/\w{3}\s\d\d?\s\d{4}/)
				tempDate = tempDate[0].split(' ');
				tempDate = `${tempDate[2]}-${valMonth(tempDate[0])}-${valDay(tempDate[1])}`
			}
			jsonArr.push({"dateOfActivity": tempDate, "description": tempDesc})
		}
	}
	//2006 most active date
	regexp = /<\/a><\/b><br>Most\susers\sever\sonline\swas\s<b>\d*<\/b>\son\s<b>\w{3}\s\d\d?\s\d{4}/g;
	if(pHtml.match(regexp) !== null) {
		console.log('most active date found')
		tempArr = [...pHtml.match(regexp)];
		let tempDesc = tempArr[0].substring(42, tempArr[0].lastIndexOf("<\/b>"))
		console.log(tempDesc);
		if(Number(tempDesc) > 1) {
			let tempDate = tempArr[0].match(/\w{3}\s\d\d?\s\d{4}/);
			tempDate = `${tempDate[0].substr(-4)}-${valMonth(tempDate[0].substr(0, 3))}-${tempDate[0].substr(4, 2)}`
			jsonArr.push({
				"dateOfActivity": tempDate,
				"description": `${tempDesc} highest record of people using the forums on ${tempDate}`
			});
		}
	}

	return jsonArr;
}
const valMonth = (month) => {
	month = month.trim().toLowerCase().substr(0, 3);
	switch(month) {
		case 'jan':
			return '01';
		case 'feb':
			return '02';
		case 'mar':
			return '03';
		case 'apr':
			return '04';
		case 'may':
			return '05';
		case 'jun':
			return '06';
		case 'jul':
			return '07';
		case 'aug':
			return '08';
		case 'sep':
			return '09';
		case 'oct':
			return '10';
		case 'nov':
			return '11';
		case 'dec':
			return '12';
	}
}
const valYear = (year) => {

	if(year.toString().length === 2) {
		if(Number(year) < 90) {
			year = `20${year}`;
		} else {
			year = `19${year}`;
		}
	}
	return year;
}
const valDay = (day) => {
	day = day.split('');
	day = day.map(x => {
		if(isNaN(Number(x))) {
			return ''
		} else {
			return x
		}
	}).join('');
	if(day.toString().length === 1) {
		return '0' + day
	}
	return day;
}


let list = [

]

const helper = async (arr) => {
	return new Promise(async (resolve) => {
		let i=1;
		for(let item of arr) {
			console.log(`${i} of ${arr.length}`);
			await parseURL(item);
		}
		resolve(true);
	})
}
async function bronnIsFruity(arr) {
	await helper(arr);
}
bronnIsFruity(list);