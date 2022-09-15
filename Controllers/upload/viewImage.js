const path = require('path');
const fs = require('fs');
require('module-alias/register')
const { response } = require('@helpers');

/**
 * get a data image
 * @param {*} req 
 * @param {*} res 
 */
 const getImage = (req, res) => { 

    const  img = req.params.img;
    const  typeCollection = req.params.tipo;
    const CollectionsValide = ['staff', 'User']
    if (CollectionsValide.indexOf(typeCollection) < 0) 
        return response.error(req, res, 'Collection invalide', 400, `valid Extensions  are: ${CollectionsValide.join(', ')}`);

   const  pathimage = path.resolve(__dirname, `../../uploads/${typeCollection}/${img}`)
    if (fs.existsSync(pathimage)) {
        res.sendFile(pathimage);
    } else {

        const  pathnoimage = path.resolve(__dirname, `../../assets/no-img.jpg`);
        res.sendFile(pathnoimage);
    }
 };

 module.exports =  getImage;