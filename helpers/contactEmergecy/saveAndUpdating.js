
const { ContactModel } = require("../../models");
const saveRegister = require("../db/saving");
const UpdateRegister = require("../db/updating");

const saveAndUpdating = async (IdContact) => {

    let {_id, ...Contact} = await ContactModel.findOne({ id: IdContact });
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
      return  [ saveRegister(Contact),Contact._id];   
    }else {
        return  [UpdateRegister(_id ,ContactModel, Contact), _id];   
    }
};
module.exports  = saveAndUpdating;