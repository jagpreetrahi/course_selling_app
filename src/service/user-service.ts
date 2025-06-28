import UserRepository from "../repository/user-repostiory";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../utils/error/app-error";
import config from './../config';
import {z} from 'zod';
import {OAuth2Client} from  'google-auth-library'
import {createToken  , verifyToken ,  hashPassword, comparePassword} from './../utils/common/auth'
import * as jwt from "jsonwebtoken";

const user_repository  = new UserRepository();
const client = new OAuth2Client(config.GoogleClient.CLIENT_ID);

// signUpValidation 
const signUpValidation = z.object({
     username: z.string().email(),
     password : z.string(),
     firstName: z.string(),
     lastName: z.string(),
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
        const hashedPass = await hashPassword(data.password) 
        // create a new user
        const user = await user_repository.create({
            username : data.username,
            password : hashedPass,
            firstName: data.firstName,
            lastName: data.lastName
        });
        //  generate a token for user
        const token = createToken({ user_id: user.id,username: user.username})
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
        const comparePass = comparePassword(data.password , isUserExists.password);
        if(!comparePass){
            return "invalid password"
        }
        //  generate a token for user
        const token = createToken({
            user_id: isUserExists.id,
            username: isUserExists.username
        })
        return {token};
     } catch (error) {
         throw new AppError("Cannot create a new user" , StatusCodes.INTERNAL_SERVER_ERROR)
     }
}

const googleSignUp = async(idToken : string) => {

    try {
        const ticket = await client.verifyIdToken({idToken , audience : config.GoogleClient.CLIENT_ID});

        const payload = ticket.getPayload();

        if(!payload?.email){
            throw new AppError("Invalid google token" , StatusCodes.BAD_REQUEST)
        }

        // check whether the user already exists or not 
        const existingUser = await user_repository.get({username : payload.email});

        if(existingUser){
            return "user is already existing"
        }

        const newUserByGoogle = await user_repository.create({
            username : payload.email,
            firstName : payload.given_name,
            lastName : payload.family_name,
            profile : payload.picture,
            authProvider : "google"
        })

        const token = createToken({user_id: newUserByGoogle.id, username: newUserByGoogle.username})
        return {token};

        
    } catch (error) {
        console.log("Something went wrong while creatig a user by google auth " , error);
        throw error;
    }

}

const authenticatedUser = async(token: string)=> {

    try {

        if(!token){
             throw new AppError("Token is missing" , StatusCodes.BAD_REQUEST)
        }
        const response = verifyToken(token);
        if(typeof response === 'object' && 'user_id' in response){
           const user = await user_repository.get(response.user_id)
           if(!user){
                throw new AppError("No user found" , StatusCodes.NOT_FOUND)
            }
           return user;
        }
    } catch (error) {
         throw new AppError("Something went Wrong" , StatusCodes.INTERNAL_SERVER_ERROR)
    }
}


export default {
    signInUser,
    signUpUser,
    googleSignUp,
    authenticatedUser
}