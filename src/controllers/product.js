import { errorHandler } from "../errors/errorsHandler.js";
import { read, write } from "../utils/FS.js";
import { productsPost, productsPut } from "../validate/validate.js";

const GETPRODUCT = async (req, res, next) => {
  const products = await read("products.json").catch((error) => next(new errorHandler(error, 401)))

  const categories = await read("categories.json").catch((error) => next(new errorHandler(error, 401)))

  const subCategories = await read("subCategories.json").catch((error) => next(new errorHandler(error, 401)))


  const newproducts = products.filter((e) => {
    e.productId = e.product_id
    e.productName = e.product_name
    delete e.product_id
    delete e.product_name

    return e;
  })

  const { categoryId, subCategoryId, model } = req.query

  const subCategoriesFilter = subCategories.filter(
    (e) => e.category_id == categoryId
  )

  if (categoryId) {
    let array = [];
    subCategoriesFilter.filter((e) => {
      newproducts.map((a) => {
        if (e.sub_category_id == a.sub_category_id) {
          array.push(a)
        }
      })
    })

    return res.send(array)
  }

  const dataFilter = newproducts.filter((e) => {
    const newsubCategoryId = subCategoryId? e.sub_category_id == subCategoryId : true;
    const categoryname = model? e.model.toLowerCase().includes(model.toLowerCase()) : true;

    return categoryname && newsubCategoryId
  })

  res.send(dataFilter)
}

const GETIDPRODUCT = async (req, res, next) => {
  const { error, value } = productsPut.validate(req.params)

  if (error) next(new errorHandler(error.message, 400))
  const { id } = value

  const products = await read("products.json").catch((error) => next(new errorHandler(error, 401)))

  const newproducts = products.find((e) => e.product_id == id)

  if (!newproducts) next(new errorHandler("No such Id information available", 401))

  const newproductsFilter = [newproducts].filter((e) => {
    e.productId = e.product_id
    e.productName = e.product_name
    delete e.product_id
    delete e.sub_category_id
    delete e.product_name

    return e;
  })

  res.send(newproductsFilter)
}

const POSTPRODUCT = async (req, res, next) => {
  const { error, value } = productsPost.validate(req.body)

  if (error) next(new errorHandler(error, 400))

  const { sub_category_id, model, product_name, color, price } = value

  const products = await read("products.json").catch((error) => next(new errorHandler(error, 401)))

  products.push({
    product_id: products.at(-1)?.product_id + 1 || 1,
    sub_category_id,
    model,
    product_name,
    color,
    price
  })

  const newProducts = await write("products.json", products).catch((error) => next(new errorHandler(error, 401)))

  if (newProducts) {
    return res.status(200).json({
      message: "Put products name",
      status: 200
    })
  }
}

// ============================== PUT PRODUCT =================================

const PUTPRODUCT = async (req, res, next) => {
  const { error, value } = productsPut.validate(req.params)

  if (error) next(new errorHandler(error, 400))
  const { id } = value

  const { error: errors, value: values } = productsPost.validate(req.body)

  if (errors) next(new errorHandler(errors.message, 400))

  const { sub_category_id, model, product_name, color, price } = values

  const products = await read("products.json").catch((error) => next(new errorHandler(error, 401)))

  const productsFind = products.find((e) => e.product_id == id)

  if (!productsFind) next(new errorHandler("No such Id information available", 401))

  productsFind.sub_category_id = sub_category_id || productsFind.sub_category_id
  productsFind.model = model || productsFind.model
  productsFind.product_name = product_name || productsFind.product_name
  productsFind.color = color || productsFind.color
  productsFind.price = price || productsFind.price

  const newproducts = await write("products.json", products).catch((error) => next(new errorHandler(error, 401)))

  if (newproducts) {
    return res.status(200).json({
      message: "It has been placed"
    })
  }
}

// ============================== DELET PRODUCT =================================

const DELETEPRODUCT = async (req, res, next) => {
  const { error, value } = productsPut.validate(req.params)

  if (error) next(new errorHandler(error, 400))
  const { id } = value;

  const products = await read("products.json").catch((error) => next(new errorHandler(error, 401)))

  const newproductsFind = products.find((e) => e.product_id == id)

  if (!newproductsFind) next(new errorHandler("No such Id information available", 401))

  const productsFindIndex = products.findIndex((e) => e.product_id == id)

  products.splice(productsFindIndex, 1)

  const newproducts = await write("products.json", products).catch((error) => next(new errorHandler(error, 401)))

  if (newproducts) {
    return res.status(200).json({
      message: "Delete became"
    })
  }
}

export { GETIDPRODUCT, GETPRODUCT, POSTPRODUCT, PUTPRODUCT, DELETEPRODUCT }
