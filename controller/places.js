const Place = require("../models/place");
const fs = require('fs')
const ErrorHandler = require('../utils/ErrorHandler');
const { geometry } = require("../utils/hereMaps");

const index = async (req, res) => {
  const places = await Place.find({});
  const clusteringPlace = places.map(place => {
    return {
      latitude: place.geometry.coordinates[1],
      longitude: place.geometry.coordinates[0]
    }
  })
  const clusteredPlace = JSON.stringify(clusteringPlace)
  res.render("places/index.ejs", { places, clusteredPlace });
};

const getCreate = async (req, res) => {
  res.render("places/create.ejs");
}

const store = async (req, res, next) => {
  const images = req.files.map(file => ({
    url: file.path,
    filename: file.filename
  }))

  const geoData = await geometry(req.body.place.location)

  const place = new Place(req.body.place);
  place.author = req.user._id;
  place.images = images
  place.geometry = geoData
  await place.save();
  console.log(place);
  req.flash("success_msg", "places add successfully");
  res.redirect(`/places`);
};

const detail = async (req, res) => {
  const { id } = req.params;
  const place = await Place.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  res.render("places/detail.ejs", { place });
};

const getEdit = async (req, res) => {
  const { id } = req.params;
  const place = await Place.findById(id);
  res.render("places/edit.ejs", { place });
};

const update  = async (req, res) => {
  const { id } = req.params;
  const { place } = req.body;
  const geoData = await geometry(place.location)
  const newPlace = await Place.findByIdAndUpdate(id, {...place, geometry: geoData});

  if (req.files && req.files.length > 0) {
    newPlace.images.forEach(image => {
      fs.unlink(image.url, err => new ErrorHandler(err))
    });

    const image = req.files.map(file => ({
      url: file.path,
      filename: file.filename,
    }))
    newPlace.images = image
    await newPlace.save()
  }
  req.flash("success_msg", "places updated successfully");
  res.redirect(`/places/${id}`);
}

const destroy = async (req, res) => {
  const { id } = req.params;
  const places = await Place.findById(id)
  if (places.images && places.images.length > 0) {
    places.images.forEach(image => {
      fs.unlink(image.url, err => new ErrorHandler(err))
    });
  }
  // await Place.findByIdAndDelete(id);
  await places.deleteOne()
  req.flash("success_msg", "places deleted successfully");
  res.redirect("/places");
}

const destroyImages = async(req, res) => {
  const {id} = req.params
  const {images} = req.body

  if(!images || images.length === 0) {
    req.flash('error_msg','please select at least one image')
    return res.redirect(`/places/${id}/edit`)
  }

  images.forEach((image => {
    fs.unlinkSync(image)
  }))

  await Place.findByIdAndUpdate(
    id,
    { $pull : {images : {url : { $in : images}}}},
  )
  req.flash('success_msg','success deleted images')
  return res.redirect(`/places/${id}/edit`)
}

module.exports = { index, getCreate,store, detail, getEdit, update, destroy,destroyImages };
