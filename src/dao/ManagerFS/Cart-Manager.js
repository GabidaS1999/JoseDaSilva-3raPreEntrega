import { promises as fsPromises } from 'fs';
import { fsync } from 'fs';


class CartManager{
    carts;
    cartsFileName;
    cartsDirName;
    filesystem;
    constructor(){
        this.carts = new Array()
        this.filesystem = fsPromises;
        this.cartsDirName = "./src/files";
        this.cartsFileName = `${this.cartsDirName}/cart.json`
    }

    getCartsList= async()=>{
        try {
            await fsPromises.mkdir(this.cartsDirName, { recursive: true });
            let cartFile;
            try {
                cartFile = await fsPromises.readFile(this.cartsFileName, "utf-8");
            } catch (readError) {
                
                productsFile = "[]";
            }
            this.carts = JSON.parse(cartFile);
            console.log("Carritos: ");
            console.log(this.carts);

            return this.carts;

        } catch (error) {
            console.error(`Error buscando los productos, verifique la direccion: ${this.cartsFileName}, 
            detalle del error: ${error}`);
        throw Error(`Error buscando los productos, verifique la direccion: ${this.cartsFileName},
         detalle del error: ${error}`);
        }
    }
    createNewCart = async () => {
        try {
            const existingCarts = await this.getCartsList();
            const numRandom = Math.floor(Math.random() * 100 + 1);
            const cart = { id: numRandom, products: [] };
    
          
            if (existingCarts.some(c => c.id === cart.id)) {
                return { success: false, msg: 'El carrito ya existe' };
            }
    
            const updatedCarts = [...existingCarts, cart];
            await fsPromises.writeFile(this.cartsFileName, JSON.stringify(updatedCarts, null, 2, '\t'));
            return { success: true, msg: 'Carrito creado', carts: updatedCarts };
        } catch (error) {
            console.error(`Error al crear el carrito: ${error}`);
            return { success: false, msg: 'Hubo un error al crear el carrito' };
        }
    }
    
    

    addProductCart = async(cid, pid)=>{
        const parseList = await this.getCartsList();
        const cart = parseList.find(c=>c.id=== parseInt(cid));
        if (!cart) {
            return{success:false, msg:'Carrito de comprar no existe'};
        }
        const productCart = cart.products.find ((p)=>p.productId === pid);
        if (productCart) {
            productCart.quantity +=1;
        }else{
            cart.products.push({productId:pid, quantity:1})
        }
        await fsPromises.writeFile(this.cartsFileName, JSON.stringify(this.carts, null, 2, '\t'))
        return {success:true, msg:'Producto agregado', cart}
    }

    getCartById = async(cid) =>{
        const parseList = await this.getCartsList();
        const result = parseList.find((c)=>c.id === cid)
        return{success:true, msg:`Datos solicitados: ${result}`}
    }
}
export default CartManager;