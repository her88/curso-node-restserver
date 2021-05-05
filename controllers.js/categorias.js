const { request, response } = require('express');
const { Categoria } = require('../models');

// paginado - total - populate
const obtenerCategorias = async (req = request, resp = response) => {
    try {
        const { limite = 5, desde = 0 } = req.query;
        const query = { estado: true };

        // const categorias = await Categoria.find().populate('usuario', 'nombre');

        const [total, categorias] = await Promise.all([
            Categoria.countDocuments(query),
            Categoria.find(query)
                .populate('usuario', 'nombre')
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        if (categorias.length === 0) {
            return resp.status(200).json({
                msg: 'No se encontraron categorias para mostrar'
            });
        }

        resp.json({
            total,
            categorias
        });

    } catch (error) {
        console.log(error)
        throw new Error('Ocurrio un error al consultar las categorias');
    }

}

// populate - {}
const obtenerCategoria = async (req = request, resp = response) => {
    try {
        const { id } = req.params;
        const categoria = await Categoria.findById(id).populate('usuario', ['nombre', 'correo']);
        resp.status(200).json(categoria);
    } catch (error) {
        throw new Error(`Ocurrio un error al consultar la categoria con id ${id}`);
    }

}

const crearCategoria = async (req = request, resp = response) => {
    try {
        const nombre = req.body.nombre.toUpperCase();
        const categoriaDB = await Categoria.findOne({ nombre });

        if (categoriaDB) {
            resp.status(400).json({
                msg: `La categoria ${categoriaDB.nombre} ya existe`
            });
        }

        const categoria = new Categoria({
            nombre: nombre,
            usuario: req.usuarioAuth._id
        });

        await categoria.save();
        // se suele enviar un 201 cuando se guarda exitosamente
        resp.status(201).json(categoria);
    } catch (error) {
        throw new Error(`Ocurrio un error al crear la categoria`);
    }

}

const actualizarCategoria = async (req = request, resp = response) => {
    try {
        const { id } = req.params;
        const { estado, usuario, ...data } = req.body;

        data.nombre = data.nombre.toUpperCase();
        data.usuario = req.usuarioAuth._id;

        const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true});

        resp.status(200).json(categoria);

    } catch (error) {
        throw new Error(`Ocurrio un error al actualizar la categoria con id ${id}`);
    }

}

const borrarCategoria = async (req = request, resp = response) => {
    try {
        const { id } = req.params;
        const categoria = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });

        resp.status(200).json(categoria);

    } catch (error) {
        throw new Error(`Ocurrio un error al eliminar la categoria con id ${id}`);
    }

}

module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}