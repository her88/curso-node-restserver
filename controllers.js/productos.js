const { request, response } = require('express');
const { Producto } = require('../models');

const getProducts = async(req = request, resp = response) => {
    try {
        const { limite = 5, desde = 0 } = req.query;
        const query = { estado: true };

        // const categorias = await Categoria.find().populate('usuario', 'nombre');

        const [total, productos] = await Promise.all([
            Producto.countDocuments(query),
            Producto.find(query)
                .populate('usuario', 'nombre')
                .populate('categoria', 'nombre')
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        if (productos.length === 0) {
            return resp.status(200).json({
                msg: 'No se encontraron productos para mostrar'
            });
        }

        resp.json({
            total,
            productos
        });

    } catch (error) {
        console.log(error)
        throw new Error('Ocurrio un error al consultar los productos');
    }
}

const getProduct = async(req = request, resp = response) => {
    try {
        const { id } = req.params;

        const producto = await Producto.findById(id)
            .populate('usuario', ['nombre', 'correo'])
            .populate('categoria', 'nombre');

        resp.status(200).json(producto);
    } catch (error) {
        throw new Error(`Ocurrio un error al consultar el producto con id ${id}`);
    }
}

const createProduct = async(req = request, resp = response) => {
    try {

        const { estado, usuario, ...body } = req.body;

        const productoDB = await Producto.findOne({nombre: body.nombre.toUpperCase()});

        if (productoDB) {
            return resp.status(400).json({
                msg: `El producto ${productoDB.nombre} ya existe`
            })
        }

        const data = {
            ...body,
            nombre: body.nombre.toUpperCase(),
            usuario: req.usuarioAuth._id
        }

        const producto = new Producto(data);

        await producto.save();

        resp.json(producto);
        
    } catch (error) {
        console.log(error);
        throw new Error(`Ocurrio un error al crear el producto`);
    }
}

const updateProduct = async(req = request, resp = response) => {
    try {
        const { id } = req.params;
        const { estado, usuario, ...data } = req.body;

        data.nombre = data.nombre.toUpperCase();
        data.usuario = req.usuarioAuth._id;

        const producto = await Producto.findByIdAndUpdate(id, data, { new: true});

        resp.status(200).json(producto);

    } catch (error) {
        throw new Error(`Ocurrio un error al actualizar el producto con id ${id}`);
    }

}

const removeProduct = async(req = request, resp = response) => {
    try {
        const { id } = req.params;
        const producto = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });

        resp.status(200).json(producto);

    } catch (error) {
        throw new Error(`Ocurrio un error al eliminar el producto con id ${id}`);
    }
}

module.exports = {
    getProduct,
    getProducts,
    createProduct,
    updateProduct,
    removeProduct
}