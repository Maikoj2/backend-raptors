const  middleware = {
    token: require('./autenticacion'),
    valid: require('./ValidateInputs')
}


module.exports = middleware;