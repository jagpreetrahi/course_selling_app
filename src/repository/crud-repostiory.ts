export default class CrudRepository{
    model: any;
    
    constructor(model : any){
         this.model = model
    }

    create = async(data : any) => {
        const response = await this.model.create(data);
        return response;
    }

    delete = async(data:any) => {
        const response =  await this.model.delete({
            where : {
                id : data
            }
        })

        return response;
    }

    get = async(data: any) => {
        const response = await this.model.findUnique({
            where : {
                id : data
            }
        })
        return response
    }

    getAll  = async() => {
        const response = await this.model.findMany();
        return response
    }

    update = async(id : number, data:any /*data should be an object */) => {
        const response = await this.model.update({
           where : {
              id : id
           },
           data
        })
        return response 
    }


}

