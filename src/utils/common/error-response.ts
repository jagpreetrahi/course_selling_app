export default interface ErrorResponse<T = any , E =any> {
     success?: false,
     message?: "Something went wrong",
     data?: T,
     error : E
} 