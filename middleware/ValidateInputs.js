const {validationResult} = require('express-validator');
const { response } = require('../helpers');
const validateFields = ( req, res, next ) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) return response.error(req, res,'VALIDATE_ERROR',400 ,errors);
    next();
}

module.exports ={
    validateFields
}