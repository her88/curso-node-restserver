const { Router } = require('express');
const { check }  = require('express-validator');
const { crearArchivo, actualizarImgCloudinary, getImagen } = require('../controllers.js/uploads');
const { coleccionesPermitidas } = require('../helpers');

const { validarCampos, validarArchivo } = require('../middlewares');

const router = Router();

router.post('/', validarArchivo ,crearArchivo);


router.put('/:coleccion/:id', [
    check('id', 'No es un id de Mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] )),
    validarArchivo,
    validarCampos
], actualizarImgCloudinary);

router.get('/:coleccion/:id', [
    check('id', 'No es un id de Mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] )),
    validarCampos
], getImagen);

module.exports = router;