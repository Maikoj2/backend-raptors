const { response, SavingOnDB, Populate, SearchingAllOnDB, SearchingByIdOnDB, UpdatingOnDB } = require("../../helpers");
const { AttendanceModel, LoanModel, SignUpClassModel, MonthlypayModel } = require("../../models");

const getItems = async (req, res) => {
    const { from = 0, limit = 5 } = req.query;
    const query = { deleted: false }
    await Promise.all([
        AttendanceModel.countDocuments(query),
        SearchingAllOnDB(AttendanceModel, Number(from), Number(limit), query, Populate.Attendance)
    ])
        .then(([count, user]) => response.success(res, res, 'load completed', 200, user, count))
        .catch((err) => response.error(res, res, 'error loandig data for Attendance', 500, err))
};

/**
* create new register 
* @param {*} req 
* @param {*} res 
*/
const createItem = async (req, res) => {
    const id_user = req.user._id;
    const {id_class, ...date } = req.body;
    date.Date = new Date(req.body.Date);
    const Registers = await SignUpClassModel.find({ id_class });
    const attendanceSaved = [];
    if (Object.keys(Registers).length === 0 || !Registers)
        return response.error(res, res, 'error register', 404, `the class whit id: " ${id_class} " don't have athlete registered`)
     const validateAttence = await AttendanceModel.find({ id_SignUpclass: Registers[0]._id, Date: date.Date })
     if (Object.keys(validateAttence).length >0 ){
        return response.error(res, res, 'error register', 404, `the attendance was create before`)
     }
     Registers.forEach((element) => {
        const attendance = new AttendanceModel({
            id_SignUpclass:element._id,
            Date: date.Date,
            Attendance: true,
            pay: true,
            User: id_user
        });
        attendanceSaved.push(SavingOnDB(attendance))
    })
    Promise.all(attendanceSaved).then((resp) => { response.success(res, res, 'load completed', 200, resp) })


};

/**
 * update a existing record 
 * @param {*} req 
 * @param {*} res 
 */

const updateItem = async (req, res) => {
    const id_user = req.user._id;
    const id = req.params.id;
    const Timeelapsed = Date.now();
    const today = new Date(Timeelapsed);
    let updatedAttendance = []
    let Savinload = []
    let loan, exitsLoan;
    const { _id, id_SignUpclass, ...rest } = req.body;
    rest.User = id_user;
    const registre = await SearchingByIdOnDB(id_SignUpclass, SignUpClassModel, Populate.payModeSignUpClass);
    if (!rest.Attendance && rest.pay)
        return response.error(req, res, 'error Updating class', 500, `Someone that did not arrive, can't owe  money `)

    switch (registre.payMode) {
        case 'DIARIO':
            exitsLoan = await LoanModel.find({ idPeople: registre.id_Athlete.id._id, Date: rest.Date })
            if (Object.keys(exitsLoan).length > 0) {
                updatedAttendance = UpdatingOnDB(id, AttendanceModel, rest);
                break;
            }
            loan = new LoanModel({
                idPeople: registre.id_Athlete.id._id,
                valueToPay: registre.id_class.id_discipline.valuePerHour,
                Date: rest.Date,
                description: `No pago la clase `,
                User: id_user
            });
            Savinload = SavingOnDB(loan);
            updatedAttendance = UpdatingOnDB(id, AttendanceModel, rest);
            break;
        case 'MENSUAL':
            const monthlyDate = await MonthlypayModel.findOne({ id_SignUpclass: registre._id });
            exitsLoan = await LoanModel.find({ idPeople: registre.id_Athlete.id._id,  Date: rest.Date })
            if (Object.keys(exitsLoan).length > 0 || !exitsLoan) {
                updatedAttendance = UpdatingOnDB(id, AttendanceModel, rest);
                break;
            }
            if (today <= monthlyDate.DateEnd) {
                updatedAttendance = UpdatingOnDB(id, AttendanceModel, rest.Attendance);
                break;
            }
            loan = new LoanModel({
                idPeople: registre.id_Athlete.id._id,
                valueToPay: registre.id_class.id_discipline.valuePerMonth,
                Date: rest.Date,
                description: `Se vencio el plazo de pago `,
                User: id_user
            });
            Savinload = SavingOnDB(loan);
            updatedAttendance = UpdatingOnDB(_id, AttendanceModel, rest);
            break;

        default:
            break;
    }
    Promise.all([Savinload, updatedAttendance])
        .then(resp =>  response.success(req, res, 'class was updated Safely', 200, {Attendance: resp[1], Loan:resp[0]}))
        .catch((e) => response.error(req, res, 'error Updating class', 500, e))

};


module.exports = {
    getItems,
    createItem,
    updateItem

}
