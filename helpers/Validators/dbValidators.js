const { RoleModel } = require("../../models");
const { getNameColletios } = require("../../config/mongo")



const isRolValid = async (role = '') => {
    const existRol = await RoleModel.findOne({ role });
    if (!existRol) {
        throw new Error(`the rol ${role} does not exist on database`);
    }

};
const emailExist = async (email = '', collection) => {
    const existRol = await collection.findOne({ email });
    if (existRol) {
        throw new Error(`the email ${email} exist on database`);
    }

};
const ExistById = async (_id, collection) => {
    const existData = await collection.findById({ _id });
    console.log(existData);
    if (!existData) {
        throw new Error(`the User ${id} exist on database`);
    }

};
const emailNoExist = async (email = '', collection) => {
    const existRol = await collection.findOne({ email, deleted: false });
    if (!existRol) {
        throw new Error(`the email ${email} not exist on database`);
    }

};

const ExistCollections = async (nameColletions, next) => {
    await getNameColletios().then((colletions) => {
       const coleecion= colletions.find(({ name }) => { if (name === nameColletions) { return name} })
       if (!coleecion)
        throw new Error(`the table ${nameColletions} not exist on database`);
    }
    )


};




module.exports = {
    isRolValid,
    emailExist,
    ExistById,
    emailNoExist,
    ExistCollections
}