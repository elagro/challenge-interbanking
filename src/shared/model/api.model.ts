import { Injectable } from "@nestjs/common";
import { Expose } from "class-transformer";
import { AppConfig } from "src/config/env.config";

@Injectable()
export class ApiResponseErrorDetail {
    @Expose()
    code: string;
    
    @Expose()
    message: string;
    
    @Expose()
    stack?: string
  
    static constructorFromError(code: string, error: Error): ApiResponseErrorDetail {
        const message = String(error.message);
        const stack = String(error.stack);

        return new ApiResponseErrorDetail(code, message, stack);
    }

    constructor(code: string, message: string, stack?: string) {
        this.code = code;
        this.message = message;
        AppConfig.getInstance().NODE_ENV === 'development' ? this.stack = stack : undefined;
    }
};

export abstract class BaseApiResponse<T = unknown> {
    @Expose()
    success: boolean;
    
    @Expose()
    message?: string;
    
    @Expose()
    data?: T;
    
    @Expose()
    error?: ApiResponseErrorDetail;


    constructor(success: boolean, message?: string, data?: T, error?: ApiResponseErrorDetail) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.error = error;
    }
};

export class ApiResponseSuccess<T = unknown> extends BaseApiResponse<T> {
    constructor(
        data?: T
    ) {
        const success = true;
        const message = undefined;
        const error = undefined;

        super(success, message, data, error);
    }
}

export class ApiResponseError extends BaseApiResponse<undefined> {
    constructor(
        message: string,
        error?: ApiResponseErrorDetail,
    ) {
        const success = false;
        const data = undefined;

        super(success, message, data, error);
    }
}