import { APIGatewayProxyResult } from "aws-lambda";

export class GenericResponse {

    static success<T>(data: T, message: string = 'Success'): APIGatewayProxyResult {
        return {
            statusCode: 200,
            body: JSON.stringify({
                message,
                data
            })
        };
    }

    static created<T>(data: T, message: string = 'Created'): APIGatewayProxyResult {
        return {
            statusCode: 201,
            body: JSON.stringify({
                message,
                data
            })
        };
    }

    static error (message: string = 'Internal Server Error'): APIGatewayProxyResult {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: message })
        }
    }

    static badRequest(message: string = 'Bad Request'): APIGatewayProxyResult {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: message })
        }
    
    }
    static conflict(message: string = 'Conflict'): APIGatewayProxyResult {
        return {
            statusCode: 409,
            body: JSON.stringify({ error: message })
        }
    }

}
