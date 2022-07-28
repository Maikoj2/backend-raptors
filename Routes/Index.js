

const express = require('express');
const router = express.Router()
const fs = require('fs');

const RemoveExtension =(filename)=>{
    return filename.split('.').shift()
}
fs.readdirSync(__dirname).filter((file)=>{
    const dir = file;

    if (file !== 'Index.js') {
        fs.readdirSync(`${__dirname}/${file}`).filter((file)=>{
            const  name = RemoveExtension(file)
            // console.log(`./${ dir }/${ file }`);
           router.use(`/${ name }`,require(`./${ dir }/${ file }`));
        });
        
    }
})

module.exports = router; 