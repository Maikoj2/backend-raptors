const { SavingOnDB, SearchingByIdOnDB, Populate, response, UpdatingOnDB, DeletingMonthlyOrdailypay } = require("..");
const { addMonth } = require("../Date/DatePrototype");
const { DailypayModel, MonthlypayModel } = require("../../models");

const savinDailyPayMode = async (id_SignUpclass, Price, User) => {
    const Daylypay = new DailypayModel({ id_SignUpclass, Price, User });
    return await SavingOnDB(Daylypay);
};
const savinMonthlyPayMode = async (id_SignUpclass, Price, User) => {
    const DateStart = addMonth(0);
    const DateEnd = addMonth(1);
    const Monthlypay = new MonthlypayModel({
        id_SignUpclass, Price, DateStart,
        DateEnd, User
    });
    return await SavingOnDB(Monthlypay)
};

const updatingDailyPayMode =  (id, register , id_user) => {
    return  Promise.all([
        savinMonthlyPayMode( id, register.id_class.id_discipline.valuePerMonth, id_user),
        DeletingMonthlyOrdailypay(id, DailypayModel)
    ])


};
const updatingmonthlyPayMode =  (id, register, id_user) => {
   return  Promise.all([
        savinDailyPayMode( id, register.id_class.id_discipline.valuePerHour,  id_user),
        DeletingMonthlyOrdailypay(id, MonthlypayModel)
    ])
}



module.exports = {
    savinDailyPayMode,
    savinMonthlyPayMode,
    updatingDailyPayMode,
    updatingmonthlyPayMode

}