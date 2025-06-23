export class AppError extends Error {
    statusCode: number;
    explanation : any

    constructor(message : any , statusCode : number){
        super(message);
        this.statusCode = statusCode
        this.explanation = message
    }
}