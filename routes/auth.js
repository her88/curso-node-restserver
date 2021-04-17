const { Router } = require('express');
const { check } = require('express-validator');
const { login, googelSignin } = require('../controllers.js/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/login',[
    check('correo', 'El correo no es valido').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login);

router.post('/google',[
    check('id_token', 'El id_token es nedesario').not().isEmpty(),
    validarCampos
], googelSignin);

module.exports = router;