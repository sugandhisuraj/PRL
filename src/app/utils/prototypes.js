import { validateEmail } from './validation';

String.prototype.validateEmail = function() {
    return validateEmail(this);
};