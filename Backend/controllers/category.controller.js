import { Category } from "../models/category.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { uploadOnCloudinary } from "../cloudinary.js"

export const getCategories = asyncHandler(async(req, res) => {

  const categories = await Category.find({ isActive: true })
    .sort({ createdAt: -1 })

  return res.status(200).json(
    new ApiResponse(200, categories, "Categories fetched successfully")
  )
})

export const createCategory = asyncHandler(async(req, res) => {

  const { name, description } = req.body

  // ✅ closing bracket in right place
  if(!name){
    throw new ApiError(400, "Category name is required")
  }

  // check if category already exists
  const existingCategory = await Category.findOne({ name })
  if(existingCategory){
    throw new ApiError(409, "Category already exists")
  }

  // ✅ handle image upload correctly
  let imageUrl = ""
  const imageLocalPath = req.file?.path
  if(imageLocalPath){
    const uploaded = await uploadOnCloudinary(imageLocalPath)
    imageUrl = uploaded?.url || ""
  }

  const newCategory = await Category.create({
    name,
    description,
    image: imageUrl
  })

  if(!newCategory){
    throw new ApiError(500, "Something went wrong while creating category")
  }

  return res.status(201).json(
    new ApiResponse(201, newCategory, "Category created successfully")  // ✅ 201 not 200
  )
})

export const updateCategory = asyncHandler(async(req, res) => {

  const { categoryId } = req.params
  const { name, description } = req.body

  // check category exists
  const category = await Category.findById(categoryId)
  if(!category){
    throw new ApiError(404, "Category not found")
  }

  // check if new name already exists
  if(name && name !== category.name){
    const existingCategory = await Category.findOne({ name })
    if(existingCategory){
      throw new ApiError(409, "Category with this name already exists")
    }
  }

  // handle image update
  let imageUrl = category.image  // keep existing by default

  const imageLocalPath = req.file?.path
  if(imageLocalPath){
    const uploaded = await uploadOnCloudinary(imageLocalPath)
    imageUrl = uploaded?.url || category.image
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    categoryId,
    {
      name: name || category.name,
      description: description || category.description,
      image: imageUrl
    },
    { new: true }
  )

  return res.status(200).json(
    new ApiResponse(200, updatedCategory, "Category updated successfully")
  )
})
export const deleteCategory = asyncHandler(async(req, res) => {

  const { categoryId } = req.params

  const category = await Category.findById(categoryId)
  if(!category){
    throw new ApiError(404, "Category not found")
  }

  // ✅ just deactivate, don't delete
  category.isActive = false
  await category.save({ validateBeforeSave: false })

  return res.status(200).json(
    new ApiResponse(200, {}, "Category deactivated successfully")
  )
})
