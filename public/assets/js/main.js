
const   socket = io.connect(),
        formAgregarProducto = document.getElementById('additem'),
        btnAgregarProducto = document.getElementById('additembtn'),
        nombreitem = document.getElementById('nombre'),
        precioitem = document.getElementById('precio'),
        fotoitem = document.getElementById('foto'),
        inputUsername = document.getElementById('usr'),
        inputMensaje = document.getElementById('msg'),
        btnEnviar = document.getElementById('env')
        
const   renderHTMLmsg = (mensajes) => {
            return mensajes.map(mensaje => {
                return (`
                    <div class=" msg_container base_sen">
                        <div class="messages msg_sent">
                        <p>${mensaje.autor} - ${mensaje.date}</p>
                        <strong>${mensaje.texto}</strong>
                    </div>
                    </div>
                `)
            }).join(" ");
        },

        makeHtmlTable = (productos) =>  {
            return fetch('assets/views/rowtab.hbs')
            .then(rs => rs.text())
            .then(plantilla => {
                const template = Handlebars.compile(plantilla);
                const html = template({ productos })
                return html
            })
        }

socket.on('productos', productos => {
    makeHtmlTable(productos).then(html => {
        document.getElementById('productos').innerHTML = html
    })
});

socket.on('mensajes', mensajes => {
    const html = renderHTMLmsg(mensajes)
    document.getElementById('mensajes').innerHTML = html;
})

btnAgregarProducto.addEventListener('click', e => {

    if(nombreitem.value !== "" || precioitem.value !== "" || fotoitem.value !== ""){
    const producto = {
        title: nombreitem.value,
        price: precioitem.value,
        thumbnail: fotoitem.value
    }
    socket.emit('update', producto);
    formAgregarProducto.reset()}
})

btnEnviar.addEventListener('click', e => {
    e.preventDefault()
    const mensaje = { autor: inputUsername.value ? inputUsername.value : "Anonimo", texto: inputMensaje.value }
    socket.emit('nuevoMensaje', mensaje);
    inputMensaje.focus()
})

inputMensaje.addEventListener('input', () => {
    const hayTexto = inputMensaje.value.length
    btnEnviar.disabled = !hayTexto
})
