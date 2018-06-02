const Joi = require('joi');

const userSchema = {
    id: Joi.number().integer().required(),
    loc: Joi.object().keys({
		    lat: Joi.number(),
		    long: Joi.number()
		}).with('lat', 'long').length(2).required(),
    dropLoc: Joi.object().keys({
		    lat: Joi.number(),
		    long: Joi.number()
		}).with('lat', 'long').length(2).required(),
    prefCol: Joi.string().required()
};

const validateUserObj = (obj) => {
    let {error} = Joi.validate(obj,userSchema);
    if(error){
        return error;
    }
}

module.exports.validateUserObj = validateUserObj;