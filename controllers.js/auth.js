const { request, response } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generateJWT } = require('../helpers/json-web-token');
const { googelVerify } = require('../helpers/googel-verify');


const login = async (req = request, res = response) => {

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

const googelSignin = async (req = request, res = response) => {

    const { id_token } = req.body;

    try {

        const { nombre, correo, img } = await googelVerify(id_token);

        let usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            const data = {
                nombre,
                password: ':P',
                correo,
                imagen: img,
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        if (!usuario.estado) {
            return res.status(401).json({
                msj: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generar JWT
        const token = await generateJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (error) {
        res.status(400).json({
            msj: 'Token de google no es valido'
        })
    }


}

module.exports = {
    login,
    googelSignin
}