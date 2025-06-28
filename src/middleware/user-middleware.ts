import UserService from '../service/user-service'
import {StatusCodes} from 'http-status-codes'
import ErrorResponse from "../utils/common/error-response"
import {Response , Request , NextFunction} from 'express'

// validate the user 
export const validateUser = (req : Request , res : Response , next : NextFunction ) => {
    

     if(req.body.username && req.body.password && req.body.firstName && req.body.lastName){
        
        next();
    }
    else if(req.body.username && req.body.password){
        next();
    }
    else{
        const response : ErrorResponse<{}> ={
            error: {explanation :  "You are not providing the correct details"}
        }
        
        return res.status(StatusCodes.BAD_REQUEST).json(response);
    }

}

export const  checkAuthenticate = async (req : Request, res : Response , next : NextFunction) => {
    const authHeader = req.headers['authorization'];
     if (!authHeader || !authHeader.startsWith('Bearer ')) {
       return res.status(401).json({ error: 'Token missing or invalid' });
    }
    const token = authHeader.split(' ')[1];
    console.log(authHeader);
    const response : ErrorResponse<{}> ={
       error: {explanation : "Authentication header not found"}
    }
    if(!authHeader){
        return res.status(StatusCodes.NOT_FOUND).json(response);
    }

   try {
       const response = await UserService.authenticatedUser(token)
        if(response){
           (req as any).username = response // setting the user.id to the req.user 
           next();
       }
   } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
   }
}

