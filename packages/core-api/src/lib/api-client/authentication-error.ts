export class AuthenticationError extends Error {
    code: number;

    constructor(message: string, code = 0) {
        super(message);
        this.name = 'AuthenticationError';
        this.code = code;
    }
}
