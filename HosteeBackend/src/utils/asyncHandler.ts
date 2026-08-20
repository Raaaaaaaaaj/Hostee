import { Request, Response, NextFunction } from 'express';

// Utility function to hanlde asynchronous operations in Express routes. It takes a function as an argument and returns a new function that wraps the original function in a Promise. If the original function throws an error, it will be caught and passed to the next middleware (error handler) in the Express pipeline.
export const commonAsyncHandler = (fn: Function) =>{
    return (req: Request, res: Response, next: NextFunction) =>{
        Promise.resolve(fn(req, res, next)).catch(next)
    }
}