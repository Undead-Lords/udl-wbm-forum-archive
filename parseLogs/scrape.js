const puppeteer = require("puppeteer");

const addDashes =(date)=>{
	return `${date.substr(0,4)}-${date.substr(4,2)}-${date.substr(6,2)}`
}
const removeDashes =(date)=>{
	return date.replace(/-/g,'');
}

const parseURL = async (url) => {

	const wbmURL = url;
	const dateOfStamp = addDashes(wbmURL.slice(wbmURL.indexOf('web.archive.org/web/')+20, wbmURL.indexOf('web.archive.org/web/')+28));
	let imageSavePath = `../archive/timestamps/${dateOfStamp.substr(0,4)}/${dateOfStamp.substr(0,7)}/${removeDashes(dateOfStamp)}.png`;
	const imageStampURL = `https://github.com/Undead-Lords/udl-wbm-forum-archive/blob/main/${imageSavePath.substr(3)}`
	let backupSavePath = `../archive/backups/${dateOfStamp.substr(0,4)}/${dateOfStamp.substr(0,7)}/${removeDashes(dateOfStamp)}.html`;
	const backupURL = `https://github.com/Undead-Lords/udl-wbm-forum-archive/blob/main/${backupSavePath.substr(3)}`
	//dateOfActivity
	//description


	const browser = await puppeteer.launch()
	const page = await browser.newPage()



	await page.setViewport({width: 1280, height: 800})
	await page.goto(url)
	const html = await page.content();
	require("fs").writeFileSync(backupSavePath, html);
	//save screenshot
	await page.screenshot({path: imageSavePath, fullPage: true})
	//TODO: parse html for dates, descriptions
	//TODO: make backup


	await browser.close();

	//TODO: build json objects
};
parseURL('https://web.archive.org/web/20051224114258/http://www.undeadlords.net/forums/index.php?showuser=3');



