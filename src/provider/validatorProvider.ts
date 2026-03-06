import validator from "validator";


// interfaces
export interface IValidatorProvider {
    validateEmail(email: string): boolean;
}

export class ValidatorValidatorProvider implements IValidatorProvider {
    validateEmail(email: string): boolean {
        return validator.isEmail(email);
    }
}


