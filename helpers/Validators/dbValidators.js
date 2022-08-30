const { RoleModel, payModeModel } = require("../../models");
const { getNameColletios } = require("../../config/mongo");
const { Populate } = require("..");



const isRolValid = async (role = '') => {
    const existRol = await RoleModel.findOne({ role });
    if (!existRol) {
        throw new Error(`the rol: '${role}' does not exist on database`);
    }

};
const isPaymodeValid = async (payMode = '') => {
    const existpay = await payModeModel.findOne({ payMode });
    if (!existpay) {
        throw new Error(`the payMode: '${payMode}' does not exist on database`);
    }

};
const emailExist = async (email = '', collection) => {
    const existRol = await collection.findOne({ email });
    if (existRol) {
        throw new Error(`the email: '${email}' exist on database`);
    }

};
const ExistById = async (_id, collection) => {

    const existData = await collection.findById({ _id });
    if (!existData) {
        throw new Error(`the data whith id: '${_id}' not exist on database`);
    }

};
const emailNoExist = async (email = '', collection) => {
    const existRol = await collection.findOne({ email, deleted: false });
    if (!existRol) {
        throw new Error(`the email: '${email}' not exist on database`);
    }

};

const ExistCollections = async (nameColletions, next) => {
    await getNameColletios().then((colletions) => {
       const coleecion= colletions.find(({ name }) => { if (name === nameColletions) { return name} })
       if (!coleecion)
        throw new Error(`the table '${nameColletions}' not exist on database`);
    }
    )


};

const ExistSignupontable = async ({id_Athlete, id_class}, Colletion) => {

       const data = await Colletion.findOne({ id_Athlete, id_class, deleted: false })
       if (data)
        throw new Error(`the athlete: '${id_Athlete}' is signed up  in ${id_class}`);
}


const ExistTeacher = async (_id, collection) => {

    const existData = await collection.findById({ _id }).populate(Populate.staff);
    if (!existData) {
        throw new Error(`the data whith id: '${_id}' not exist on database`);
    }
    if (existData.id.role !== 'TEACHER_ROLE') {
        throw new Error(`the personal whith id: '${existData.id.id}' is not a teacher`); 
    }



};

const DeletedBaseSalary = async (id_BaseSalary, collection) => {

    const existData = await collection.find({ id_BaseSalary });
    if (Object.keys(existData).length !== 0) {
        throw new Error(`This record is assigned, please delete the staff record and try again'`);
    }

};





module.exports = {
    isRolValid,
    emailExist,
    ExistById,
    emailNoExist,
    ExistCollections,
    isPaymodeValid,
    ExistSignupontable,
    ExistTeacher,
    DeletedBaseSalary
}