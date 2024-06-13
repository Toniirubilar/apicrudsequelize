const {Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('parcialbackend', 'root', 'tonkee2', {
    host: 'localhost',
    dialect: 'mariadb'
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log("Conexion completa con la base de datos");
    } catch (error) {
        console.log("error", error)
    }
})();

const producto = sequelize.define('producto', {
    id_producto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    precio: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    categoria: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    
}, {
    tableName: 'productos',
    timestamps: false
});


//middlew
const express = require('express');
const app = express();
const port = 3000;
const morgan = require('morgan')
const cors = require('cors')
app.use(express.json());
app.use(morgan());
app.use(cors());


app.get('/', (req, res) => {
    res.status(200).json({
        ok:true,
        msj: "Accediendo a la APi"
    })
});


//endpoit para crear un nuevo producto
app.post('/productos/crear', async (req, res) => {
    const { nombre, precio, cantidad, categoria } = req.body;
    console.log(req.body)
    try {
        const newProducto = await producto.create({
            nombre,
            precio,
            cantidad,
            categoria
        });
        res.status(201).json(newProducto)
    } catch (error) {
        res.status(500).json({error: "Error al crear el producto"});
    }
});



//endpoit para mostrar todos los productos
app.get('/productos', async (req, res) => {
    try {
        res.status(200).json({
            ok:true,
            data: await producto.findAll(),
            msj: "Estos son todos los productos"
        })
    } catch (error) {
        res.status(404).json({error: "No hay productos"})
    }
});


//endpoit para buscar un producto por id
app.get('/productos/buscar', async (req, res) => {
    const { query } = req;
    const { id } = query;
    const busqueda = await producto.findByPk(id)

    if (busqueda !== null) res.status(200).json({
        ok:true,
        data: busqueda
    })
    else res.status(404).json({
        ok:false,
        msj: "El producto no existe"
    })
});


//endpoit para actualizar un producto por id
app.put('/productos/update', async (req, res) => {
    const { query } = req;
    const { id } = query;
    const { nombre, precio, cantidad, categoria } = req.body;

    try {
        const updateProducto = await producto.findByPk(id);
        if (!updateProducto) {
            return res.status(404).json({error: "Producto no encontrado"})
        }

        updateProducto.nombre = nombre;
        updateProducto.precio = precio;
        updateProducto.cantidad = cantidad;
        updateProducto.categoria = categoria;

    await updateProducto.save();

    res.status(200).json(updateProducto)
    } catch (error) {
        res.status(500).json({error: "Error al actualizar el producto"})
    }
});

//endpoit para eliminar un producto por id
app.delete('/productos/eliminar', async (req, res) => {
    const { query } = req;
    const { id } = query;

    try {
        const deleteProducto = await producto.findByPk(id)

        if(!deleteProducto) {
            res.status(404).json({error: "Producto no encontrado"})
        }

        await deleteProducto.destroy();
        res.status(200).json({msj:"Producto eliminado correctamente"})
    } catch (error) {
        res.status(500).json({error: "Error al eliminar el producto"})
    }
});


app.get('/productos/ordenados', async (req,res) =>{
    const productos = await producto.findAll();
    
    const productosOrd = productos.sort((a, b) => a.dataValues.nombre.localeCompare(b.dataValues.nombre));
    res.status(200).json(productosOrd);
});


app.get('/productos/filtrados', async (req, res) => {
    let productos = await producto.findAll();
    
    try {
        productoFiltr = productos.filter(p=>p.dataValues.precio>=valor)
        
        res.status(200).json(productoFiltr);
    } catch (error) {
        res.status(500).json({error: "No hay productos para filtrar"})
    }
    

});

app.listen(port, () =>{
    console.log(`Servidor escuchando en el puerto ${port}`)
})