const mongoose = require("mongoose");

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
    actors: Array
  },
  { timestamps: true }
);

MovieSchema.methods.toJSONFor = () => {
  return { hi: "hi" };
};

mongoose.model("Movie", MovieSchema);
