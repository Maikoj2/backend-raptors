const jwt = require('jsonwebtoken');
const { response } = require('../helpers');


// ==============================
// verificar token
// ==============================
exports.verificatoken = function(req, res, next) {
    const SEED = process.env.SEED
    const token = req.query.token;
    jwt.verify(token, SEED, (err, decoded) => {
        if (err) return response.error(res, res, 'Invalid token', 401, err);

        req.user = decoded.usuario;
        next();
    })
}