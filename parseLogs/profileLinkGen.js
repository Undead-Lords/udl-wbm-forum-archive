

let count = 310;

let list = "\n";
for(let i=0;i<=310;i++) {
	list +=	`https://web.archive.org/web/20051224093807/http://www.undeadlords.net/forums/index.php?showuser=${i}\n`
	if(i % 10 === 0){list += `\n`}
}
require("fs").writeFileSync(`./listOfProfileURLs.md`, list);










