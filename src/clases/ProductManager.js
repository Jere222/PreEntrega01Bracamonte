import fs from "fs"

export default class ProductManager {
    
    constructor (path) {
        this.path = path;
    }
    
    getProducts = async () => {
        try {
            const products = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(products);
        } 
        catch {
            console.log("Archivo inexistente, creando...");
            fs.promises.writeFile(this.path, "[]");
            return [];
        }
    }


    addProduct = async (product) => {
        try {
            if(product.title && product.description && product.price && product.category && product.code && product.stock){
                let products = await fs.promises.readFile(this.path, 'utf-8');
                products = JSON.parse(products);
                const findCode = products.some(e => e.code === product.code);
                if(findCode) return {status: "error", error: "incomplete values"};
                const id = products.length? products[products.length-1].id+1 : 0;
                products.push({...product, ...{id: id}});
                fs.promises.writeFile(this.path, JSON.stringify(products)); 
                return {status: "success", payload: {...product, ...{id: id}}}
            }
            else return({status: "error", error: "incomplete fields"});
        } 
        catch(error){
            console.log(error)
            return({status: "error",  error: "failed request"});
        }
    }

    getProductById = async(id) => {
        try {
            let products = await fs.promises.readFile(this.path, 'utf-8');
            products = JSON.parse(products);
            const product = products.find(e => e.id == id);
            if(product) return {status: "success", payload: product};
            else return({status: "error", error: "non-existent product"});
        } 
        catch(error){
            console.log(error)
            return({status: "error",  error: "failed request"});
        }
    }

    updateProduct = async(product, id) => {
        try {
            let products = await fs.promises.readFile(this.path, 'utf-8');
            products = JSON.parse(products);
            const producto = products.find(e => e.id == id);
            if(producto&&!product.id){
                products[products.indexOf(producto)] = {...producto, ...product};
                fs.promises.writeFile(this.path, JSON.stringify(products)); 
                return {status: "success", payload: {...producto, ...product}}
            }
            else {
                return({status: "error", error: "non-existent product or try to change the id"});
            }
        } 
        catch(error){
            console.log(error)
            return({status: "error",  error: "failed request"});
        }
    }

    deleteProduct = async(id) => {
        try {
            let products = await fs.promises.readFile(this.path, 'utf-8');
            products = JSON.parse(products);
            const product = products.find(e => e.id == id);
            if(product){
                products.splice(products.indexOf(product), 1);
                fs.promises.writeFile(this.path, JSON.stringify(products)); 
                return({status: "success", state: "product removed, id: " + id});
            } else {
                return({status: "error", error: "non-existent product"});
            }
        } 
        catch(error){
            console.log(error)
            return({status: "error",  error: "failed request"});
        }
    }
}
