const validarCampos = require('../middlewares/validar-campos');
const validarJWt = require('../middlewares/validar-jwt');
const validarRoles = require('../middlewares/validar-roles');
 
module.exports = {
    ...validarCampos,
    ...validarJWt,
    ...validarRoles
}