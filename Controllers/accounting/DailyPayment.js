require('module-alias/register')
const { SearchingAllOnDB, response, Populate } = require('@helpers');
const { DailypayModel } = require('@models');

/**
 * get a  list 
 * @param {*} req 
 * @param {*} res 
 */
 const getItems = async (req, res) => {

    const {from = 0, limit = 5} = req.query; 
    const query = { deleted: false}
    await Promise.all([
        DailypayModel.countDocuments( query ),
        SearchingAllOnDB(DailypayModel,  Number(from), Number(limit), query, Populate.MonthlyAndDailypay)
    ])
    .then(([count, user]) =>  response.success(res, res, 'load completed', 200, user,count ))
    .catch((err) =>  response.error(res, res,'error loandig data for User', 500, err))
};

module.exports = {
    getItems,
    // getItem,
    // createItem,
    // updateItem,
    // deleteItem
}