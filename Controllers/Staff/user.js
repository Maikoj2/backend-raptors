const { UserModel } = require('../../models')
const bcrypt = require('bcryptjs');


/**
 * get a  list 
 * @param {*} req 
 * @param {*} res 
 */
const getItems = async (req, res) => {

    let from = req.query.from || 0;
    from = Number(from);

    await UserModel.find({}, 'Name email img role createdAt updatedAt')
        .skip(from)
        .limit(5)
        .exec(
            (err, user) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuraio',
                        erros: err
                    });
                }
                UserModel.estimatedDocumentCount({}, (err, count) => {

                    res.status(200).json({
                        ok: true,
                        users: user,
                        total: count
                    });

                })


            });
};

/**
 * get a data
 * @param {*} req 
 * @param {*} res 
 */
const getItem = (req, res) => { };

/**
 * create new register 
 * @param {*} req 
 * @param {*} res 
 */
const createItem = async (req, res) => {
    const { body } = req;

    user = new UserModel({
        Name: body.Name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });
    await user.save((err, userSaved) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensage: 'Error create user',
                err: err
            });
        }
        res.status(201).json({
            ok: true,
            body: userSaved,
            // usertoken: req.usuario
        });

    });


};
/**
 * update a existing record 
 * @param {*} req 
 * @param {*} res 
 */

const updateItem = async (req, res) => {

    const id = req.params.id;
    const body = req.body;

    await UserModel.findById(id, (err, user) => {


        if (err) return res.status(500).json({
            ok: false,
            mensaje: 'Error al buscar usuario',
            erros: err
        });


        if (!user) return res.status(400).json({
            ok: false,
            message: 'the user ' + id + ' no found',
            erros: { message: `the user don't exist ` }
        });


        user.Name = body.Name;
        user.email = body.email;
        user.role = body.role;

        user.save((err, savededUser) => {

            if (err) return res.status(400).json({
                ok: false,
                messege: 'Error upduting User',
                erros: err
            });
            savededUser.password = '<3'
            res.status(200).json({
                ok: true,
                user: savededUser
            });

        });

    });

};

/**
 * delete a existing record
 * @param {*} req 
 * @param {*} res 
 */
const deleteItem = async (req, res) => {
    const id = req.params.id;

    await UserModel.deleteOne({ _id: id }, (err, deletedUser) => {


        if (err) return res.status(500).json({
            ok: false,
            mesagge: 'Error deleting user',
            erros: err
        });
        if (!deletedUser) return res.status(400).json({
            ok: false,
            message: 'the user ' + id + ' no found',
            erros: { message: `the user don't exist ` }
        });

        res.status(200).json({
            ok: true,
            message: 'User udateded successfully',
            user: deletedUser
        });



    });
};







module.exports = {
    getItems,
    getItem,
    createItem,
    updateItem,
    deleteItem
}