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
    tipo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    aroma: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    precio: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'productos',
    timestamps: false
});

const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        ok: true,
        msj: "Hola esta es la API de Rubilar"
    })
});

app.get('/productos', async (req, res) => {
    try {
        res.status(200).json({
            ok:true,
            data: await producto.findAll(),
            msj: "Estos son todos los productos"
        })
    } catch (error) {
        console.log(error)
        res.status(404).json({error: "No hay productos cargados en el sistema"})
    }
});

app.get('/productos/buscar', async (req, res) => {
    const { query } = req;
    const { id, aroma, tipo } = query;
    if (id !== undefined) {
        const busqueda = await producto.findByPk(id)

        if(busqueda !== null ) res.status(200).json({
            ok:true,
            busqueda
        })
        else res.status(404).json({
            ok:false,
            msj: "el producto no existe"
        })
    }
    else {
        if (aroma !== undefined) {
            const busqueda = await producto.findOne({ where: { aroma: aroma } });
    
            if(busqueda !== null ) res.status(200).json({
                ok:true,
                busqueda
            })
            else res.status(404).json({
                ok:false,
                msj: "el producto no existe"
            })
        }
        else if (tipo !== undefined) {
            const busqueda = await producto.findOne({ where: { tipo: tipo } });
    
            if(busqueda !== null ) res.status(200).json({
                ok:true,
                busqueda
            })
            else res.status(404).json({
                ok:false,
                msj: "el producto no existe"
            })
        }

        else res.status(404).json({
            ok:false,
            msj: "No mandaste nada"
        })
    }
    
});


app.listen(port, () =>{
    console.log(`Servidor escuchando en el puerto ${port}`)
})