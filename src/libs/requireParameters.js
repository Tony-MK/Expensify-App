"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = requireParameters;
/**
 * @throws {Error} If the "parameters" object has a null or undefined value for any of the given parameterNames
 *
 * @param parameterNames Array of the required parameter names
 * @param parameters A map from available parameter names to their values
 * @param commandName The name of the API command
 */
function requireParameters(parameterNames, parameters, commandName) {
    parameterNames.forEach((parameterName) => {
        if (parameterName in parameters && parameters[parameterName] !== null && parameters[parameterName] !== undefined) {
            return;
        }
        const propertiesToRedact = ['authToken', 'password', 'partnerUserSecret', 'twoFactorAuthCode'];
        const parametersCopy = { ...parameters };
        Object.keys(parametersCopy).forEach((key) => {
            if (!propertiesToRedact.includes(key.toString())) {
                return;
            }
            parametersCopy[key] = '<redacted>';
        });
        const keys = Object.keys(parametersCopy).join(', ') || 'none';
        let error = `Parameter ${parameterName} is required for "${commandName}". `;
        error += `Supplied parameters: ${keys}`;
        throw new Error(error);
    });
}
