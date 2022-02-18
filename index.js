const puppeteer = require('puppeteer');
const path = require('path');
const fs = require("fs")
const axios = require('axios');


function request (element) {
  try{
    return axios({
      url: element,
      method: "GET",
      responseType: "stream"
    });
  } catch(e) {
    console.log( 'errore: ' + e)
  }
}

(async () => {
    const browser = await puppeteer.launch({
        headless: false,

    });
    const page = await browser.newPage();
    await page.goto('https://www.oxfordlearnersbookshelf.com/');
    await page.click(".btn.btn-default.btn-nav.btn-sign-in");

    // Login
    await new Promise(r => setTimeout(r, 2000));

    await page.$eval('input#teach_email', el => {
        el.value = 'email'
    });
    await page.$eval('[type="password"]', el => {
        el.value = 'password'
    });
    await page.$eval('#teach_btn-login', el => {
        el.click()
    });

    console.log("wait 2")
    //await new Promise(r => setTimeout(r, 5000));
    await page.waitForSelector(".btn.btn-default.btn-nav.link-close")
    await page.click(".btn.btn-default.btn-nav.link-close");
    /*
       document.querySelector('[data-collection-title="Language for life B2 eBook"]', el =>{
        console.log(el);
        console.log(el.querySelector(".olb-book-overlay-icon.olb-book-open"))
    });
    */
    await page.$eval('[data-collection-title="Language for life B2 eBook"]', el => {
        el.querySelector(".olb-book-overlay-icon.olb-book-open").click();

    });
    await new Promise(r => setTimeout(r, 5000));
    await new Promise(r => setTimeout(r, 5000));
    const elementHandle = await page.waitForSelector('iframe#my_iframe.olb-viewer');
    const viewerFrame = await elementHandle.contentFrame();


    await new Promise(r => setTimeout(r, 10000));

    let pages = [];
    for (let i = 1; i <= 230; i++) {
        //await page.waitForSelector(".book-image-" + i);
        await viewerFrame.waitForSelector('[class^="book-image-"]');
        
        //const page_src = await page.$eval(".book-image-" + i, el => el.src);
        const page_src = await viewerFrame.$eval('[class^="book-image-"]', el => el.src);

        await viewerFrame.click(".prev-page-move-icon");
        pages.push(page_src);
        await new Promise(r => setTimeout(r, 300));

    }
    //fs.writeFileSync("./pages.json", JSON.stringify(pages));

    console.log(pages);
    download(pages);

    //await browser.close();
})();



async function download(urls){
    let i = 1;

    for(const url of urls) {
       const saveFile = await request(url);
       const file = i+".jpg";
       const download = fs.createWriteStream(path.join(__dirname, 'download', file));
       await new Promise((resolve, reject)=> {
          saveFile.data.pipe(download);
          download.on("close", resolve);
          download.on("error", console.error);
       });
       i++;
    }
  }

