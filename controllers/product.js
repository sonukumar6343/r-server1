import { Product } from "../models/product.js";
import ErrorHander from "../utils/errorhandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";


const getAllProducts = catchAsyncErrors(async (req, res, next) => {
 const products=await Product.find({});

  res.status(200).json({
    success: true,
    products,
  });
});

const getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHander("Product not found", 404));
  res.status(200).json({ success: true, product });
});

const categories = [
  "All Collections",
  "Verified Brand",
  "Verified Artist",
  "New Drop",
  "Live Shows",
];

const categorywiseproduct = catchAsyncErrors(async (req, res, next) => {
  const { category } = req.query;
  if (!category) return next(new ErrorHander("Category is required", 400));

  // If "All Collections" is selected, return all products
  let filter = {};
  if (category !== "All Collections") {
    // Ensure the category is valid before querying
    if (!categories.includes(category)) {
      return next(new ErrorHander("Invalid category", 400));
    }

    // Exact match with category field in database
    filter = { category: category };
  }

  const products = await Product.find(filter);

  if (products.length === 0) return next(new ErrorHander("No products found for this category", 404));

  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
});

export { getProductDetails, getAllProducts,categorywiseproduct };
