const dbValidators = require('./db-validators');
const categoriaValidator = require('./categoria-validators');
const googleVerifi = require('./googel-verify');
const jsonWebToken = require('./json-web-token');
const productoValidator = require('./producto-validators');
const subirArchivo = require('./subir-archivo');

module.exports = {
    ...dbValidators,
    ...categoriaValidator,
    ...googleVerifi,
    ...jsonWebToken,
    ...productoValidator,
    ...subirArchivo
}