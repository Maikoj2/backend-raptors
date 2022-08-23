
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
       
      const data = {
        saveed:saveRegister(Contact),
        _id: Contact._id,
      }
      return ;   
    }else {
        const data = {
            saveed:UpdateRegister(_id ,ContactModel, Contact),
            _id:_id,
          }
        return data ;   
    }
};
module.exports  = saveAndUpdating;