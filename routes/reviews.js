const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const validasiObjectId = require("../middlewares/isValidObjectId");
const isAuth = require("../middlewares/isAuth");
const { isAuthorReview } = require("../middlewares/isAuthor");
const reviewController = require("../controller/reviews");
const { validateReview } = require('../middlewares/validator')

router.post(
  "/",
  isAuth,
  validateReview,
  validasiObjectId("/places"),
  wrapAsync(reviewController.createReview)
);

router.delete(
  "/:idReviews",
  isAuth,
  isAuthorReview,
  validasiObjectId("/places"),
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
