import {config} from 'dotenv'
config();

export default {
    JSON_TOKEN : process.env.JSON_TOKEN as string,
    SALT_ROUNDS : process.env.SALT_ROUNDS as string
}