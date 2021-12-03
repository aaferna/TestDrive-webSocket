const express = require('express')

const { Server: HttpServer } = require('http')
const { Server: Socket } = require('socket.io')

const ContenedorMemoria = require('../modules/productstore.js')
const ContenedorArchivo = require('../modules/filemanager.js')


const app = express()
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)

const productosApi = new ContenedorMemoria()
const mensajesApi = new ContenedorArchivo('history.json')



io.on('connection', async socket => {
    socket.emit('productos', productosApi.listarAll());
    socket.on('update', producto => {
        productosApi.guardar(producto)
        io.sockets.emit('productos', productosApi.listarAll());
    })
    socket.emit('mensajes', await mensajesApi.listarAll());
    socket.on('nuevoMensaje', async mensaje => {
        mensaje.date = new Date().toLocaleString()
        await mensajesApi.guardar(mensaje)
        io.sockets.emit('mensajes', await mensajesApi.listarAll());
    })
});


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

const PORT = process.env.PORT || 8080
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Iniciado en ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Ups! ${error}`))
