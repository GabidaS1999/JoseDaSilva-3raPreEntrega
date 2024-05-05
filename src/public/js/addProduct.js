const buttons = document.querySelectorAll('.buttonAdd');
buttons.forEach(button => {
    button.addEventListener('click', function(event) {
        const productId = event.target.getAttribute('data-id');
        const cartId = localStorage.getItem('cartId');

        console.log('Product ID:', productId);  // Debugging output
        console.log('Cart ID:', cartId);        // Debugging output

        if (!productId || !cartId) {
            console.error('Product ID or Cart ID is missing!');
            return; 
        }

        fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(result => {
            if (result.status === 200) {
                console.log('Producto añadido al carrito exitosamente');
            } else {
                console.error('Error al añadir producto al carrito');
                result.json().then(json => console.error(json.message));
            }
        }).catch(error => {
            console.error('Error en la red o servidor:', error);
        });
    });
});








// document.addEventListener('DOMContentLoaded', function() {
//     const buttons = document.querySelectorAll('.buttonAdd');
//     buttons.forEach(button => {
//         button.addEventListener('click', function(event) {
//             const productId = event.target.getAttribute('data-id');
//             cartService.addProductToCart(productId)
//         });
//     });
// });

// function addToCart(productId) {
//     // Aquí se realiza la llamada AJAX para añadir el producto al carrito
//     console.log("Añadiendo al carrito el producto con ID:", productId);
    
//     // Ejemplo de cómo podrías manejar esto con una llamada fetch si tienes un endpoint de API
//     fetch('/api/carts/:cid/products/:pid', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ productId: productId })
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log('Producto añadido:', data);
//         // Aquí puedes actualizar la interfaz de usuario para reflejar el cambio, por ejemplo:
//         alert('Producto añadido al carrito!');
//     })
//     .catch(error => {
//         console.error('Error añadiendo el producto al carrito:', error);
//     });
// }
