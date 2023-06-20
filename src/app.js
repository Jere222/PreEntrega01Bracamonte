import express  from "express";
import productsRouter from "./Routers/products.router.js"
import cartRouter from "./Routers/cart.router.js"
import __dirname from '../utils.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static(`${__dirname}/public`))

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

app.listen(8080, ()=>{
    console.log("escuchando en el servidor 8080");
});
