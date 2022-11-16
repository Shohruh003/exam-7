import { read, write } from "../utils/FS.js";
import { errorHandler } from "../errors/errorsHandler.js";
import { subCategoriesId, subCategoriesPost } from "../validate/validate.js";

const SUBGETIDCATEGORIES = async (req, res, next) => {
  const { error, value } = subCategoriesId.validate(req.params)

  if (error) next(new errorHandler(error.message, 401))
  const { id } = value

  const subCategories = await read("subCategories.json").catch((error) => next(new errorHandler(error, 401)))

  const products = await read("products.json").catch((error) => next(new errorHandler(error, 401)))

  const newsubCategories = subCategories.find((e) => e.sub_category_id == id)

  if (!newsubCategories) next(new errorHandler("No such Id information available", 401))

  const data = [newsubCategories].map((e) => {
    e.subCategoryId = e.sub_category_id
    e.subCategoryName = e.sub_category_name
    e.products = []
    delete e.category_id
    delete e.sub_category_id
    delete e.sub_category_name

    products.filter((a) => {
      a.productName = a.product_name

      if (a.sub_category_id == e.subCategoryId) {
        delete a.product_name
        delete a.sub_category_id
        e.products.push(a)
      }
    })
    return e;
  })

  res.send(data)
}

const SUBGETCATEGORIES = async (req, res, next) => {

  const subCategories = await read("subCategories.json").catch((error) =>
    next(new errorHandler(error, 401)))

  const products = await read("products.json").catch((error) =>
    next(new errorHandler(error, 401)))

  const data = subCategories.map((e) => {
    e.subCategoryId = e.sub_category_id
    e.subCategoryName = e.sub_category_name
    e.products = []
    delete e.category_id
    delete e.sub_category_id
    delete e.sub_category_name

    products.map((a) => {
      if (a.sub_category_id == e.subCategoryId && delete a.sub_category_id) {
        a.productName = a.product_name
        delete a.product_name
        e.products.push(a)
      }
    })

    return e;
  })

  const { subCategoryId, subCategoryName } = req.query

  const dataFilter = data.filter((e) => {
    const categoryId = subCategoryId ? e.subCategoryId == subCategoryId : true;

    const categoryName = subCategoryName ? e.subCategoryName.toLowerCase().includes(subCategoryName.toLowerCase()) : true;

    return categoryId && categoryName
  })

  res.send(dataFilter)
}

const SUBPOSTCATEGORIES = async (req, res, next) => {
  const { error, value } = subCategoriesPost.validate(req.body)

  if (error) next(new errorHandler(error.message, 401))
  const { category_id, sub_category_name } = value

  const subCategories = await read("subCategories.json").catch((error) =>
    next(new errorHandler(error, 401)))

  subCategories.push({
    sub_category_id: subCategories.at(-1)?.sub_category_id + 1 || 1,
    category_id,
    sub_category_name
  })

  const newsubCategories = await write("subCategories.json", subCategories).catch((error) => next(new errorHandler(error, 401)))

  if (newsubCategories) {
    return res.status(200).json({
      message: "Put subCategories name",
      status: 200
    })
  }
}

const SUBPUTCATEGORIES = async (req, res, next) => {
  const { error, value } = subCategoriesId.validate(req.params)

  if (error) next(new errorHandler(error.message, 401))
  const { id } = value

  const { error: errors, value: values } = subCategoriesPost.validate(req.body)

  if (errors) next(new errorHandler(errors.message, 401))
  const { category_id, sub_category_name } = values

  const subCategories = await read("subCategories.json").catch((error) => next(new errorHandler(error, 401)))

  const subCategoriesFind = subCategories.find((e) => e.sub_category_id == id)

  if (!subCategoriesFind) next(new errorHandler("No such Id information available", 401))

  subCategoriesFind.category_id = category_id || subCategoriesFind.category_id
  subCategoriesFind.sub_category_name = sub_category_name || subCategoriesFind.sub_category_name

  const newsubCategories = await write("subCategories.json", subCategories).catch((error) => next(new errorHandler(error, 401)))

  if (newsubCategories) {
    return res.status(200).json({
      message: "It has been placed"
    })
  }
};

const SUBDELETECATEGORIES = async (req, res, next) => {
  const { error, value } = subCategoriesId.validate(req.params);

  if (error) next(new errorHandler(error.message, 401))
  const { id } = value

  const subCategories = await read("subCategories.json").catch((error) => next(new errorHandler(error, 401)))

  const newsubCategoriesFind = subCategories.find((e) => e.sub_category_id == id)

  if (!newsubCategoriesFind) next(new errorHandler("No such Id information available", 401))

  const subCategoriesFindIndex = subCategories.findIndex((e) => e.sub_category_id == id)

  subCategories.splice(subCategoriesFindIndex, 1)

  const newsubCategories = await write("subCategories.json", subCategories).catch((error) => next(new errorHandler(error, 401)))

  if (newsubCategories) {
    return res.status(200).json({
      message: "Delete became"
    })
  }
}

export { SUBGETCATEGORIES, SUBGETIDCATEGORIES, SUBPOSTCATEGORIES, SUBPUTCATEGORIES, SUBDELETECATEGORIES }
