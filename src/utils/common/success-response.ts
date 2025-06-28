export default interface SuccessResponse<T = any , E =any> {
     success?: true,
     message?: "Successfully created",
     data : T,
     error?: E
} 