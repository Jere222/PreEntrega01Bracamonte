import { Router } from "express";
import CartManager from "../clases/CartManager.js"

const router = Router();

const cm = new CartManager("./src/archivos/CartList.json", "./src/archivos/ProductList.json");

router.post("/", async (req, res) => {
    try {
        res.send(await cm.createCart());
    } catch (error) {
        console.log(error);
        res.status(500).send("server error");
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cid = req.params.cid, pid = req.params.pid;
        res.send(await cm.addProduct(cid, pid));
    } catch (error) {
        console.log(error);
        res.status(500).send("server error");
    }
});

router.get("/:cid", async (req, res) => {
    try {
        const cid = req.params.cid;
        res.send(await cm.getProductsByCartId(cid));
    } 
    catch (error) {
        console.log(error);
        res.status(500).send("server error");
    }
})

export default router;