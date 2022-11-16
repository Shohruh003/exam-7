import { Router } from "express";
import { POSTCATEGORIES, PUTCATEGORIES, DELETECATEGORIES, GET, GETCATEGORIES} from "../controllers/categories.js";
import { DELETEPRODUCT, GETPRODUCT, GETIDPRODUCT, POSTPRODUCT, PUTPRODUCT } from "../controllers/product.js";
import { SUBDELETECATEGORIES, SUBGETCATEGORIES, SUBGETIDCATEGORIES, SUBPOSTCATEGORIES, SUBPUTCATEGORIES } from "../controllers/subCategories.js";
import { LOGIN } from "../controllers/userlogin.js";
import chekToken from "../middlewares/chekToken.js";

const router = Router()

// =================================== LOGIN ===================================

router.post("/login", LOGIN)

// =================================== CATEGORIES ===================================

router.get("/categories", GETCATEGORIES)
router.get("/categories/:id", GET)
router.post("/categories/post",chekToken, POSTCATEGORIES)
router.put("/categories/put/:id", chekToken, PUTCATEGORIES)
router.delete("/categories/delete/:id", chekToken, DELETECATEGORIES)

// =================================== PRODUCT ===================================

router.get("/products", GETPRODUCT)
router.get("/products/:id", GETIDPRODUCT)
router.post("/product/post", POSTPRODUCT)
router.put("/product/put/:id", PUTPRODUCT)
router.delete("/product/delete/:id", DELETEPRODUCT)

// =================================== SUBCATEGORIES ===================================
router.get("/subcategories", SUBGETCATEGORIES)
router.get("/subCategories/:id", SUBGETIDCATEGORIES)
router.post("/subCategories/post", SUBPOSTCATEGORIES)
router.put("/subCategories/put/:id", SUBPUTCATEGORIES)
router.delete("/subCategories/delete/:id", SUBDELETECATEGORIES)

export default router