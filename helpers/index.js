const  models = {
    response: require('./response/response'),
    UpdatingOnDB: require('./db/updating'),
    SearchingByIdOnDB: require('./db/searchingById'),
    SearchingByNameOnDB: require('./db/seachingByName'),
    SearchingPayMode: require('./db/seachinrByPayMode'),
    DeletingMonthlyOrdailypay: require('./db/DeleteMonthlyOrdailypay'),
    SavingOnDB: require('./db/saving.js')

}
module.exports = models