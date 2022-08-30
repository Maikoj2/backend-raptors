
const { AthletesModel, ContactModel, PeopleModel } = require("../../models");
const { response, UpdatingOnDB, SavingOnDB, SearchingAllOnDB, Populate } = require('../../helpers');


/**
 * get a data
 * @param {*} req 
 * @param {*} res 
 */
const getItems = async (req, res) => {
    const { from = 0, limit = 5 } = req.query;
    let query = { deleted: false }

    await Promise.all([
        AthletesModel.countDocuments(query),
        SearchingAllOnDB(AthletesModel, Number(from), Number(limit), query, Populate.Athlete)
    ])
        .then(([count, user]) => response.success(res, res, 'load completed', 200, user, count))
        .catch((err) => response.error(res, res, 'error loandig data for Staff', 500, err))
};

/**
* create new register 
* @param {*} req 
* @param {*} res 
*/
const createItem = async (req, res) => {
    const user = req.user._id;
    const { id, IdType, Names, SureNames, Gender, neighborhood, Address, Phone,
        occupation, email, EPS, img, DateofBirth, DepartamentBirth, MunicipeBirth, role, ...body } = req.body;
    const People = new PeopleModel({
        id, IdType, Names, SureNames, Gender, neighborhood, Address, Phone,
        occupation, email, EPS, img, DateofBirth, DepartamentBirth, MunicipeBirth, role, user
    });
    let {_id, ...Contact} = await ContactModel.findOne({ id: body.IdContact });
    let contactSaved
    if (!Contact) {
        Contact = new ContactModel({
            id: body.IdContact,
            Names: body.ContactNames,
            SureNames: body.ContactSureNames,
            neighborhood: body.Contactneighborhood,
            Address: body.ContactAddress,
            Phone: body.ContactPhone,
            occupation: body.Contactoccupation,
            email: body.Contactemail,
        });
        _id = Contact._id
        contactSaved = SavingOnDB(Contact);   
    }else {
        contactSaved = UpdatingOnDB(_id ,ContactModel, Contact);   
    }
    const Athletes = new AthletesModel({
        id: People._id,
        age: body.age,
        IdContact: _id,
        ailments: body.ailments,
        medicines: body.medicines,
        allergies: body.allergies,
        bloodType: body.bloodType,
        shoeSize: body.shoeSize,
        tShirtSize: body.tShirtSize,
        tShortSize: body.tShortSize,
        height: body.height,
        weight: body.weight,
        state: body.state,
    });
    
    Promise.all([
        SavingOnDB(People),
        SavingOnDB(Athletes),
        contactSaved
       
    ])
        .then(resp => response.success(res, res, 'athlete was stored Safely', 201, resp))
        .catch((e) => response.error(res, res, 'error storeding peopel', 500, e))
};


/**
 * update a existing record 
 * @param {*} req 
 * @param {*} res 
 */

const updateItem = async (req, res) => {

    const id = req.params.id_search;
    const { body } = req;
    let {_id, ...Contact} = await ContactModel.findOne({ id: body.IdContact });
    let contactSaved
    if (!Contact) {
        Contact = new ContactModel({
            id: body.IdContact,
            Names: body.ContactNames,
            SureNames: body.ContactSureNames,
            neighborhood: body.Contactneighborhood,
            Address: body.ContactAddress,
            Phone: body.ContactPhone,
            occupation: body.Contactoccupation,
            email: body.Contactemail,
        });
        _id = Contact._id
        contactSaved = SavingOnDB(Contact);   
    }else {
        contactSaved = UpdatingOnDB(_id ,ContactModel, Contact);   
    }
    const Athlete = {
        age: body.age,
        IdContact: _id,
        ailments: body.ailments,
        medicines: body.medicines,
        allergies: body.allergies,
        bloodType: body.bloodType,
        shoeSize: body.shoeSize,
        tShirtSize: body.tShirtSize,
        tShortSize: body.tShortSize,
        height: body.height,
        weight: body.weight,
        state: body.state,
    };
 
  
    Promise.all([
        UpdatingOnDB(id, AthletesModel, Athlete),
        contactSaved
       
    ])
        .then(resp => response.success(req, res, 'athlete was updated Safely', 200, resp))
        .catch((e) => response.error(req, res, 'error Updating athlete', 500, e))
};


module.exports = {
    getItems,
    createItem,
    updateItem,
   

}
