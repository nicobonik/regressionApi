const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const app = express()
const port = 8080
const puppeteer = require('puppeteer')
const path = require('path');

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', (req, res) => {
	res.send(200);
})

app.post('/linear', (req, res) => {

  writeData(req.body);

  var a;
  var b;
  (async () => {
    const browser = await puppeteer.launch({args: ['--no-sandbox']});
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'linear.html')}`);
    await page.screenshot({path: 'linear.png'});
	  await sleep(1500);
    const aRaw = await page.$("#m");
    const aText = await page.evaluate(element => element.textContent, aRaw);
    const bRaw = await page.$("#b");
    const bText = await page.evaluate(element => element.textContent, bRaw);
    a = parseFloat(aText);
    b = parseFloat(bText);  
    await browser.close();

    let output = {"m": a, "b": b}

    res.send(output);
  })();

})

app.post('/quadratic', function(req, res) {

  writeData(req.body);

  var a;
  var b;
  var c;

  (async () => {
    const browser = await puppeteer.launch({args: ['--no-sandbox']});
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'quadratic.html')}`);
    await page.screenshot({path: 'quadratic.png'});
	  await sleep(1500);
    const aRaw = await page.$("#a");
    const aText = await page.evaluate(element => element.textContent, aRaw);
    const bRaw = await page.$("#b");
    const bText = await page.evaluate(element => element.textContent, bRaw);
    const cRaw = await page.$("#c");
    const cText = await page.evaluate(element => element.textContent, cRaw);
    a = parseFloat(aText);
    b = parseFloat(bText);
    c = parseFloat(cText);
  
    await browser.close();

    let img = base64_encode('quadratic.png');

    let output = {"a": a, "b": b, "c": c, "img": img}

    res.send(output);
  })();


})

app.post('/exponential', function(req, res) {
  
  writeData(req.body);

  var a;
  var b;

  (async () => {
    const browser = await puppeteer.launch({args: ['--no-sandbox']});
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'exponential.html')}`);
    await page.screenshot({path: 'exponential.png'});
	  await sleep(1500);
    const aRaw = await page.$("#a");
    const aText = await page.evaluate(element => element.textContent, aRaw);
    const bRaw = await page.$("#b");
    const bText = await page.evaluate(element => element.textContent, bRaw);
    a = parseFloat(aText);
    b = parseFloat(bText);
  
    await browser.close();

    let img = base64_encode('exponential.png');

    let output = {"a": a, "b": b, "img": img}

    res.send(output);
  })();

})

app.post('/custom', function(req, res) {
  
  const xList = JSON.parse('[' + req.body.xList.split(",") + ']');
  const yList = JSON.parse('[' + req.body.yList.split(",") + ']');
  const latex = req.body.latex;

  const regex = /[^a-z]/gi;
  const params = latex.replace(regex, '').split("x").join('').split("y").join('').split("");

  let json = {"xList": xList, "yList": yList, "latex": latex, "params": params}

  fs.writeFileSync('data.js', "data = '" + JSON.stringify(json) + "';", (err) => {
    // check if there is error
    if (err) throw err;
  });

  (async () => {
    const browser = await puppeteer.launch({args: ['--no-sandbox']});
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'custom.html')}`);
    await page.screenshot({path: 'custom.png'});

	  await sleep(3000);
    let data = {};

    for (let i = 0; i < params.length; i++) {
      const element = params[i];
      const raw = await page.$('#' + element);
      const text = await page.evaluate(element => element.textContent, raw);
      data[element] = parseFloat(text);
    }

    let img = base64_encode('custom.png');
    data["img"] = img;

    res.send(data)
  })();


})

function writeData(body) {

  const xList = JSON.parse('[' + body.xList.split(",") + ']');
  const yList = JSON.parse('[' + body.yList.split(",") + ']');

  let json = {"xList": xList, "yList": yList}

  fs.writeFileSync('data.js', "data = '" + JSON.stringify(json) + "';", (err) => {
    // check if there is error
    if (err) throw err;
  });
}

function base64_encode(file) {
  // read binary data
  var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return new Buffer(bitmap).toString('base64');
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})
