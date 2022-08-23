const  models = {
    Server: require('./server/server'),
    UserModel: require('./staff/user'),
    RoleModel: require('./staff/rol'),
    PeopleModel: require('./staff/people'),
    TeacherModel: require('./staff/Teacher'),
    AthletesModel: require('./staff/Athlete'),
    ContactModel: require('./staff/contactEmergen'),
    DisciplineModel: require('./discipline/Discipline'),
    ClassModel: require('./discipline/class'),
    SignUpClassModel: require('./discipline/signUpClass'),
    AttendanceModel: require('./discipline/attendance'),
    DaylypayModel: require('./facturas/DailyPayment'),
    MonthlypayModel: require('./facturas/MonthlyPayment'),
    LoanModel: require('./facturas/loan'),
    BaseSalaryModel: require('./nomina/BaseSalary'),

}
module.exports = models