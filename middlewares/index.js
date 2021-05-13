const validarCampos = require('../middlewares/validar-campos');
const validarJWt = require('../middlewares/validar-jwt');
const validarRoles = require('../middlewares/validar-roles');
const validarArchivo =  require('../middlewares/validar-archivo');
 
module.exports = {
    ...validarCampos,
    ...validarJWt,
    ...validarRoles,
    ...validarArchivo
}