const expres = require('express');
const app = expres();
const { getItems, createItem,updateItem } = require('../../Controllers/Staff/People');
const autenticacion = require('../../middelware/autenticacion')


/**
 * get al  teachers registered 
 */
 app.get('/', getItems);
 /**
  * upodate a Teache by id
  */
 app.put('/:id', autenticacion.verificatoken, updateItem);
 /**
  * save a register on data base (a teacher)
  */
 app.post('/', autenticacion.verificatoken, createItem);

 /**
  * [TODO] Deleted
  */ 
module.exports = app; 