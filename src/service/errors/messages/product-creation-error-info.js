export const generateProductErrorInfo = (product) =>{
    return `Una o mas propiedades fueron enviadas incompletas o no son validas.
    Lista de propiedades requeridas:
    ->title: type String. recibido ${product.title}
    ->price: type Number, recibido: ${product.price}
    ->stock: type Number, recibido: ${product.stock}`;
}