
const  middleware = {
    token: require('./autenticacion'),
    valid: require('./ValidateInputs'),
    rol: require('./ValidateRol'),
}


module.exports = middleware;