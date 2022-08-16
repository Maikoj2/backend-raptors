const  models = {
    UserModel: require('./staff/user'),
    PeopleModel: require('./staff/people'),
    TeacherModel: require('./staff/Teacher'),
    AthletesModel: require('./staff/Athlete'),
    ContactModel: require('./staff/contactEmergen'),
    DisciplineModel: require('./discipline/Discipline'),
    ClassModel: require('./discipline/class'),

}
module.exports = models