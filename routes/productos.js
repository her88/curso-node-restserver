const { Router } = require('express');
const { check } = require('express-validator');
const { getProduct, createProduct, updateProduct, removeProduct, getProducts } = require('../controllers.js/productos');
const { existeCategoria } = require('../helpers/categoria-validators');
const { existeProducto } = require('../helpers/producto-validators');

const { validarCampos, validarJWt, isAdminRol } = require('../middlewares');

const router = Router();

// obtener todas los productos - public
router.get('/', [
    validarJWt,
    validarCampos
], getProducts);

// obtener producto por id - public
router.get('/:id', [
    validarJWt,
    check('id', 'No es un id de Mongo').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], getProduct);

// crear producto - private - cualquier persona con un token valido
router.post('/', [
    validarJWt,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de Mongo').isMongoId(),
    check('categoria').custom(existeCategoria),
    validarCampos
], createProduct);

// actualizar un producto - private - cualquier persona con un token valido
router.put('/:id', [
    validarJWt,
    check('id', 'No es un id de Mongo').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], updateProduct);

// borrar un producto - admin
router.delete('/:id', [
    validarJWt,
    isAdminRol,
    check('id', 'No es un id de Mongo').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], removeProduct);


module.exports = router;