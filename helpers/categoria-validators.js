const { Categoria } = require('../models');

const existeCategoria = async(id) => {

    const existe = await Categoria.findById(id);   

    if (!existe) {
        throw new Error(`El id ${id} no existe`); 
    }

}

module.exports = {
    existeCategoria
}