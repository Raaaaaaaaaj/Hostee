import { Response } from "express";

// Used to send a response to the client with a consistent structure
export const sendResponse = <T>(
    res: Response,
    statusCode: number,
    message: string,
    data?: T 
) => {

    // Takes in a response object, a status code, a message and optional data. It sends JSON reponse to the client with a success flag, message, and data. The success flag is determined by checking if the status code is in the 200-299 range, indicating a successful response.
    return res.status(statusCode).json({
        success: statusCode >= 200 && statusCode < 300,
        message,
        data: data || null
    })
}