const  models = {
    response: require('./response/response'),
    UpdatingOnDB: require('./db/updating'),
    SearchingAllOnDB: require('./db/searchingAll'),
    SearchingByIdOnDB: require('./db/searchingById'),
    SearchingByNameOnDB: require('./db/seachingByName'),
    DeletingMonthlyOrdailypay: require('./db/DeleteMonthlyOrdailypay'),
    SavingOnDB: require('./db/saving.js'),
    Populate: require('./pupalate/populate'),
    SaveOrUpdateContact: require('./contactEmergecy/saveAndUpdating'),
    JWT: require('./JWT/CreateJTW')

}
module.exports = models