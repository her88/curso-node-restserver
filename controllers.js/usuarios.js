const { request, response } = require('express');

const usuariosGet = (req = request, res = response) => {

    const { a, b, c = 'no se envio'} = req.query;

    res.json({
        msj: 'get API - controlador',
        a,
        b,
        c
    });
}

const usuariosPut = (req = request, res = response) => {

    const { id } = req.params;

    res.json({
        msj: 'put API - controlador',
        id
    });
}

const usuariosPost = (req = request, res = response) => {

    const { nombre, edad} = req.body;

    res.json({
        msj: 'post API - controlador',
        nombre,
        edad
    });
}

const usuariosDelete = (req = request, res = response) => {

    const { id } = req.params;

    res.json({
        msj: 'delete API - controlador',
        id
    });
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