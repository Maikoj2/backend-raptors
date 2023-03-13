const jwt = require('jsonwebtoken');

const cretateJWT = async(Data) => {
    const SEED = process.env.SEED
    const token =   jwt.sign({ Data }, SEED, { expiresIn: 3600 });
  
    return token
}


module.exports = { cretateJWT }