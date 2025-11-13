import productRepository from '../repositories/productRepository.js';

// Product service functions
const productService = {
  // Create a new product
  async createProduct(productData) {
    return productRepository.create(productData);
  },

  // Get product by ID
  async getProductById(id) {
    return productRepository.findById(id);
  },

  // Get all published products
  async getAllProducts() {
    return productRepository.findAll();
  },

  // Update product
  async updateProduct(id, productData) {
    return productRepository.update(id, productData);
  },

  // Delete product
  async deleteProduct(id) {
    return productRepository.remove(id);
  },
};

export default productService;