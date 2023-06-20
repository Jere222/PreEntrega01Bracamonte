import fs from "fs"

export default class CartManager {
    
    constructor (pathCarts, pathProducts) {
        this.pathProducts = pathProducts;
        this.pathCarts = pathCarts;
    }

    createCart = async () => {
        try {
            let carts = await fs.promises.readFile(this.pathCarts, 'utf-8');
            carts = JSON.parse(carts);
            const id = carts.length? carts[carts.length-1].id+1 : 0;
            carts.push({id: id, products: []});
            fs.promises.writeFile(this.pathCarts, JSON.stringify(carts)); 
            return {status: "success", payload: {id: id, products: []}}
        } 
        catch {
            console.log("Archivo inexistente, creando...");
            const carts = [{id: 0, products: []}]
            fs.promises.writeFile(this.pathCarts, JSON.stringify(carts));
            return {status: "success", payload: {id: 0, products: []}}
        }
    }
    
    addProduct = async (cid, pid) => {
        try {
            let carts = await fs.promises.readFile(this.pathCarts, 'utf-8');
            carts = JSON.parse(carts);
            let products = await fs.promises.readFile(this.pathProducts, 'utf-8');
            products = JSON.parse(products);
            const cart = carts.find(e => e.id == cid);
            const findProduct1 = products.some(e => e.id == pid)
            if(cart&&findProduct1){
                const cartPos = carts.indexOf(cart), findProduct2 = cart.products.some(e => e.id == pid);
                let productPos;
                if(findProduct2){
                    productPos = cart.products.indexOf(cart.products.find(e => e.id == pid));
                    cart.products[productPos].quantity++;
                } else {
                    productPos = cart.products.length;
                    cart.products.push({id: pid, quantity: 1});
                }
                carts[cartPos] = cart;
                fs.promises.writeFile(this.pathCarts, JSON.stringify(carts)); 
                return {status: "success", payload: cart.products[productPos]}
            }
            else {
                return {status: "error", error: "non-existent product or cart"};
            }
        }
        catch(error) {
            console.log(error);
            return({status: "error",  error: "failed request"});
        }
    }

    getProductsByCartId = async (cid) => {
        try {
            let carts = await fs.promises.readFile(this.pathCarts, 'utf-8');
            carts = JSON.parse(carts);
            const cart = carts.find(e => e.id == cid), obj = {productos: []};
            if(cart){
                let products = await fs.promises.readFile(this.pathProducts, 'utf-8');
                products = JSON.parse(products);
                for (let i = 0; i < cart.products.length; i++) {
                    const product = products.find(e => e.id == cart.products[i].id);
                    product.quantity = cart.products[i].quantity;
                    obj.productos.push(product);
                }
                return {status: "success", payload: obj.productos};
            } 
            else {
                return {status: "error", error: "non-existent cart"};
            }
        } catch (error) {
            console.log(error);
            return({status: "error",  error: "failed request"});
        }

    }
}