import Joi from "joi"

export const postAdmin = Joi.object().keys({
    username: Joi.string().required().max(20).min(3),
    password: Joi.string().required().max(20)
})

export const catigoriesPost = Joi.object().keys({
    category_name: Joi.string().required().max(20).min(3),
})

export const catigoriesPut = Joi.object().keys({
    id: Joi.number().required().min(1)
})

export const productsPost = Joi.object().keys({
    sub_category_id: Joi.number().required(),
    model: Joi.string().required(),
    product_name: Joi.string().required(),
    color: Joi.string().required(),
    price: Joi.string().required(),
})

export const productsPut = Joi.object().keys({
    id: Joi.number().required().min(1)
})

export const subCategoriesPost = Joi.object().keys({
    category_id: Joi.number().required(),
    sub_category_name: Joi.string().required()
}) 

export const subCategoriesId = Joi.object().keys({
    id: Joi.number().required().min(1)
})





















