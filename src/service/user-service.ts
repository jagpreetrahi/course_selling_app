import UserRepository from "../repository/user-repostiory";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../utils/error/app-error";
import * as jwt from "jsonwebtoken";
import config from './../config';
import {z} from 'zod';
import * as bcrypt from 'bcrypt'

const user_repository  = new UserRepository();
// signUpValidation 
const signUpValidation = z.object({
     username: z.string().email(),
     password : z.string(),
     firstName : z.string(),
     lastName : z.string(),
})

type signUpInput = z.infer<typeof signUpValidation>
// for a new users
const signUpUser = async (data : signUpInput) => {
    try {
        const userDataValidation = signUpValidation.safeParse(data);
        if(!userDataValidation.success){
            return "Your data is not valid"
        }
        // check if the user is existed already or not
        const user_found = await user_repository.get({username : data.username});
        if(user_found){
            return "User is already exits";
        }

        // hash the password
        const hashPassword = await bcrypt.hash(data.password , Number(config.JsonConfig.SALT_ROUNDS)) 
        // create a new user
        const user = await user_repository.create({
            username : data.username,
            password : hashPassword,
            firstName : data.firstName,
            lastName : data.lastName
        });
        //  generate a token for user
        const token = jwt.sign({user_id : user.id}, config.JsonConfig.JSON_TOKEN , {algorithm : "RS256"})
        return {token};
    } catch (error) {
        throw new AppError("Cannot create a new user" , StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

// validation data for signIn
const signInValidation = z.object({
    username: z.string().email(),
    password : z.string(),
})

type signInInput = z.infer<typeof signInValidation>
const signInUser = async (data : signInInput) => {
     try {
        const signInDataValidation = signInValidation.safeParse(data);
        if(!signInDataValidation.success){
            return "Your provided data is not valid"
        }
        // check the user exists or not
        const isUserExists = await user_repository.get({username : data.username});
        if(!isUserExists){
            return "User does not exists"
        }
        // compare the password
        const comparePassword = bcrypt.compare(data.password , isUserExists.password);
        if(!comparePassword){
            return "invalid password"
        }
        //  generate a token for user
        const token = jwt.sign({user_id : isUserExists.id}, config.JsonConfig.JSON_TOKEN , {algorithm : "RS256"})
        return {token};
     } catch (error) {
         throw new AppError("Cannot create a new user" , StatusCodes.INTERNAL_SERVER_ERROR)
     }
}



export default {
    signInUser,
    signUpUser
}