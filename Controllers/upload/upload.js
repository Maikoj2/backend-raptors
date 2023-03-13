const fs = require('fs');
require('module-alias/register');

const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_APY_KEY,
    api_secret: process.env.CLOUDINARY_API_SERCRET,
    secure: true
})
const { SearchingByIdOnDB, response, SavingOnDB } = require('@helpers');
const { UserModel, PeopleModel } = require('@models');
const { UpdatingOnDB } = require('../../helpers');



/**
 * Upload and update image
 * @param {*} req 
 * @param {*} res 
 */
const UploadItem = async (req, res) => {
    const typeCollection = req.params.collection;
    const id = req.params.id;
    if (!req.files)
        return response.error(req, res, 'THE FILE DID NOT LOAD', 400, `you did not select any image`);


    const File = req.files.img;
    const shortenedName = File.name.split('.');
    const FileExtension = shortenedName[shortenedName.length - 1];
    const ValidExtensions = ['png', 'jpg', 'gif', 'jpeg', 'PNG'];

    if (ValidExtensions.indexOf(FileExtension) < 0)
        return response.error(req, res, 'invalid Extension', 400, `valid Extensions  are: ${ValidExtensions.join(', ')}`);

    /**
     * customize file name
     */
    const fileName = `${id}-${new Date().getMilliseconds()}.${FileExtension}`
    /**
     * path where we move the file
     */
    const path = `./uploads/${typeCollection}/${fileName}`



    File.mv(path, err => {
        if (err) return response.error(req, res, 'Error upload file', 400, err);
        cloudinary.uploader
            .upload(path,{folder: "Raptor_Images_uploads",})
            .then(({secure_url}) =>{ updateByColletions(typeCollection, id, secure_url, res, req, path)});

    })

};
function updateByColletions(typeCollection, id, secure_url, res, req,path) {

    const colletionshandler = {
        staff: SearchingByIdOnDB(id, PeopleModel),
        User: SearchingByIdOnDB(id, UserModel),
    };

    colletionshandler[typeCollection].then(resp => {
        // elimina la imagen del backend
        fs.unlinkSync(path)
        if(resp.img){
            const nombrearr = resp.img.split('/')
            const nombre = nombrearr[nombrearr.length -1];
            const [ public_id] = nombre.split('.');
            cloudinary.uploader.destroy(public_id)
        }
        resp.img = secure_url;
        UpdatingOnDB(
            resp._id,
            (typeCollection === 'User' ? UserModel : PeopleModel),
            resp
        )
            .then(resp => response.success(req, res, 'image updated successfully', 200, resp))
            .catch(e => response.error(req, res, 'error loading files when updating', 500, e))

    }).catch(e => {

        return response.error(req, res, 'error loading files when searching by id', 500, e)

    })
}


module.exports = {
    UploadItem
}