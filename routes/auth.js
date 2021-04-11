const { Router } = require('express');
const { check } = require('express-validator');
const { login } = require('../controllers.js/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/',[
    check('correo', 'El correo no es valido').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login);

module.exports = router;