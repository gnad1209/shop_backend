const ProductService = require("../services/ProductService");

const createProduct = async (req, res) => {
  try {
    const body = { ...req.body };
    const { name, type, price, countInStock, rating, ...data } = body;
    const file = req.file;
    if (!name || !type || !price || !countInStock || !rating) {
      return res.status(400).json({
        status: "ERR",
        message: "the input reuired",
      });
    }
    const upload = await ProductService.uploadImage(file);
    body.image = upload.url;
    const response = await ProductService.createProduct(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const data = req.body;
    const file = req.file;

    if (!productId) {
      return res.status(400).json({
        status: "ERR",
        message: "the productid is required",
      });
    }
    const upload = await ProductService.uploadImage(file);
    data.image = upload.url;
    const response = await ProductService.updateProduct(productId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getDetailProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(400).json({
        status: "ERR",
        message: "the userid is required",
      });
    }
    const response = await ProductService.getDetailProduct(productId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;
    const response = await ProductService.getAllProduct(
      Number(limit) || 0,
      Number(page) || 0,
      sort,
      filter
    );
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const token = req.headers;
    if (!productId) {
      return res.status(400).json({
        status: "ERR",
        message: "the userid is required",
      });
    }
    const response = await ProductService.deleteProduct(productId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const softDeleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const token = req.headers;
    if (!productId) {
      return res.status(400).json({
        status: "ERR",
        message: "the userid is required",
      });
    }
    const response = await ProductService.softDeleteProduct(productId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteMany = async (req, res) => {
  try {
    const ids = req.body.ids;
    if (!ids) {
      return res.status(200).json({
        status: "ERR",
        message: "The ids is required",
      });
    }
    const response = await ProductService.deleteManyProduct(ids);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllType = async (req, res) => {
  try {
    const response = await ProductService.getAllType();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  getDetailProduct,
  deleteProduct,
  softDeleteProduct,
  getAllProduct,
  deleteMany,
  getAllType,
};
