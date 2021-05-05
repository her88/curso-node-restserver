const { request, response } = require("express");

const isAdminRol = (req = request, res = response, next) => {

    if (!req.usuarioAuth) {
        return res.status(500).json({
            msj: `Se necesita validar el rol para realizar la accion`
        });
    }

    const { rol, nombre } = req.usuarioAuth;

    if (rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msj: `El usuario ${nombre} no tiene permisos para realizar esta accion`
        });
    }

    next();
}

const tieneROl = (...roles) => {
    return (req, res = response, next ) => {

        if (!req.usuarioAuth) {
            return res.status(500).json({
                msj: `Se necesita validar el rol para realizar la accion`
            });
        }

        const rolIncluido = roles.includes(req.usuarioAuth.rol);

        if (!rolIncluido) {
            return res.status(401).json({
                msj: `El servicio requiere uno de estos roles: ${roles}`
            });
        }

        next();
    }
}

module.exports = {
    isAdminRol,
    tieneROl
}