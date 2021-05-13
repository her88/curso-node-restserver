const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL);

const { response, request } = require("express");
const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require("../models");

const crearArchivo = async (req = request, res = response) => {   

    try {
        // const nombre = await subirArchivo(req.files, ['txt', 'md'],'textos'); 
        const nombre = await subirArchivo(req.files, undefined, 'imgs');
        res.json({
            msg: `Se subio correctamente el archivo ${nombre}`
        })
    } catch (msg) {
        res.status(400).json({ msg });
    }

}

const actualizarImagen = async (req = request, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' });
    }

    try {

        // Limpiar imagenes previas
        if (modelo.img) {
            // Ha que borrar la imagen del servidor
            const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
            if (fs.existsSync(pathImagen)) {
                fs.unlinkSync(pathImagen);
            }
        }

        const nombre = await subirArchivo(req.files, undefined, coleccion);

        modelo.img = nombre;

        await modelo.save();

        res.json(modelo);
    } catch (error) {
        res.status(400).json({ msg: error});
    }

}

const actualizarImgCloudinary = async (req = request, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' });
    }

    try {

        // Limpiar imagenes previas
        if (modelo.img) {
           const nombreArr = modelo.img.split('/');
           const nombre = nombreArr[nombreArr.length - 1];
           const [ public_id ] = nombre.split('.');
           cloudinary.uploader.destroy(public_id);
        }

        const { tempFilePath } = req.files.archivo;
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

        modelo.img = secure_url;

        await modelo.save();

        res.json(secure_url);
    } catch (error) {
        res.status(400).json({ msg: error});
    }

}


const getImagen = async(req = request, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' });
    }

    try {

        // Limpiar imagenes previas
        if (modelo.img) {
            // Ha que borrar la imagen del servidor
            const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
            if (fs.existsSync(pathImagen)) {
                return res.sendFile(pathImagen);
            }
        }        

        const pathImagen = path.join( __dirname, '../assets/original.jpg' );
        res.sendFile(pathImagen);

    } catch (error) {
        res.status(400).json({ msg: error});
    }
}

module.exports = {
    crearArchivo,
    actualizarImagen,
    getImagen,
    actualizarImgCloudinary
}