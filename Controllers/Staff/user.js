const { UserModel } = require('../../models')
const bcrypt = require('bcryptjs');
const { response } = require('../../helpers');
const user = require('../../models/staff/user');

/**
 * get a  list 
 * @param {*} req 
 * @param {*} res 
 */
const getItems = async (req, res) => {

    let from = req.query.from || 0;
    from = Number(from);

    await UserModel.find({}, 'Name email img role createdAt updatedAt')
        .skip(from)
        .limit(5)
        .exec(
            (err, user) => {
                if (err) {
                    response.error(res, res,'error loandig data for User', 500, err);
                }
                UserModel.estimatedDocumentCount({}, (err, count) => {
                    response.success(res, res, 'load completed', 200, user, count )
                })


            });
};

/**
 * get a data
 * @param {*} req 
 * @param {*} res 
 */
const getItem = (req, res) => { };

/**
 * create new register 
 * @param {*} req 
 * @param {*} res 
 */
const createItem = async (req, res) => {
    const { body } = req;

    const user = new UserModel({
        id: '',
        Name: body.Name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });
    user.id = user._id
    await user.save((err, userSaved) => {
        if (err) {
            response.error(res, res,'error create user', 500, err);
        }
        response.success(res, res, 'user created successfully', 201, userSaved)
    });


};
/**
 * update a existing record 
 * @param {*} req 
 * @param {*} res 
 */

const updateItem = async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    await UserModel.findById(id, (err, user) => {

        (err) && response.error(req, res,'error searching for user', 500, err);

        (!user) && response.error(req, res,`the user ${ id } no found`, 404, `the user not exist`);
        
        user.Name = body.Name;
        user.email = body.email;
        user.role = body.role;

        user.save((err, savededUser) => {

            if (err)response.error(req, res,'error upduting User', 500, err); 
            savededUser.password = '<3'
            response.success(req, res, 'user updated successfully', 200, savededUser)

        });

    });

};

/**
 * delete a existing record
 * @param {*} req 
 * @param {*} res 
 */
const deleteItem = async (req, res) => {
    const id = req.params.id;

    await UserModel.deleteOne({ _id: id }, (err, deletedUser) => {


        if (err) response.error(req, res,'error deleting  user', 500, err);
        if (!deletedUser) response.error(req, res,`the user ${ id } no found`, 404, `the user not exist`);
        response.success(req, res, 'user deleted successfully', 200, savededUser)



    });
};

module.exports = {
    getItems,
    getItem,
    createItem,
    updateItem,
    deleteItem
}