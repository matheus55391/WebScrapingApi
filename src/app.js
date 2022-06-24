const puppeteer = require('puppeteer');
const morgan = require('morgan');
const express = require('express')
const app = express()
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(morgan('dev'))
app.get('/favicon.ico', (req, res) => res.status(204));


app.get('/script', async (req, res, next)=>{
        try{
            const url = req.body.url
            const script = req.body.script
            const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox'],});
            const page = await browser.newPage();
            await page.goto(url)
            const value = await page.evaluate(script);
            await browser.close();
            return await res.send(value);

        }catch (e) {
            next(e);
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