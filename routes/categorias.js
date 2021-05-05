const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria, crearCategoria } = require('../controllers.js/categorias');
const { existeCategoria } = require('../helpers/categoria-validators');

const { validarCampos, validarJWt, isAdminRol } = require('../middlewares');

const router = Router();

// obtener todas las categorias - public
router.get('/', [
    validarJWt,
    validarCampos
], obtenerCategorias);

// obtener categoria por id - public
router.get('/:id', [
    validarJWt,
    check('id', 'No es un ID valido de mongo').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], obtenerCategoria);

// crear categoria - private - cualquier persona con un token valido
router.post('/', [
    validarJWt,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

// actualizar una categoria - private - cualquier persona con un token valido
router.put('/:id', [
    validarJWt,
    isAdminRol,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], actualizarCategoria);

// borrar una categoria - admin
router.delete('/:id', [
    validarJWt,
    isAdminRol,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], borrarCategoria);


module.exports = router;