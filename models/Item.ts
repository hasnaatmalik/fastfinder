import mongoose from "mongoose";

// Define the Item schema
const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please provide a description"],
    trim: true,
  },
  category: {
    type: String,
    required: [true, "Please select a category"],
    enum: ["Electronics", "Clothing", "Accessories", "Documents", "Other"],
  },
  type: {
    type: String,
    required: [true, "Please specify if the item is lost or found"],
    enum: ["lost", "found"],
  },
  location: {
    type: String,
    required: [true, "Please provide the location"],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, "Please provide the date"],
  },
  images: [
    {
      type: String,
    },
  ],
  contactInfo: {
    type: String,
    required: [true, "Please provide contact information"],
  },
  status: {
    type: String,
    enum: ["open", "closed", "claimed"],
    default: "open",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Item must belong to a user"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create text index for search functionality
itemSchema.index({
  title: "text",
  description: "text",
  category: "text",
  location: "text",
});

// Update the updatedAt field on save
itemSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Create the model from the schema
const Item = mongoose.models.Item || mongoose.model("Item", itemSchema);

export default Item;
