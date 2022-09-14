const { UserModel } = require('../../models')
const bcrypt = require('bcryptjs');

const { response, JWT } = require('../../helpers');
const { token } = require('../../middleware');

/**
 * get a  list 
 * @param {*} req 
 * @param {*} res 
 */
const Login = async (req, res) => {
    const { email, password } = req.body;
    await UserModel.findOne({ email }).then(userdb => {
        if (!bcrypt.compareSync(password, userdb.password))
            return response.error(req, res, 'WRONG_CREDENTIALS', 401, 'wrong credentials the email or password is incorrect');
        JWT.cretateJWT(userdb)
            .then(token => response.success(req, res, 'Autenticated', 201, { user: userdb, token }))



    })
};

const RevalidateToken = (req, res) => {
    const data = req.user
    JWT.cretateJWT(data)
        .then(token => response.success(req, res, 'Newtoken ', 201, { user: data, token }))

}


module.exports = { Login, RevalidateToken };
