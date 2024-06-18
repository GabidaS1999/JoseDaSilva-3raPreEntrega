import supertest from "supertest";
import { expect } from "chai";



const requester = supertest('http://localhost:8080')

describe("Test Ecommerce app", () => {

    describe("Test cart api", () => {
        //TEST 01
        it("Buscar carritos: El Api GET /api/cart debe buscar todos los carritos", async ()=> {
        
            const result = await requester.get('/api/carts')


            expect(result.statusCode).is.eql(200)
            expect(result.body).to.be.an('array');
            expect(result.body.length).to.be.greaterThan(0);

        })


        //Test02
        it("Agregar productos al carrito", async () => {

            //THEN
            const cartId = '6666449411dbf25503be87a4'; 
            const productId = '65f785f1ff5eac1a146dfa53'; 
            const result = await requester.post(`/api/carts/${cartId}/products/${productId}`)

            //ASSERT
            expect(result.statusCode).is.eql(200)
            expect(result.body).to.have.property('products');

            const product = result.body.products.find(p => p._id === productId);
            expect(product).to.not.be.undefined;
        })

        //Test03
        it("Elimina todos los productos del carrito", async () => {

            //THEN
            const cartId = '6666449411dbf25503be87a4'; 

            const result = await requester.delete(`/api/carts/${cartId}`)

            //ASSERT
            expect(result.statusCode).is.eql(200)
            expect(result.text).to.equal('Carrito vaciado');

        })
    })


    describe("Test product api", () => {

        it("Crear producto: El Api POST /api/products debe crear un producto correctamente", function (done) {
            this.timeout(5000)
            //GIVEN
            const mockProduct = {
                title: "ProductTest02",
                description: "Test de producto",
                price: 100,
                thumbnails: "image/testimage",
                category: "TestCategory",
                code: "Abc1234",
                stock: 1000,
                id: 2
            }
            //THEN
            const result = requester.post("/api/products/").send(mockProduct)
            done();

            //ASSERT
            expect(result._data).to.ok.and.to.have.property('code')

        })


        //Test02
        it("Crear producto sin nombre: El Api POST /api/products debe retornar un estado HTTP 400 con error", async () => {
            //GIVEN
            const mockProduct = {
                description: "Test de producto",
                price: 100,
                thumbnails: "image/testimage",
                category: "TestCategory",
                code: "Abc1234",
                stock: 1000
            }
            //THEN
            const result = await requester.post("/api/products/").send(mockProduct)


            //ASSERT
            expect(result.statusCode).is.eql(400)
            expect(result).is.ok.and.to.have.property('error')
        })

        //Test03
        it("Error al borrar producto: El Api POST /api/products/delete no debe eliminar un producto correctamente ya que el id no corresponde al formato de Mongo", async () => {
            //GIVEN
            const mockProduct = {
                title: "ProductTest02",
                description: "Test de producto",
                price: 100,
                thumbnails: "image/testimage",
                category: "TestCategory",
                code: "Abc1234",
                stock: 1000,
                id: 2
            }
            //THEN
            const result = await requester.delete(`/api/products/delete/${mockProduct.id}`)
            //ASSERT
            expect(result.statusCode).is.eql(500)
            expect(result).is.ok.and.to.have.property('error')

        })



        //TestPrueba
        // it("Crear producto con imagen (Test con uploader): Debe poder crearse un prodcuto con la imagen", async ()=>{
        //     //GIVEN
        //     const mockProduct = {
        //         title: "ProductTest03",
        //         description: "Test de producto",
        //         price: 100,
        //         thumbnails: "image/testimage",
        //         category: "TestCategory",
        //         code: "Abc12345",
        //     }
        //     //THEN
        //     const result = await requester.post('/api/products/withimage')
        //         .field('title', mockProduct.title)
        //         .field('description', mockProduct.description)
        //         .field('price', mockProduct.price)
        //         .attach('thumbnails', '../public/images/perrito.jpg')
        //         .field('category', mockProduct.category)
        //         .field('code', mockProduct.code)

        //     console.log(result)
        //     //ASSERT
        //     // expect(result.statusCode).to.be.eql(201)
        //     // expect(result._body.payload.thumbnails).to.be.ok;
        // })
    })

    describe("Testing login and session with Cookie", () => {

        //Before
        before(function () {
            this.cookie;
            this.mockUser = {
                first_name: "Usuario de prueba 3",
                last_name: "Apellido de prueba 3",
                email: "correodeprueba3@gmail.com",
                password: "123Abz"
            }
        })

        //Test 01
        it("Test Registro Usuario: Debe poder registrar correctamente un usuario", async function () {
            //GIVEN

            //THEN
            const { statusCode } = await requester.post('/api/session/register').send(this.mockUser)
            //ASSERT
            expect(statusCode).is.eql(201)
        })


        //Test 02
        it("Test login Usuario: Debe poder hacer login correctamente con el usuario registrado previamente", async function () {
            //GIVEN
            const mockLogin = {
                email: this.mockUser.email,
                password: this.mockUser.password
            }
            //THEN
            const result = await requester.post('/api/jwt/login').send(mockLogin)
            const cookieResult = result.headers['set-cookie'][0]

            const cookieData = cookieResult.split("=")

            this.cookie = {
                name: cookieData[0],
                value: cookieData[1]
            }
            //ASSERT

            expect(result.statusCode).is.eql(200)
            expect(this.cookie.name).to.be.ok.and.eql('jwtCookieToken')
            expect(this.cookie.value).to.be.ok
        })

        //Test 03
        it("Test ruta protegida: Debe enviar la cookie que contiene el usuario y destructurarla correctamente", async function () {

            //THEN
            const { _body } = await requester.get("/api/session/current").set('Cookie', [
                `${this.cookie.name}=${this.cookie.value}`
            ])

            //ASSERT

            expect(_body.payload.email).to.be.ok.and.eql(this.mockUser.email)
        })





    })


})