export class AppError extends Error {
    public statusCode: number;
    public isOperational : boolean;

    // Constructor initializes the AppError instance with a message and a status code. It also sets the isOperational property to true, indicating that this error is expected and can be handled gracefully.
    constructor(message: string, statudCode: number){
        super(message);
        this.statusCode = statudCode;
        this.isOperational = true

    // Captures the stack trace for the error, helps in debugging by providing information about where the error occurred.
    Error.captureStackTrace(this, this.constructor);
    }
} 