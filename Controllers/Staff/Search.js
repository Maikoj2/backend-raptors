const { SearchingByNameOnDB, response } = require("../../helpers");
const { PeopleModel, UserModel } = require("../../models");



const gettemsByname = async (req, res, next ) => {
    const itemsTosearch = req.PropTypes.search
    const regex = new RegExp(itemsTosearch, 'i');
    const from = req.query.from || 0 ;
    from = Number(from);
    const count = 0

    Promise.all(

        SearchingByNameOnDB(regex, PeopleModel, from),
        SearchingByNameOnDB(regex, UserModel, from)
    ).then(
        resp => {
            count = Object.keys(resp[0]).length + Object.keys(resp[1]).length;
            res.status(200).json({
                ok: true,
                people: resp[0],
                user: resp[1],
                // clase: resp[2],
                // Diciplinas: resp[3],
                cantidad: count
            })
        }
    )
    .catch( err =>  response.error(res, res,'error loandig data', 500, err))
    
    
    
};


module.exports ={

    gettemsByname
}