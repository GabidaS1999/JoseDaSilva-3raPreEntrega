import mongoose from "mongoose";
import ProductsService from "../../dao/Db/products.service.js";
import { expect } from "chai";



mongoose.connect(`mongodb+srv://josedasilva1999:Olivia2024@cluster0.elp8ja0.mongodb.net/ecommerce-test?retryWrites=true&w=majority&appName=Cluster0`)



describe('Testing Product Dao', ()=>{
    //before
    before(function(){
        this.productsService = new ProductsService()
    })
    //beforeach
    beforeEach(function(){
        this.timeout(5000) //tiempo de espera ya que estamos trabjando con DB
        mongoose.connection.collections.products.drop();
    })
    //it - test01
    it('El dao debe devolver los productos en formato de arreglo', async function(){
        //Given
        const emptyArray = []

        //Then
      const result = await this.productsService.getAll()
        //Asserts
        expect(result).to.be.deep.equal(emptyArray)
        expect(Array.isArray(result)).to.be.ok
        expect(Array.isArray(result)).to.be.equal(true)
    })
    //it - test02
    it('El dao debe agregar el producto correctamente', async function(){
        //Given
        const mockProduct = {
            title: "ProductTest02",
            description: "Test de producto",
            price: 100,
            thumbnails: "image/testimage",
            category: "TestCategory",
            code: "Abc1234",
            stock: 1000
        }

        //Then
      const result = await this.productsService.save(mockProduct)
    
        // console.log(`result -${result}`)

        //Asserts
    expect(result._id).to.be.ok
    })
    //it - test03

    //after
    //aftereach
    afterEach(function(){
        mongoose.connection.collections.products.drop();
    })





})