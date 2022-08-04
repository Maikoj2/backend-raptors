const jwt = require('jsonwebtoken')
const SEED = require('../config/config').SEED;


// ==============================
// verificar token
// ==============================
exports.verificatoken = function(req, res, next) {

    const token = req.query.token;
    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'token no valido',
                erros: err
            });
        }
        req.user = decoded.usuario;
        next();
    })
}