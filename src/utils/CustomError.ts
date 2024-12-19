export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    message: string;
    constructor(message: string, statusCode: number, isOperational: boolean) {
        super(message);
        this.message = message
        this.statusCode = statusCode
        this.isOperational = isOperational

        Error.captureStackTrace(this, this.constructor);
    }
}