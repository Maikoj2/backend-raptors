const { UserModel } = require('../../models')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const SEED = require('../../config/config').SEED;

/**
 * get a  list 
 * @param {*} req 
 * @param {*} res 
 */
const Login = async (req, res) => {

    const { body } = req;
    await UserModel.findOne({ email: body.email }, (err, userdb) => {
        if (err) return res.status(500).json({
            ok: false,
            message: 'Error searching user',
            erros: err
        });

        if (!userdb) return res.status(500).json({
            ok: false,
            message: 'wrong credentials',
            erros: err
        });

        if (!bcrypt.compareSync(body.password, userdb.password)) {
            return res.status(500).json({
                ok: false,
                message: 'wrong credentials',
                erros: err
            });
        }
        userdb.password = ':)'
        // crear token
        const token = jwt.sign({ usuario: userdb }, SEED, { expiresIn: 14400 }) //4

        res.status(201).json({
            ok: true,
            usuario: userdb,
            token: token,
            id: userdb._id

        });

    })
};


module.exports = Login;