const { UserModel } = require('../../models')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const { response } = require('../../helpers');

/**
 * get a  list 
 * @param {*} req 
 * @param {*} res 
 */
const Login = async (req, res) => {
    const SEED = process.env.SEED

    const { body } = req;
    await UserModel.findOne({ email: body.email }).then(userdb => {
        if ( !userdb || !bcrypt.compareSync(body.password, userdb.password)) return response.error(req, res, 'wrong credentials', 401, '   ');
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