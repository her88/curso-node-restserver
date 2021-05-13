const Role = require('../models/role');
const Usuario = require('../models/usuario');

const rolValido = async(rol = '') => {
    const existeRol = await Role.findOne({rol});
    if (!existeRol) {
        throw new Error(`El rol ${rol} no esta registrado en la base de datos`);
    }
}

const existEmail = async(correo = '') => {
    const exist = await Usuario.findOne({correo});
    if (exist) {
        throw new Error(`El correo: ${correo}, ya esta registrado`);        
    }
}

const existUserById = async(id) => {
    const exist = Usuario.findById(id);
    if (!exist) {
        throw new Error(`El id ${id} no existe`);
    }
}

const coleccionesPermitidas = async(coleccion, colecciones = []) => {
    const incluida = colecciones.includes(coleccion);

    if (!incluida) {
        throw new Error(`La coleccion ${coleccion} no es permitida, ${colecciones}`);
    }

}

module.exports = {
    rolValido,
    existEmail,
    existUserById,
    coleccionesPermitidas
}