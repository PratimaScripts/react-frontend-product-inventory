import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null); // State for selected product (for update/delete)
  const [addProductError, setAddProductError] = useState(null); // State to hold error message

  console.log(process.env);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  console.log('API_BASE_URL:', API_BASE_URL);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/product/`);
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addProduct = async () => {
    try {
      await axios.post(`${API_BASE_URL}/product`, {
        productId,
        productName,
        productPrice,
      });
      fetchProducts(); // Update product list after adding
      setProductId('');
      setProductName('');
      setProductPrice('');
      setAddProductError(null); // Clear error message on success

    } catch (error) {
      if (error.response && error.response.status === 409) { // Check for conflict (product already exists)
        setAddProductError('Product with this ID already exists');
      } else {
        console.error('Error adding product:', error);
        setAddProductError('Error adding product');
      }    
    }
  };

  const updateProduct = async () => {
    if (!selectedProduct) return; // Check if a product is selected for update

    try {
      console.log('About to update the product with ID:', selectedProduct.productId);
      await axios.patch(`${API_BASE_URL}/product/`, {
        productId: selectedProduct.productId,
        updateKey: 'product', // Specify the key you want to update, e.g., product
        updateValue: {
          productName: productName, // Use the value you want to update productName with
          productPrice: productPrice
        }
      });
      fetchProducts(); // Update product list after updating
      setSelectedProduct(null); // Clear selected product state
      setProductId('');
      setProductName('');
      setProductPrice('');
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const deleteProduct = async (product) => {
    try {
      console.log('Deleting product with ID:', product);
      await axios.delete(`${API_BASE_URL}/product/${product}`);
      fetchProducts(); // Update product list after deleting
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product); // Set selected product for update/delete
    setProductId(product.productId);
    setProductName(product.productName);
    setProductPrice(product.productPrice);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <h1>Product Inventory</h1>
          <div className="card">
            <div className="card-body">
              <h2>Add Product</h2>
              <form>
                <div className="mb-3">
                  <label htmlFor="productId" className="form-label">
                    Product ID
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="productId"
                    placeholder="Product ID"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    disabled={selectedProduct} // Disable ID field for update
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="productName" className="form-label">
                    Product Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="productName"
                    placeholder="Product Name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="productPrice" className="form-label">
                    Product Price
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="productPrice"
                    placeholder="Product Price"
                    value={productPrice}
                    // onChange={(e) => setProductPrice(e.target.value)}
                    onChange={(e) => {
                      const enteredValue = e.target.value;
                      // Regular expression for numeric value validation
                      const numericRegex = /^\d*\.?\d*$/;
                      // Check if the entered value matches the numeric pattern or if it's an empty string
                      if (enteredValue === '' || numericRegex.test(enteredValue)) {
                        // Update the productPrice state only if it's a valid numeric value or empty string
                        setProductPrice(enteredValue);
                      }
                    }}
                  />
                </div>
                {addProductError && <p className="text-danger">{addProductError}</p>}

                <div className="d-flex justify-content-between">
                  <button type="button" className="btn btn-primary" onClick={addProduct}>
                    Add
                  </button>
                  {selectedProduct && (
                    <button type="button" className="btn btn-warning" onClick={updateProduct}>
                      Update
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <h2>Products</h2>
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Product Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.productId}>
                    <td>{product.productId}</td>
                    <td>{product.productName}</td>
                    <td>${product.productPrice}</td>
                    <td>
                      <div className="d-flex">
                        <button
                          type="button"
                          className="btn btn-primary me-2"
                          onClick={() => handleSelectProduct(product)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => deleteProduct(product.productId)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>

  );
}

export default App;
