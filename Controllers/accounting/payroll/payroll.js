const { SearchingAllOnDB, response, Populate, SavingOnDB, UpdatingOnDB } = require("@helpers");
const { savePayroll } = require("@helpers/payroll/payroll");
const { payrollModel, StaffModel, ExtraHourslModel, DeductedModel, AccruedModel, ValueExtraHourslModel, TransportAssitancelModel } = require("@models");


/**
 * get a  list 
 * @param {*} req 
 * @param {*} res 
 */
const getItems = async (req, res) => {

    const { from = 0, limit = 5 } = req.query;
    const query = { deleted: false }
    await Promise.all([
        payrollModel.countDocuments(query),
        SearchingAllOnDB(payrollModel, Number(from), Number(limit), query, Populate.payroll)
    ])
        .then(([count, user]) => response.success(res, res, 'load completed', 200, user, count))
        .catch((err) => response.error(res, res, 'error loandig data for Loands', 500, err))
};

/**
* create new register 
* @param {*} req 
* @param {*} res 
*/
const createItems = async (req, res) => {
    const User = req.user._id;
    const TypeSalary = req.params.TypeSalary;

    const date = req.body;
    date.Date = new Date(req.body.Date);
    const payrollSaved = [];
    let Days_worked = 0;
    const Registers = await StaffModel.find({ TypeSalary: TypeSalary, deleted: false }).populate(Populate.staff);

    if (Object.keys(Registers).length === 0 || !Registers)
        return response.error(res, res, 'error register', 404, `there are not a registered staff whith  Type salary: '${TypeSalary}'`)

    const validateTypesalary = await payrollModel.find({ id_staff: Registers[0]._id, Date: date.Date })
    if (Object.keys(validateTypesalary).length > 0) return response.error(res, res, 'error register', 404, `the payroll for this Date: '${date.Date}' was create before`)
    if (TypeSalary === 'MENSUAL') Days_worked = 30
    else if (TypeSalary === 'QUINCENAL') Days_worked = 15;
    Registers.forEach(async (element) => {
        const extraHours = new ExtraHourslModel({});
        const deducded = new DeductedModel({})
        const accrued = new AccruedModel({ id_ExtraHours: extraHours._id, Days_worked, })
        const payroll = new payrollModel({
            id_staff: element._id,
            id_Deducted: deducded._id,
            id_accrued: accrued._id,
            Date: date.Date,
            User,
        })

        payrollSaved.push([
            SavingOnDB(extraHours),
            SavingOnDB(deducded),
            SavingOnDB(payroll),
            SavingOnDB(accrued)
        ])
    })
    Promise.all(payrollSaved).then((resp) => { response.success(res, res, 'load completed', 200, resp) })
        .catch((err) => response.error(res, res, 'error saving data for Loands', 500, err))

};

/**
* create new register 
* @param {*} req 
* @param {*} res 
*/
const createItem = async (req, res) => {
    const User = req.user._id;
    const TypeSalary = req.params.TypeSalary;

    const dataBody = req.body;
    dataBody.Date = new Date(req.body.Date);
    let Days_worked = 0;
    const Registers = await StaffModel.find({_id: dataBody.id_staff}).populate(Populate.staff);

    if (Object.keys(Registers).length === 0 || !Registers)
        return response.error(res, res, 'error register', 404, `there are not a registered staff whith  Type salary: '${TypeSalary}'`)

    const validateTypesalary = await payrollModel.find({ id_staff: Registers[0]._id, Date: dataBody.Date })
    if (Object.keys(validateTypesalary).length > 0) return response.error(res, res, 'error register', 404, `the payroll for this Date: '${dataBody.Date}' was create before`)

    if (Registers[0].TypeSalary === 'MENSUAL') Days_worked = 30
    else if (Registers[0].TypeSalary === 'QUINCENAL') Days_worked = 15;

    const extraHours = new ExtraHourslModel({});
    const deducded = new DeductedModel({})
    const accrued = new AccruedModel({ id_ExtraHours: extraHours._id, Days_worked})
    const payroll = new payrollModel({
        id_staff: dataBody.id_staff,
        id_Deducted: deducded._id,
        id_accrued: accrued._id,
        Date: dataBody.Date,
        User,
    })

     Promise.all([ 
        SavingOnDB(extraHours),
        SavingOnDB(deducded),
        SavingOnDB(payroll),
        SavingOnDB(accrued)
    ]).then((resp) => { response.success(res, res, 'load completed', 200, resp) })
         .catch((err) => response.error(res, res, 'error saving data for Loands', 500, err))

};


/**
 * update a existing record 
 * @param {*} req 
 * @param {*} res 
 */

const updateItem = async (req, res) => {
    const id = req.params.id;
    const Data = await savePayroll(id, req);
    const id_ExtraHours = Data.UpdatePayroll.id_accrued.id_ExtraHours._id;
    Promise.all([
        UpdatingOnDB(id_ExtraHours, ExtraHourslModel, Data.idExtraHours),
        UpdatingOnDB(Data.UpdatePayroll.id_Deducted, DeductedModel, Data.Deducted),
        UpdatingOnDB(Data.UpdatePayroll.id_accrued, AccruedModel, Data.Updatedaccrued),
        UpdatingOnDB(id, payrollModel, Data.UpdatePayroll),
    ]).then((resp) => { response.success(res, res, 'saaving  completed', 200, resp) })
        .catch((err) => response.error(res, res, 'error saving data for Loands', 500, err))

};


/**
 * delete a existing record
 * @param {*} req 
 * @param {*} res 
 */
const deleteItem = async (req, res) => {

    const { id } = req.params;
    const payroll = await payrollModel.findById({ _id: id }).populate(Populate.payroll);
    Promise.all([
        payrollModel.delete({ _id: id }),
        ExtraHourslModel.delete({ _id: payroll.id_accrued.id_ExtraHours._id }),
        AccruedModel.delete({ _id: payroll.id_accrued._id }),
        DeductedModel.delete({ _id: payroll.id_Deducted._id }),
    ]).then((resp) => { response.success(res, res, 'saaving  completed', 200, resp) })
        .catch((err) => response.error(res, res, 'error saving data for Loands', 500, err))




    // await UpdatingOnDB(id, payrollModel, { deleted: true })
    //     .then((savededUser) => { response.success(req, res, 'loan has been deleted successfully', 200, savededUser) })
};

module.exports = {
    getItems,
    // getItem,
    createItem,
    updateItem,
    deleteItem,
    createItems
}