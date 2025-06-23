import CrudRepository from './crud-repostiory'
import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();

export default class UserRepository extends CrudRepository{

    constructor(){
        super(prisma.user)
    }
}