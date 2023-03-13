
const  middleware = {
    token: require('./autenticacion'),
    valid: require('./ValidateInputs'),
    rol: require('./ValidateRol'),
    multeridelware: require('./multer'),
}


module.exports = middleware;