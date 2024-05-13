export const addProductErrorInfo = (product) =>{
    return `Una o mas propiedades fueron enviadas incompletas o no son validas.
    Lista de propiedades requeridas:
    ->stock: type Number, recibido: ${product.stock}`;
}