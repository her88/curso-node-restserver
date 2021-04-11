const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWt = async(req = request, res = response, next) => {

    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({
            msj: 'No esta autorizado - No hay token en la petición'
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const usuarioAuth = await Usuario.findById(uid);

        if (!usuarioAuth) {
            return res.status(401).json({
                msj: 'Token no valido - usuario no existe'
            });
        }

        if (!usuarioAuth.estado) {
            return res.status(401).json({
                msj: 'Token no valido - usuario con estado false'
            });
        }

        request.usuarioAuth = usuarioAuth;
        
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msj: 'Token no valido'
        });
    }

   

}

module.exports = {
    validarJWt
}