const { request, response } = require('express');
const { ObjectId } = require('mongoose').Types;
const { Categoria, Producto, Usuario } = require('../models');

const coleccionesPermitidas = [
    'categorias',
    'productos',
    'roles',
    'usuarios'
];

const buscar = (req = request, res = response) => {

    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;

        default:
            res.status(500).json({
                msg: 'Se me olvido realizar esta busqueda'
            })
            break;
    }

}

const buscarCategorias = async (termino = '', res = response) => {

    const isMongoId = ObjectId.isValid(termino); // si es un mongoId sabemos que la bisqueda va por id

    if (isMongoId) {
        const usuario = await Categoria.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        })
    }

    const regex = new RegExp(termino, 'i');

    const categorias = await Categoria.find({ nombre: regex });

    res.json({
        results: categorias
    })

}

const buscarProductos = async (termino = '', res = response) => {

    const isMongoId = ObjectId.isValid(termino); // si es un mongoId sabemos que la busqueda va por id

    if (isMongoId) {
        const producto = await Producto.findById(termino);
        return res.json({
            results: (producto) ? [producto] : []
        })
    }

    const regex = new RegExp(termino, 'i');

    const productos = await Producto.find({ nombre: regex });

    // const productos = await Producto.find({ nombre: { $eq: 'MANAOS NARANJA' }}); funciona
    // const productos = await Producto.find({ precio: { $lt: 150 }});    menores que 150
    // const productos = await Producto.find({ precio: { $lte: 130 }}); // menor incluyendo 150
    // const productos = await Producto.find({ precio: { $gt: 129 }});  // mayor que 129   
    // const productos = await Producto.find({ precio: { $gte: 129 }}); // mayor incluyendo 129

    /*const productos = await Producto.find({
        precio: { $lte: 130 },
        nombre: 'AGUA MINERAL'
    });*/

    res.json({
        results: productos
    })

}

const buscarUsuarios = async (termino = '', res = response) => {

    const isMongoId = ObjectId.isValid(termino); // si es un mongoId sabemos que la bisqueda va por id

    if (isMongoId) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        })
    }

    const regex = new RegExp(termino, 'i');

    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });

    res.json({
        results: usuarios
    })

}

module.exports = {
    buscar
}