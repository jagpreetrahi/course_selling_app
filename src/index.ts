import express, {Express} from 'express'

import serverConfig from './config/server-config';
const app : Express = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}))


app.listen(serverConfig.PORT, () => {
    console.log(`Successfully run the server on port ${serverConfig.PORT}`)
})