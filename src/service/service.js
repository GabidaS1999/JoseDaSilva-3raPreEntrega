import ProductsService from "../dao/Db/products.service.js";

import ProductRepository from "./repository/product.repository.js"

//Instanciamos las clases
const productDao = new ProductsService();


export const productService = new ProductRepository(productDao);

