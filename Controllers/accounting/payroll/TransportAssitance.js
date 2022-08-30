const { response, UpdatingOnDB } = require("../../../helpers");
const { TransportAssitancelModel } = require("../../../models");

/**
 * get a  list 
 * @param {*} req 
 * @param {*} res 
 */
const getItemsTransportAssitance = async (req, res) => {

        TransportAssitancelModel.find({})    
        .then(( user) => response.success(req, res, 'load completed', 200, user))
        .catch((err) => response.error(req, res, 'error loandig data for ValueTransportAssitance', 500, err))
};

/**
 * update a existing record 
 * @param {*} req 
 * @param {*} res 
 */

const updateItemTransportAssitance = async (req, res) => {
    const id = req.params.id;
    const { _id ,...rest } = req.body;
      UpdatingOnDB(id, TransportAssitancelModel, rest)
        .then(resp => response.success(req, res, 'ValueTransportAssitance was updated Safely', 200, resp))
        .catch((e) => response.error(req, res, 'error Updating athlete', 500, e))
};



module.exports = {
    getItemsTransportAssitance,
    // getItem,
    updateItemTransportAssitance,
}