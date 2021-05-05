const { Producto } = require('../models');

const existeProducto = async(id) => {

    const existe = await Producto.findById(id);

    if (!existe) {
        throw new Error(`El id ${id} no existe`);
    }

}

module.exports = {
    existeProducto
}
