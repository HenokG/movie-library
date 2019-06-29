const mongoose = require("mongoose");

const RateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "can't be blank"]
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: [true, "can't be blank"]
    },
    rating: {
      type: Number,
      max: 5,
      min: 1,
      required: [true, "can't be blank"]
    },
    comment: { type: String, required: [true, "can't be blank"] }
  },
  { timestamps: true }
);

mongoose.model("Rate", RateSchema);
