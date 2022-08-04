
const  fs = require('fs');
const  user = require('../../models/staff/user')
const  Teacher = require('../../models/staff/Teacher')
const  Athlete = require('../../models/staff/Athlete')


/**
 * Upload and update image
 * @param {*} req 
 * @param {*} res 
 */
 const UploadItem = async (req, res) => {
    const  typeCollection = req.params.tipo;
    const  id = req.params.id;
    const  CollectionsValide = ['deportista', 'User', 'personal']
    if (CollectionsValide.indexOf(typeCollection) < 0) {
        return res.status(400).json({
            ok: false,
            messge: 'Collection invalide',
            erros: { message: ' the collections valides are: ' + CollectionsValide.join(', ') }
        });

    }
    if (!req.files) {
        
        return res.status(400).json({
            ok: false,
            messge: 'THE FILE DID NOT LOAD',
            erros: { message: 'you did not select any image' }
        });
    }
    
    const  File = req.files.img;
    const  shortenedName = File.name.split('.');
    const  FileExtension = shortenedName[shortenedName.length - 1];

    const  ValidExtensions = ['png', 'jpg', 'gif', 'jpeg', 'PNG'];

    if (ValidExtensions.indexOf(FileExtension) < 0) {
        return res.status(400).json({
            ok: false,
            messge: 'invalid Extension ',
            erros: { message: ' valid Extensions  are;' + ValidExtensions.join(', ') }
        });
    }

    /**
     * customize file name
     */
    const  fileName = `${id}-${new Date().getMilliseconds()}.${FileExtension}`
    /**
     * path where we move the file
     */
    const  path = `./uploads/${typeCollection}/${fileName}`



    File.mv(
        path, err => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    messge: 'Error upload file',
                    erros: err
                });
            }
            updateByColletions(typeCollection, id, fileName, res);
        })

};

function updateByColletions(typeCollection, id, fileName, res) {

    switch (typeCollection) {
        case 'deportista':
            getById(id, Athlete).then(resp => {
                const  oldPath = './uploads/deportista/' + resp[0].img;
                //  si exite, elimina la imagen anterior
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath)

                }

                resp[0].img = fileName;
                updateImg(resp[0]).then(resp => {
                    res.status(200).json({
                        ok: true,
                        message: '  updated data',
                        response: resp
                    });
                }).catch(e => {
                    return res.status(500).json({
                        ok: false,
                        messge: 'error loading files when updating',
                        err: e
                    });
                })

            }).catch(e => {
                console.log(e);
                return res.status(500).json({
                    ok: false,
                    messge: 'error loading files when searching by id',
                    err: e
                });
            })

            break;
        case 'User':
            getById(id, user).then(resp => {
                const  oldPath = './uploads/User/' + resp[0].img;
                //  si exite, elimina la imagen anterior
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath)

                }

                console.log(resp[0].img);
                resp[0].img = fileName;
                updateImg(resp[0]).then(resp => {
                    res.status(200).json({
                        ok: true,
                        message: '  updated data',
                        response: resp
                    });
                }).catch(e => {
                    return res.status(500).json({
                        ok: false,
                        messge: 'error loading files when updating on collection ',
                        err: e
                    });
                })

            }).catch(e => {
                return res.status(500).json({
                    ok: false,
                    messge: 'error serching by id',
                    err: e
                });
            })

            break;
        case 'personal':
            getById(id, Teacher).then(resp => {
                const  oldPath = './uploads/personal/' + resp[0].img;
                //  si exite, elimina la imagen anterior
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath)

                }

                resp[0].img = fileName;
                updateImg(resp[0]).then(resp => {
                    res.status(200).json({
                        ok: true,
                        message: '  updated  image',
                        response: resp
                    });
                }).catch(e => {
                    return res.status(500).json({
                        ok: false,
                        messge: 'error loading files when updating',
                        err: e
                    });
                })

            }).catch(e => {
                return res.status(500).json({
                    ok: false,
                    messge: 'error loading files when searching by id',
                    err: e
                });
            })

            break;

        default:
            break;
    }

}

function updateImg(data) {
    return new Promise((resolve, reject) => {
        data.save((err, updatedData) => {
            (err)?reject('error trying update data (img) '): resolve(updatedData);
        });

    })
}
function getById(search, colection) {
    return new Promise((resolve, reject) => {
        colection.find({ _id: search })
            .exec((err, findedData) => {

                if (err) {
                    reject('error loanding colletion')
                } else {
                    resolve(findedData)
                }

            });

    });


}


module.exports = {
   
    UploadItem,

}