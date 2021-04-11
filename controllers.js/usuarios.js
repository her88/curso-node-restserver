const { request, response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { validationResult } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const usuariosGet = async(req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };
    /*const usuarios = await Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite));

    const total = await Usuario.countDocuments(query); */
    
    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
       total,
       usuarios
    });
}

const usuariosPost = async(req = request, res = response) => {
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });   

    // encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    // guardar en base de datos
    await usuario.save();
    res.json(usuario);
}

const usuariosPut = async(req = request, res = response) => {
    const { id } = req.params;
    const { password, google, correo, ...resto} = req.body;

    if (password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);
    res.json(usuario);
}

const usuariosDelete = async(req = request, res = response) => {
    const { id } = req.params;
    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false });
    res.json({usuario});
}

const usuariosPatch = (req, res = response) => {
    
    res.json({
        msj: 'patch API - controlador'
    });
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}