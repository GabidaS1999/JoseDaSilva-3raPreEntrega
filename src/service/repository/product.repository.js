export default class ProductRepository {
    constructor(dao){
        this.dao = dao;
    }

    getAll = ()=>{
        return this.dao.getAll();
    }
    save = (product) =>{
        return this.dao.save(product)
    }
    getPorductById = (id)=>{
        return this.dao.getPorductById(id)
    }
    updateProduct = (id, update)=>{
        return this.dao.updateProduct(id, update);
    }
}