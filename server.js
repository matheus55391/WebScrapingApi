const http = require('http')
const app = require('./src/app')

const server = http.createServer(app)

server.listen(3001, ()=>{
    console.log(`Servidor inicializado`)
})