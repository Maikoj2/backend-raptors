const { response, request } = require("express");
const { response: Response} = require('../helpers');

const isValidAdmin = (req =  request , res = response, next) => {
   const {  role } = req.user
   if   (role !== 'ADMIN_ROLE') return  Response.error(req, res, `Invalid role the User ${req.user.Names} don't have permission`,401 , ` rol invalid`)
   next();

};
const haveRol = (...roles) => {

  return  (req =  request , res = response, next) => {
        const {  role } = req.user
        if   (!roles.includes(role)) return  Response.error(req, res, `Invalid role the User ${req.user.Names} don't have permission`,401 , ` valid role '${roles}' `)
        next();
     
     }
  

};

module.exports = {isValidAdmin,haveRol}