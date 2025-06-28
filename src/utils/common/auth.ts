import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'
import config from '../../config';

type JwtPayload = {
  user_id: string;
  username?: string;
  
};

export function comparePassword(previousPassword : string , hashPassword :string){

    try {
        const response = bcrypt.compareSync(previousPassword , hashPassword);
        return response
    } catch (error) {
        throw error
    }
}

export  function createToken(inputData : JwtPayload){

    try {
        const token = jwt.sign(inputData , config.JsonConfig.JSON_TOKEN, {expiresIn: config.JsonConfig.JWT_EXPIRY as jwt.SignOptions['expiresIn']})
        return token
    } catch (error) {
        throw error
    }
}

export  function verifyToken(inputToken : string){

    try {
        const token = jwt.verify(inputToken , config.JsonConfig.JSON_TOKEN)
        return token
    } catch (error) {
        throw error
    }
}

export function hashPassword(password : string){

    try {
        return bcrypt.hash(password , Number(config.JsonConfig.SALT_ROUNDS))
    } catch (error) {
         throw error
    }
}