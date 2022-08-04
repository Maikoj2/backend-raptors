const expres = require('express');
const app = expres();
const autenticacion = require('../../middelware/autenticacion');
const { getItems, createItem, updateItem, deleteItem } = require('../../Controllers/Staff/user');

/**
 * get a list of all users 
 */
app.get('/', autenticacion.verificatoken, getItems);

/**
 * Create a new user on database 
 */
app.post('/', createItem);

/**
 * Update a user by id 
 */
app.put('/:id', autenticacion.verificatoken, updateItem );

/**
 * delete a user by id 
 */

app.delete('/:id', autenticacion.verificatoken, deleteItem);

module.exports = app; 