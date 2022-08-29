const expres = require('express');
const app = expres();
const { getItems, createItem,updateItem } = require('../../Controllers/Staff/People');
const { token } = require('../../middleware');



/**
 * get al  teachers registered 
 */
 app.get('/', getItems);
 /**
  * upodate a Teache by id
  */
 app.put('/:id', token.verificatoken, updateItem);
 /**
  * save a register on data base (a teacher)
  */
 app.post('/',token.verificatoken,createItem);

 /**
  * [TODO] Deleted
  */ 
module.exports = app; 