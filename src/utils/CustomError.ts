export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number, isOperational: boolean) {
        super(message);
        this.statusCode = statusCode
        this.isOperational = isOperational

        Error.captureStackTrace(this, this.constructor);
    }
}