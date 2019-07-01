const mongoose = require("mongoose");
/**
 * Represent a Movie
 */
const MovieSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: {
      type: String,
      required: [true, "can't be blank"],
      index: true
    },
    releaseDate: Date,
    duration: Number,
    actors: Array,
    shared: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

/**
 * register Movie model
 */
mongoose.model("Movie", MovieSchema);
