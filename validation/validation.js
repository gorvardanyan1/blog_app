export function validateUsername(username) {

    const minLength = 3;
    const maxLength = 20;

    const allowedCharacters = /^[a-zA-Z0-9_]+$/;

    if (username.length < minLength || username.length > maxLength) {
        return { isValid: false, error: 'Username must be between 3 and 20 characters long' };
    }

    if (!allowedCharacters.test(username)) {
        return { isValid: false, error: 'Username can only contain letters, numbers, and underscores' };
    }

    return { isValid: true };
}

export function validatePassword(password) {
    // Minimum length requirement
    const minLength = 8;

    // Regular expressions for complexity requirements
    const hasUpperCase = /[A-Z]/;
    const hasLowerCase = /[a-z]/;
    const hasDigit = /\d/;
    const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;

    if (password.length < minLength) {
        return { isValid: false, error: `Password must be at least ${minLength} characters long` };
    }

    if (!(hasUpperCase.test(password) && hasLowerCase.test(password) && hasDigit.test(password) && hasSpecialChar.test(password))) {
        return { isValid: false, error: 'Password must include at least one uppercase letter, one lowercase letter, one digit, and one special character' };
    }
    return { isValid: true };
}