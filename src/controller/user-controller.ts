import User from "../service/user-service";
import {Request , Response} from 'express'
import  SuccessResponse  from "../utils/common/success-response";
import  ErrorResponse  from "../utils/common/error-response";

import { StatusCodes } from "http-status-codes";


export const  signUp = async(req : Request, res : Response) => {

    try {
        const userCreateData  = await User.signUpUser({
            username: req.body.username,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        }) 
        const response : SuccessResponse<typeof userCreateData> = {
            data: userCreateData,
        }
        return res.status(StatusCodes.CREATED).json(response);
    } catch (error) {
         const errorresponse : ErrorResponse<{}> = {
             error: error,
             data: undefined
         }
        return res.status(StatusCodes.BAD_REQUEST).json(errorresponse)
    }

}

export const signIn = async(req : Request, res : Response) => {

    try {
        const user  = await User.signInUser({
            username: req.body.username,
            password: req.body.password,
            
        }) 
        const response : SuccessResponse<typeof user> = {
            data: user,
        }
        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
         const errorresponse : ErrorResponse<{}> = {
             error: error,
             data: undefined
         }
        return res.status(StatusCodes.BAD_REQUEST).json(errorresponse)
    }

}
export const googleCreatedUser = async(req : Request, res : Response) => {

    try {
        const user  = await User.googleSignUp(req.headers.authorization as string); 
        const response : SuccessResponse<typeof user> = {
            data: user,
        }
        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
         const errorresponse : ErrorResponse<{}> = {
             error: error,
             data: undefined
         }
        return res.status(StatusCodes.BAD_REQUEST).json(errorresponse)
    }

}
