const { UserModel } = require('../../models')
const bcrypt = require('bcryptjs');
const { response, SavingOnDB, UpdatingOnDB, SearchingAllOnDB } = require('../../helpers');

/**
 * get a  list 
 * @param {*} req 
 * @param {*} res 
 */
const getItems = async (req, res) => {

    const {from = 0, limit = 5} = req.query; 
    const query = { deleted: false}
    await Promise.all([
        UserModel.countDocuments( query ),
        SearchingAllOnDB(UserModel, from, limit, query)
    ])
    .then(([count, user]) =>  response.success(res, res, 'load completed', 200, user,count ))
    .catch((err) =>  response.error(res, res,'error loandig data for User', 500, err))
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
    const { Name , email , password , img  ,role} = req.body;
    const user = new UserModel({ Name , email , password , img  ,role});
    user.id = user._id
    user.password = bcrypt.hashSync(password, 10);
    await SavingOnDB(user)
    .then((userSaved) => {  response.success(req, res, 'user created successfully', 201, userSaved)})
    .catch((err) => {  response.error(req, res, 'error creating user', 500, err)})
};
/**
 * update a existing record 
 * @param {*} req 
 * @param {*} res 
 */

const updateItem = async (req, res) => {
    const {id} = req.params;
    const { _id, password, email, ...rest} = req.body;
    if (password) {
        password = bcrypt.hashSync(body.password, 10);
    }
    await UpdatingOnDB(id , UserModel ,rest )
    .then( (savededUser) => {response.success(req, res, 'user updated successfully', 200, savededUser)})
    .catch( (err) => response.error(req, res,'error upduting User', 500, err)) ;
};

/**
 * delete a existing record
 * @param {*} req 
 * @param {*} res 
 */
const deleteItem = async (req, res) => {
    const { id } = req.params;
    await UpdatingOnDB(id, UserModel, { deleted: true} )
    .then((savededUser) => {response.success(req, res, 'user deleted successfully', 200, savededUser)})
};

module.exports = {
    getItems,
    getItem,
    createItem,
    updateItem,
    deleteItem
}