const Joi = require("joi");


module.exports.personalSchema = Joi.object({
    personal: Joi.object({
        name:Joi.string().required(),
        workstation: Joi.string().required(),
        location: Joi.string().required(),
        startdate: Joi.string().required(),
        birthdate: Joi.string().required(),
        image: Joi.string().required()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required()
    }).required()
})