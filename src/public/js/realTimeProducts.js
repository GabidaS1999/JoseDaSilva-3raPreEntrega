const socket = io();
const lista = document.getElementById('lista-productos');

socket.on('products', data => {

    lista.innerHTML = '';

    data.forEach(product => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `Producto: ${product.title}<br>Descripcion: ${product.description}<br>Precio: $${product.price}<br>Stock:${product.stock}<br>Codigo: ${product.code}<br>Url imagen: ${product.thumbnails}<br><br>`;
        lista.appendChild(listItem);
    });
    socket.emit('products');
});

socket.on('newProduct', product => {
    console.log("Nuevo producto:", product);

  });


