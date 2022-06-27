const puppeteer = require('puppeteer');
const morgan = require('morgan');
const express = require('express')
const app = express()
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(morgan('dev'))
app.get('/favicon.ico', (req, res) => res.status(204));


app.get('/script', async (req, res, next)=>{
        const browser = await puppeteer.launch({headless: false, args: ['--no-sandbox'],});
        try{
            const url = req.body.url
            const script = req.body.script
            const page = await browser.newPage();
            await page.goto(url, {waitUntil: 'networkidle0'})
            //await page.reload();
            //const html = await page.content(); // serialized HTML of page DOM.
            //await page.screenshot({path: 'screenshot.png'});
            const value = await page.evaluate(script);
            return await res.send(value);

        }
        catch (e) {
            next(e);
        }   
        finally {
            browser.close();
        }
})  

app.use((req, res, next) =>{ 
    const error = new Error('Não encontrado')
    error.statusCode = 404
    next(error)
})

app.use((error, req, res, next) =>{
    res.status(error.statusCode || 500)
    return res.json({
        erro:{
            message: error.message
        }
    })
})

module.exports = app