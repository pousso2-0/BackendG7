// src/utils/Validator.js

class Validator {
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static validatePassword(password, minLength = 6) {
        return password && password.length >= minLength;
    }

    static validateString(str, minLength = 1) {
        return str && typeof str === 'string' && str.length >= minLength;
    }

    static validateEnum(value, allowedValues) {
        return allowedValues.includes(value);
    }

    static validateUserData(userData) {
        const errors = [];

        if (!this.validateString(userData.name)) {
            errors.push('Name is required and must be a string');
        }
        

        if (!this.validateEmail(userData.email)) {
            errors.push('Valid email is required');
        }

        if (!this.validatePassword(userData.password)) {
            errors.push('Password must be at least 6 characters long');
        }

        if (!this.validateEnum(userData.type, ['freelancer', 'client' , 'admin' , 'tailleur'])) {
            errors.push('Type must be either "freelancer" or "client or "admin" or "tailleur"');
        }

        return errors.length > 0 ? { error: { details: errors.map(e => ({ message: e })) } } : { error: null };
    }
}

export default Validator;