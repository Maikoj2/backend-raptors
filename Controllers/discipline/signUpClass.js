const { SignUpClassModel, ClassModel } = require("../../models");
const { response, UpdatingOnDB, SavingOnDB, SearchingByIdOnDB, Populate, SearchingAllOnDB } = require('../../helpers');
const { savinDailyPayMode, savinMonthlyPayMode, updatingDailyPayMode , updatingmonthlyPayMode} = require("../../helpers/PayMode/SavingPaymode");

/**
 * get a data
 * @param {*} req 
 * @param {*} res 
 */
const getItems = async (req, res) => {
    const { from = 0, limit = 5 } = req.query;
    let query = { deleted: false };
    await Promise.all([
        SignUpClassModel.countDocuments(query),
        SearchingAllOnDB(SignUpClassModel, Number(from), Number(limit), query, Populate.SignUpClass)
    ])
        .then(([count, user]) => response.success(res, res, 'load completed', 200, user, count))
        .catch((err) => response.error(res, res, 'error loandig data for sing up', 500, err))

};

/**
* create new register 
* @param {*} req 
* @param {*} res 
*/
const createItem = async (req, res) => {
    const User = req.user._id;
    const { id_Athlete, id_class, payMode } = req.body
    const SignUpclass = new SignUpClassModel({
        id_Athlete, id_class, payMode, User

    });
    const valueClass = await ClassModel.findOne({ _id: id_class }).populate({ path: 'id_discipline', select: 'valuePerHour valuePerMonth', })
    const PaymodeCase = {
        DIARIO: savinDailyPayMode(SignUpclass._id, valueClass.id_discipline.valuePerHour, User),
        MENSUAL: savinMonthlyPayMode(SignUpclass._id, valueClass.id_discipline.valuePerMonth, User)
    }
    Promise.all([
        PaymodeCase[SignUpclass.payMode],
        SavingOnDB(SignUpclass)
    ])
        .then(resp => response.success(req, res, 'the register was saved Safely', 200, resp))
        .catch(e => response.error(res, res, 'error storeding peopel', 500, e));
};

/**
 * update a existing record 
 * @param {*} req 
 * @param {*} res 
 */

const updateItem = async (req, res) => {
    const id_user = req.user._id;
    const { id } = req.params;
    const { _id, id_Athlete, id_class, ...rest } = req.body;
    rest.User = id_user;
    const signUpClassSearched = await SearchingByIdOnDB(id, SignUpClassModel, Populate.payModeSignUpClass);
    let PaymodeCase = '';

    if (signUpClassSearched.payMode === rest.payMode) {
        return response.success(req, res, 'No changes', 200, signUpClassSearched)
    }
    switch (signUpClassSearched.payMode) {
        case 'DIARIO':
             PaymodeCase =  await updatingDailyPayMode(id, signUpClassSearched, id_user);
            break;
        case 'MENSUAL':
             PaymodeCase =  await updatingmonthlyPayMode(id, signUpClassSearched, id_user);
            break;
    
        default:
            break;
    }
    
    Promise.all([
        UpdatingOnDB(id,SignUpClassModel,rest), 
        PaymodeCase           
    ]).then(resp => response.success(req, res, 'the register was saved Safely', 200, resp)

    )  
    
};


git


module.exports = {
    getItems,
    createItem,
    updateItem

}
