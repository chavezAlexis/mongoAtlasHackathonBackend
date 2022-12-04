const { validationResult } = require("express-validator");


function isThereErrors (req)
{
    const errors = validationResult(req);
    if (!errors.isEmpty()) 
    {
        return errors;
    }
    return false;
}

module.exports = isThereErrors;