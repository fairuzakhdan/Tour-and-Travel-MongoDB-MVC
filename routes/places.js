const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const validasiObjectId = require("../middlewares/isValidObjectId");
const isAuth = require("../middlewares/isAuth");
const { isAuthorPlace } = require("../middlewares/isAuthor");
const placeContoller = require("../controller/places");
const { validatePlace } = require("../middlewares/validator");
const upload = require("../config/multer");

router
  .route("/")
  .get(wrapAsync(placeContoller.index))
  .post(
    isAuth,
    upload.array("image", 5),
    validatePlace,
    wrapAsync(placeContoller.store)
  );

router.get("/create", isAuth, placeContoller.getCreate);

router
  .route("/:id")
  .get(validasiObjectId("/places"), wrapAsync(placeContoller.detail))
  .put(
    isAuth,
    isAuthorPlace,
    upload.array("image", 5),
    validasiObjectId("/places"),
    validatePlace,
    wrapAsync(placeContoller.update)
  )
  .delete(
    isAuth,
    isAuthorPlace,
    validasiObjectId("/places"),
    wrapAsync(placeContoller.destroy)
  );

router.get(
  "/:id/edit",
  isAuth,
  isAuthorPlace,
  validasiObjectId("/places"),
  wrapAsync(placeContoller.getEdit)
);

router.delete(
  "/:id/images",
  isAuth,
  isAuthorPlace,
  validasiObjectId("/places"),
  wrapAsync(placeContoller.destroyImages)
);

module.exports = router;
