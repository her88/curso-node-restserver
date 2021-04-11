const { request, response } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generateJWT } = require('../helpers/json-web-token');

const login = async(req = request, res = response) => {

    try {

        const { correo, password } = req.body;
        const usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            return res.status(400).json({
                msj: 'Correo o contraseña incorrectos - correo'
            });
        }

        // Si el usuario esta activo
        if (!usuario.estado) {
            return res.status(400).json({
                msj: 'Correo o contraseña incorrectos - estado'
            });
        }

        // Verificar contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msj: 'Correo o contraseña incorrectos - password'
            });
        }

        // Generar JWT
        const token = await generateJWT(usuario.id);

        res.json({
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msj: 'Ocurrio un error, por favor comuniquese con su administrador'
        })
    }   
}

module.exports = {
    login
}