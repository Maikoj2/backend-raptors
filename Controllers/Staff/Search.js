const { SearchingByNameOnDB, response } = require("../../helpers");
const { PeopleModel, UserModel, ClassModel, DisciplineModel, ContactModel } = require("../../models");



const getItemsByname = async (req, res, next) => {
    const itemsTosearch = req.params.search
    const regex = new RegExp(itemsTosearch, 'i');
    let { from = 0, limit = 5 } = req.query;
    limit = Number(limit);
    from = Number(from);
    let count = 0

    Promise.all([
        SearchingByNameOnDB(regex, PeopleModel, from, limit),
        SearchingByNameOnDB(regex, ClassModel, from, limit),
        SearchingByNameOnDB(regex, UserModel, from, limit),
        SearchingByNameOnDB(regex, DisciplineModel, from, limit),
        SearchingByNameOnDB(regex, ContactModel, from, limit),
    ]).then(
        resp => {
            count = Object.keys(resp[0]).length + Object.keys(resp[1]).length + Object.keys(resp[2]).length + Object.keys(resp[3]).length + Object.keys(resp[4]).length
            const data = {
                peoples: resp[0],
                class: resp[1],
                user: resp[2],
                discipline: resp[3],
                contact: resp[4]
            }
            response.success(res, res, 'load completed', 200, data, count);
        }
    )
        .catch(err => response.error(res, res, 'error loandig data', 500, err))



};


const getItemsByCameOnColletion = async (req, res, next) => {
    const { search, table } = req.params
    const regex = new RegExp(search, 'i');
    let { from = 0, limit = 5 } = req.query;
    limit = Number(limit);
    from = Number(from);

    const colletions = {
        Teachers: SearchingByNameOnDB(regex, PeopleModel, from, limit, 'TEACHER_ROLE'),
        athletes: SearchingByNameOnDB(regex, PeopleModel, from, limit, 'USER_ROLE'),
        Users: SearchingByNameOnDB(regex, UserModel, from, limit),
        disciplines: SearchingByNameOnDB(regex, DisciplineModel, from, limit),
        classes: SearchingByNameOnDB(regex, ClassModel, from, limit),
        emergencecontacts: SearchingByNameOnDB(regex, ContactModel, from, limit),
    }

     await colletions[table].then(
        resp => {
            response.success(res, res, 'load completed', 200, resp, Object.keys(resp).length);
        })
        .catch(err => response.error(res, res, 'error loandig data', 500, err))
}



module.exports = {

    getItemsByname,
    getItemsByCameOnColletion
}