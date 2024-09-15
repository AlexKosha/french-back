export const errorMessageTemplate = (fieldName) => ({
  "string.empty": `"${fieldName}" cannot be an empty field`,
  "any.required": `missing required field "${fieldName}"`,
});
