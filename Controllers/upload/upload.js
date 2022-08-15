
const fs = require('fs');
const { SearchingByIdOnDB, response, SavingOnDB } = require('../../helpers');
const { UserModel, PeopleModel } = require('../../models');



/**
 * Upload and update image
 * @param {*} req 
 * @param {*} res 
 */
const UploadItem = async (req, res) => {
    const typeCollection = req.params.tipo;
    const id = req.params.id;
    const CollectionsValide = ['Stuff', 'User']
    if (CollectionsValide.indexOf(typeCollection) < 0)
        return response.error(req, res, 'Invalid collection type', 400, `the collections valides are: ${CollectionsValide.join(', ')}`);

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

        updateByColletions(typeCollection, id, fileName, res, req);
    })

};

function updateByColletions(typeCollection, id, fileName, res, req) {

    const colletionshandler = {
        Stuff: SearchingByIdOnDB(id,PeopleModel),
        User: SearchingByIdOnDB(id,UserModel),
    };
   colletionshandler[typeCollection].then(resp => {
   
    console.log(resp);

        const oldPath = `./uploads/${typeCollection}/${ resp[0].img}`;
        //  si exite, elimina la imagen anterior
        (fs.existsSync(oldPath)) && fs.unlinkSync(oldPath)

        resp[0].img = fileName;
        console.log(resp);
        SavingOnDB(resp[0])
            .then(resp => response.success(req, res, 'Athlete image updated successfully', 200, resp))
            .catch(e => response.error(req, res, 'error loading files when updating', 500, e))

    }).catch(e => {
    
        return response.error(req, res, 'error loading files when searching by id', 500, e)

    })
}


module.exports = {

    UploadItem,

}