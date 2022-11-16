import { errorHandler } from "../errors/errorsHandler.js";
import { read, write } from "../utils/FS.js";
import { catigoriesPost, catigoriesPut } from "../validate/validate.js";

const GET = async (req, res, next) => {
  const { error, value } = catigoriesPut.validate(req.params)

  if (error) next(new errorHandler(error.message, 400))
  const { id } = value

  const category = await read("categories.json").catch((error) => next(new errorHandler(error, 401)))

  const subCategories = await read("subCategories.json").catch((error) => next(new errorHandler(error, 401)))

  const categories = category.find((e) => e.category_id == id)

  if (!categories) next(new errorHandler("No such Id information available", 400))

  const data = [categories].map((e) => {
    console.log(e);
    e.categoryId = e.category_id
    e.categoryName = e.category_name
    e.subCategories = e.subCategories
    e.subCategories = []
    delete e.category_id
    delete e.category_name

    subCategories.filter((a) => {
      a.subCategoryId = a.sub_category_id
      a.subCategoryName = a.sub_category_name
      delete a.sub_category_id
      delete a.sub_category_name

      if (a.category_id == e.categoryId && delete a.category_id) e.subCategories.push(a)
    })

    return e;
  })

  res.send(data)
}

const GETCATEGORIES = async (req, res, next) => {

  const category = await read("categories.json").catch((error) => next(new errorHandler(error, 401)))

  const subCategories = await read("subCategories.json").catch((error) => next(new errorHandler(error, 401)))

  const data = category.map((e) => {
    e.categoryId = e.category_id
    e.categoryName = e.category_name
    e.subCategories = e.subCategories
    e.subCategories = []
    delete e.category_id
    delete e.category_name

    subCategories.map((a) => {
      if (a.category_id == e.categoryId && delete a.category_id) {
        a.subCategoryId = a.sub_category_id
        a.subCategoryName = a.sub_category_name
        delete a.sub_category_id
        delete a.sub_category_name
        e.subCategories.push(a)
      }})

    return e;
  })

  
  const { categoryId, categoryName } = req.query
  
  const filterData = data.filter((e) => {
    const categoryid = categoryId ? e.categoryId == categoryId : true;
    const categoryname = categoryName? e.categoryName.toLowerCase().includes(categoryName.toLowerCase()) : true;
    
    return categoryid && categoryname;
  })

  res.send(filterData)
}

const POSTCATEGORIES = async (req, res, next) => {
  const { error, value } = catigoriesPost.validate(req.body)

  if (error) next(new errorHandler(error.message, 400))
  const { category_name } = value

  const category = await read("categories.json").catch((error) =>
    next(new errorHandler(error, 401)))

  category.push({
    category_id: category.at(-1)?.category_id + 1 || 1,
    category_name
  })

  const newCategort = await write("categories.json", category).catch(
    (error) => next(new errorHandler(error, 401)))

  if (newCategort) {
    return res.status(200).json({
      message: "Put categort name",
      status: 200
    })
  }
}

const PUTCATEGORIES = async (req, res, next) => {
  const { error, value } = catigoriesPut.validate(req.params)

  if (error) next(new errorHandler(error.message, 401))
  const { id } = value

  const { error: errors, value: values } = catigoriesPost.validate(req.body)

  if (errors) next(new errorHandler(errors.message, 401))
  const { category_name } = values

  const category = await read("categories.json").catch((error) =>
    next(new errorHandler(error, 401)))

  const categoryFind = category.find((e) => e.category_id == id)

  if (!categoryFind) next(new errorHandler("No such Id information available", 400))

  categoryFind.category_name = category_name || categoryFind.category_name

  const newcategory = await write("categories.json", category).catch(
    (error) => next(new errorHandler(error, 401)))

  if (newcategory) {
    return res.status(200).json({
      message: "Put became"
    })
  }
}

const DELETECATEGORIES = async (req, res, next) => {
  const { error, value } = catigoriesPut.validate(req.params)

  if (error) next(new errorHandler(error.message, 401))
  const { id } = value

  const category = await read("categories.json").catch((error) => next(new errorHandler(error, 401)))

  const newcategoryFind = category.find((e) => e.category_id == id)

  if (!newcategoryFind) next(new errorHandler("No such Id information available", 401))

  const categoryFind = category.findIndex((e) => e.category_id == id)

  category.splice(categoryFind, 1)

  const newcategory = await write("categories.json", category).catch((error) => next(new errorHandler(error, 401)))

  if (newcategory) {
    return res.status(200).json({
      message: "Delete became"
    })
  }
}

export { GETCATEGORIES, GET, POSTCATEGORIES, PUTCATEGORIES, DELETECATEGORIES };
