//const imagesToPdf = require("images-to-pdf")
const imgToPDF = require('image-to-pdf');
const fs = require("fs");
let pages = [];
for(let i = 1; i <= 232;i++){
    if(i !== 212)
    pages.push("./download/"+i+".jpg");

}

/*const init = async ()=>{
await imagesToPdf(pages, "./inglese_b2.pdf");
} 

init()*/
imgToPDF(pages, 'A4')
 .pipe(fs.createWriteStream("./inglese_b2_.pdf"));