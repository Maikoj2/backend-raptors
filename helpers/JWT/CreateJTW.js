const jwt = require('jsonwebtoken');

const cretateJWT = async(Data) => {
    const SEED = process.env.SEED
    const token =   jwt.sign({ Data }, SEED, { expiresIn: 14400 });
  
    return token
}


module.exports = { cretateJWT }