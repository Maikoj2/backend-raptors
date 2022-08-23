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

    const { email, password } = req.body;
    await UserModel.findOne({ email}).then(userdb => {
        if (!bcrypt.compareSync(password, userdb.password)) return response.error(req, res, 'wrong credentials', 401, '   ');
        // crear token
        const token = jwt.sign({ usuario: userdb }, SEED, { expiresIn: 14400 }) //4
        response.success(req, res, {token: token},201,[userdb, {id: userdb._id}]);

    })
};


module.exports = Login;
