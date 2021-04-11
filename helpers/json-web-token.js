const jwt = require('jsonwebtoken');


const generateJWT = (uid = '') => {

    return new Promise((resolve, reject) => {

        const payload = { uid };

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: "3h"
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('Ocurrio un erro al generar el jwt');
            } else {
                resolve(token);
            }
        });

    });
}

module.exports = {
    generateJWT
}