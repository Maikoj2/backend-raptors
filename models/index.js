const  models = {
    UserModel: require('./staff/user'),
    PeopleModel: require('./staff/people'),
    TeacherModel: require('./staff/Teacher'),
    AthletesModel: require('./staff/Athlete'),
    ContactModel: require('./staff/contactEmergen'),
    DisciplineModel: require('./discipline/Discipline'),
    ClassModel: require('./discipline/class'),
    SignUpClassModel: require('./discipline/signUpClass'),
    DaylypayModel: require('./facturas/DailyPayment'),
    MonthlypayModel: require('./facturas/MonthlyPayment'),

}
module.exports = models