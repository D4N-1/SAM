import { enumErrorCode } from "./enum.error.js";

export class AppError extends Error {
    public code: enumErrorCode;
    public isCustom: boolean;

    constructor(
        code: enumErrorCode,
        message?: string,
        isCustom = true
    ) {
        super(message);
        this.code = code;
        this.isCustom = isCustom;
    }
}