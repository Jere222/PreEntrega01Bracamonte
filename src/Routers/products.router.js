import { Router } from "express";
import { uploader } from "../../utils.js";
import ProductManager from "../clases/ProductManager.js"

const router = Router();
const pm = new ProductManager("./src/archivos/ProductList.json");

router.get("/", async (req, res) => {
    try {
        const limite = req.query.limit, aux = await pm.getProducts();
        let productos = [];

        if(limite<aux.length){
            for (let i = 0; i < limite; i++) {
                productos.push(aux[i]);
            }
        } else {
            productos = aux;
        } 
        res.send({status: "success", payload: productos})
    }
    catch(error) {
        console.log(error);
        res.status(500).send("server error");
    }
});

router.get("/:pid", async (req, res) => {
    try {
        const id = req.params.pid;
        res.send(await pm.getProductById(id)) 
    }
    catch(error) {
        console.log(error);
        res.status(500).send("server error");
    }
});

router.post("/",  uploader.array('thumbnail'), async (req, res) => {
    try {
        const product = req.body;
        const files = req.files, filenames = [];
        if (files) {
            for (let i = 0; i < files.length; i++) {
                filenames.push(files[i].filename);
            }
            product.thumbnail = filenames;
        }
        res.send(await pm.addProduct(product));

    } catch (error) {
        console.log(error);
        res.status(500).send("server error");
    }
});

router.put("/:pid", async (req, res) => {
    try {
        const id = req.params.pid, product = req.body;
        res.send(await pm.updateProduct(product, id));
    } catch (error) {
        
    }
    
});

router.delete("/:pid", async (req, res) => {
    try {
        const id = req.params.pid;
        res.send(await pm.deleteProduct(id));
    } 
    catch (error) {
        console.log(error);
        res.status(500).send("server error");
    }
});


export default router;