const { SearchingAllOnDB, response, Populate, SavingOnDB, UpdatingOnDB } = require("../../../helpers");
const {  ValueExtraHourslModel } = require("../../../models");

/**
 * get a  list 
 * @param {*} req 
 * @param {*} res 
 */
const getItemsExtrasHours = async (req, res) => {

        ValueExtraHourslModel.find({})    
        .then(( user) => response.success(req, res, 'load completed', 200, user))
        .catch((err) => response.error(req, res, 'error loandig data for ValueExtrasHours', 500, err))
};



/**
 * update a existing record 
 * @param {*} req 
 * @param {*} res 
 */

const updateItemExtrasHours = async (req, res) => {
    const id = req.params.id;
    const { _id ,...rest } = req.body;
      UpdatingOnDB(id, ValueExtraHourslModel, rest)
        .then(resp => response.success(req, res, 'Loan was updated Safely', 200, resp))
        .catch((e) => response.error(req, res, 'error Updating athlete', 500, e))
};



module.exports = {
    getItemsExtrasHours,
    // getItem,
    updateItemExtrasHours,
}