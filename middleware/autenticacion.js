require('module-alias/register')
const jwt = require('jsonwebtoken');
const { response } = require('../helpers');
const { UserModel } = require('@models');


// ==============================
// verificar token
// ==============================
exports.verificatoken =  (req, res, next) => {
    const SEED = process.env.SEED
    const token = req.headers.token;
    jwt.verify(token, SEED, async(err, decoded) => {
        if (err) return response.error(res, res, 'Invalid token', 401, err);
        const user  = await UserModel.findById(decoded.Data._id)
        if (!user) return response.error(res, res, 'Invalid token', 401, 'Invalid token');

        req.user = decoded.Data;
        next();
    })
}