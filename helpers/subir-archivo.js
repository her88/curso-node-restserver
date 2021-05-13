const path = require('path');
const { v4: uuidv4 } = require('uuid');
// uuidv4(); ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'

const defaultExtension = ['png', 'jpg', 'jpeg', 'gif'];

const subirArchivo = (files, extensionesValidas = defaultExtension, carpeta = '') => {

    return new Promise((resolve, reject) => {

        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];

        if (!extensionesValidas.includes(extension)) {
            return reject(`La extension ${extension} no es permitida - ${extensionesValidas}`);
        }

        const nameTemp = uuidv4() + '.' + extension;

        // renombrar el archivo y pasarlo a la ubicacion final
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nameTemp);

        archivo.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }

            resolve(nameTemp);
        });
    })


}

module.exports = {
    subirArchivo
}