const { Router } = require('express');
const { check } = require('express-validator');
const { usuariosGet, usuariosPut, usuariosDelete, usuariosPatch, usuariosPost } = require('../controllers.js/usuarios');
const { rolValido, existEmail, existUserById } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.get('/', usuariosGet);

router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existUserById ),
    check('rol').custom( rolValido ),
    validarCampos 
], usuariosPut);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    check('password', 'La contraseña debe tener mas de 6 caracteres').isLength({min:6}),
    check('correo', 'El correo no es valido').isEmail(), 
    check('correo').custom( existEmail ),  
    // check('rol', 'No es un rol valido').isIn(['ADMIN_ROL','USER_ROL']),   
    check('rol').custom( rolValido ),
    validarCampos 
], usuariosPost);

router.delete('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existUserById ),
], usuariosDelete);

router.patch('/', usuariosPatch);

module.exports = router;