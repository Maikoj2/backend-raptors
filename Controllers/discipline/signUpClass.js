const { SignUpClassModel, ClassModel, DaylypayModel, MonthlypayModel } = require("../../models");
const { response, UpdatingOnDB, SavingOnDB, SearchingByIdOnDB, SearchingPayMode, DeletingMonthlyOrdailypay } = require('../../helpers');
const DailyPayment = require("../../models/facturas/DailyPayment");

/**
 * get a data
 * @param {*} req 
 * @param {*} res 
 */
const getItems = async (req, res) => {
    let from = req.query.from || 0;
    from = Number(from);
    const count = await SignUpClassModel.estimatedDocumentCount();
    await SignUpClassModel.find({})
        .populate([{
            path: 'id_Athlete',
            select: '',
            populate: [{
                path: 'id',
                select: 'Names id SureNames email'
            }]
        },
        {
            path: 'id_class',
            select: 'Name valuePerHour valuePerMonth',
            populate: [{
                path: 'id_teacher',
                select: 'id id_BaseSalary profession',
                populate: [{
                    path: 'id',
                    select: 'Names id SureNames email'
                }]
            }]
        },
        {
            path: 'User',
            select: 'Name email'
        }
        ])
        .skip(from)
        .limit(5)
        .exec(
            (err, disciplne) => {
                if (err) return response.error(res, res, 'error loandig  Class', 500, err);
                response.success(res, res, 'load completed', 200, disciplne, count)
            });
};

/**
* create new register 
* @param {*} req 
* @param {*} res 
*/
const createItem = async (req, res) => {
    const id_user = req.user._id;
    const { body } = req;
    const SignUpclass = new SignUpClassModel({
        id_Athlete: body.id_Athlete,
        id_class: body.id_class,
        payMode: body.payMode,
        User: id_user

    });
    SignUpclass.id = SignUpclass._id;
    let data = [];



    // busco en el coleecion que el mismo alumno no este repetido en la mis clase
    SignUpClassModel.findOne({ id_class: body.id_class, id_Athlete: body.id_Athlete })
        .exec((err, SignedUp) => {
            if (err)
                return response.error(res, res, 'error finding SignedUp  Class', 500, err);

            //  si no esta hay registro en la colleccion registro crea el registro
            if (!SignedUp || SignedUp == null) {

                SavingOnDB(SignUpclass)
                    .then(resp => data = resp)
                    .catch((e) => response.error(res, res, 'error storeding peopel', 500, e))
                // busco en la clase el valor y registro los que pagan mensual o diarios 
                ClassModel.findOne({ _id: body.id_class })
                    .populate({
                        path: 'id_discipline',
                        select: 'valuePerHour valuePerMonth',
                    })
                    .exec((err, reg) => {
                        if (err)
                            return response.error(res, res, 'error finding  Class', 500, err);
                        if (reg) {

                            switch (SignUpclass.payMode) {
                                case 'DIARIO':
                                    const Daylypay = new DaylypayModel(
                                        {
                                            id_SignUpclass: SignUpclass._id,
                                            Price: reg.id_discipline.valuePerHour,
                                            User: id_user,
                                        }
                                    );
                                    Daylypay.id = Daylypay._id
                                    SavingOnDB(Daylypay)
                                        .then(resp => response.success(req, res, 'the register was saved Safely', 200, [data, resp]))
                                        .catch((e) => response.error(res, res, 'error storeding peopel', 500, e))
                                    break;
                                case 'MENSUAL':
                                    const Monthlypay = new MonthlypayModel({
                                        id_SignUpclass: SignUpclass._id,
                                        Price: reg.id_discipline.valuePerHour,
                                        DateStart: body.DateStart,
                                        DateEnd: body.DateEnd,
                                        User: id_user,

                                    });
                                    Monthlypay.id = Monthlypay._id
                                    SavingOnDB(Monthlypay)
                                        .then(resp => response.success(req, res, 'the register was saved Safely', 200, [data, resp]))
                                        .catch((e) => response.error(res, res, 'error storeding peopel', 500, e))
                                    break;

                                default:
                                    break;
                            };
                        };
                    });
            } else {
                return response.error(res, res, 'error signing up athlete', 404, ` 'the althlete is singed up in the class ${body.id_class}`)
            };
        });
};

/**
 * update a existing record 
 * @param {*} req 
 * @param {*} res 
 */

const updateItem = async (req, res) => {
    const id_user = req.user._id;
    const id = req.params.id;
    const { body } = req;
    const myDate2 = new Date();

    switch (body.payMode) {
        case 'DIARIO':

            Promise.all([
                SearchingPayMode(id, SignUpClassModel),
                SearchingByIdOnDB(id, MonthlypayModel)
            ]).then(resp => {
           
                if ( resp[0][0].payMode == 'MENSUAL') {
                     resp[0][0].payMode = 'DIARIO';

                    const Daylypay = new DaylypayModel(
                        {
                            id_SignUpclass: resp[0][0]._id,
                            Price: resp[0][0].id_class.id_discipline.valuePerHour,
                           
                            User: id_user,
                        }
                    )
                    Daylypay.id = Daylypay._id
                    console.log(resp[0]);

                    Promise.all([
                        SavingOnDB(resp[0][0]),
                        SavingOnDB(Daylypay),
                        DeletingMonthlyOrdailypay(resp[0][0]._id, MonthlypayModel)
                    ]).then(respo => {
                        return response.success(req, res, 'the register was saved Safely', 200, respo)
                    });
                } else {
                    return response.success(req, res, 'the register finded', 200, resp)
                }
            }
            );
            break;
        case 'MENSUAL':
            Promise.all([
                SearchingPayMode(id, SignUpClassModel),
                SearchingByIdOnDB(id, DaylypayModel)
            ]).then(resp => {

           console.log(resp[0][0].payMode);
                if ( resp[0][0].payMode == 'DIARIO') {
                     resp[0][0].payMode = 'MENSUAL';

                    const Monthlypay = new MonthlypayModel(
                        {
                            id_SignUpclass: resp[0][0]._id,
                            Price: resp[0][0].id_class.id_discipline.valuePerHour,
                            DateStart: new Date(),
                            DateEnd: myDate2.addMonths(1),
                            User: id_user,
                        }
                    )
                    Monthlypay.id = Monthlypay._id
                    console.log(resp[0]);

                    Promise.all([
                        SavingOnDB(resp[0][0]),
                        SavingOnDB(Monthlypay),
                        DeletingMonthlyOrdailypay(resp[0][0]._id, DaylypayModel)
                    ]).then(respo => {
                        return response.success(req, res, 'the register was saved Safely', 200, respo)
                    });
                } else {
                    return response.success(req, res, 'the register finded', 200, resp)
                }
            }
            );
            break;

        default:
            break;
    }
};


// agrega el mes siguiente
Date.isLeapYear = function (year) { return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)); };
Date.getDaysInMonth = function (year, month) { return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]; };
Date.prototype.isLeapYear = function () { const y = this.getFullYear(); return (((y % 4 === 0) && (y % 100 !== 0)) || (y % 400 === 0)); };
Date.prototype.getDaysInMonth = function () { return Date.getDaysInMonth(this.getFullYear(), this.getMonth()); };
Date.prototype.addMonths = function (value) { const n = this.getDate(); this.setDate(1); this.setMonth(this.getMonth() + value); this.setDate(Math.min(n, this.getDaysInMonth())); return this; };




module.exports = {
    getItems,
    createItem,
    updateItem

}
