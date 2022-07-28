const path = require('path');
const fs = require('fs');


/**
 * get a data image
 * @param {*} req 
 * @param {*} res 
 */
 const getImage = (req, res) => { 

    const  img = req.params.img;
    const  typeCollection = req.params.tipo;
    const  CollectionsValide = ['deportista', 'User', 'personal']
    if (CollectionsValide.indexOf(typeCollection) < 0) {
        return res.status(400).json({
            ok: false,
            messge: 'Collection invalide',
            erros: { message: ' the collections valides are: ' + CollectionsValide.join(', ') }
        });

    }

   const  pathimage = path.resolve(__dirname, `../../uploads/${typeCollection}/${img}`)
    if (fs.existsSync(pathimage)) {
        res.sendFile(pathimage);
    } else {

        const  pathnoimage = path.resolve(__dirname, `../../assets/no-img.jpg`);
        res.sendFile(pathnoimage);
    }
 };

 module.exports =  getImage;