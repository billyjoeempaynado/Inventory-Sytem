
let currentPage = 1;
const productsPerPage = 6;

// Fetch and display products
export function fetchProducts() {
    fetch('http://localhost:8080/api/inventory/products/products')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(products => {
            localStorage.setItem('inventoryProducts', JSON.stringify(products));
            displayProducts(products);
        })
        .catch(error => console.error('Error fetching products:', error));
}

function debounce(func, delay) {
  let timer;
  return function (...args) {
      const context = this;
      clearTimeout(timer);
      timer = setTimeout(() => {
          func.apply(context, args);
      }, delay);
  };
}

document.getElementById('searchProductInput').addEventListener('input', searchProducts);

export function searchProducts() {
  const searchQuery = document.getElementById('searchProductInput').value.trim().toLowerCase();
  const products = JSON.parse(localStorage.getItem('inventoryProducts')) || [];

  const filteredProducts = products.filter(item => 
      item.product_name.toLowerCase().includes(searchQuery) ||
      String(item.price).toLowerCase().includes(searchQuery)  // Convert price to string
  );

  // Reset pagination to page 1 when searching
  currentPage = 1;

  // Display filtered items (make sure it handles pagination)
  displayProducts(filteredProducts);
}

const debouncedSearchProducts = debounce(searchProducts, 300); // 300ms delay

// Attach the debounced function to the input event
document.getElementById('searchProductInput').addEventListener('input', debouncedSearchProducts);

export function displayProducts(products) {
  const totalPages = Math.ceil(products.length / productsPerPage);
  const paginatedProducts = paginate(products, currentPage, productsPerPage);
  const tableBody = document.querySelector('#productTableBody');
  tableBody.innerHTML = ''; // Clear existing rows

  if (paginatedProducts.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="3" class="text-center">No product found.</td></tr>';
  } else {
      paginatedProducts.forEach(product => {
        
          const row = document.createElement('tr');

          row.innerHTML = `
              <td class="py-4 px-6 text-sm text-gray-500"></td>
              <td class="py-4 px-6 text-sm font-medium text-gray-900">${product.product_name}</td>
              <td class="py-4 px-6 text-sm text-gray-500">  &#8369; ${product.price}</td>
              <td class="py-4 px-6 text-sm text-gray-500"></td>
              <td class="py-4 px-6 text-sm text-gray-500"></td>
              <td class="py-4 px-6 text-sm text-gray-500"></td>
              <td class="py-4 px-6 text-sm text-gray-500"></td>
              <td class="sm:flex py-4 px-6 text-sm">
                  <button data-id="${product.id}" class="edit-product-btn p-2 text-gray-700 hover:text-gray-500">
                      <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button data-id="${product.id}" class="delete-product-btn p-2 text-red-700 hover:text-red-500">
                      <i class="fa-solid fa-trash-can" style="color: #f84444;"></i>
                  </button>
              </td>
          `;
          tableBody.appendChild(row);
      });

      // Attach event listeners after adding rows
      attachProductEventListeners();
  }

  // Add Pagination Controls
  setupPaginationControls(totalPages, () => displayProducts(products));  // Use displayproduct for re-rendering
}



// Pagination function to get products for the current page
function paginate(products, page, productsPerPage) {
  const start = (page - 1) * productsPerPage;
  const end = start + productsPerPage;
  return products.slice(start, end);
}

function setupPaginationControls(totalPages, fetchProductsCallback) {
  const productPaginationControls = document.getElementById('productPaginationControls');
  productPaginationControls.innerHTML = ''; // Clear existing buttons

   // Previous Button
   const productPrevButton = document.createElement('button');
   productPrevButton.textContent = 'Previous';
   productPrevButton.className = `px-4 py-2 rounded bg-gray-300 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`;
   productPrevButton.disabled = currentPage === 1;
   productPrevButton.addEventListener('click', () => {
       if (currentPage > 1) {
           currentPage--;
           fetchProductsCallback();
       }
   });
   productPaginationControls.appendChild(productPrevButton);

   // Page Number Buttons
   for (let page = 1; page <= totalPages; page++) {
       const productPageButton = document.createElement('button');
       productPageButton.textContent = page;
       productPageButton.className = `px-4 py-2 rounded ${page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-300'}`;
       
       productPageButton.addEventListener('click', () => {
           currentPage = page;
           fetchProductsCallback();
       });

      productPaginationControls.appendChild(productPageButton);
   } 

   // Next Button
   const productNextButton = document.createElement('button');
   productNextButton.textContent = 'Next';
   productNextButton.className = `px-4 py-2 rounded bg-gray-300 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`;
   productNextButton.disabled = currentPage === totalPages;
   productNextButton.addEventListener('click', () => {
       if (currentPage < totalPages) {
           currentPage++;
           fetchProductsCallback();
       }
   });
   productPaginationControls.appendChild(productNextButton);
}
// Attach event listeners for edit and delete buttons
function attachProductEventListeners() {
  // Edit Buttons
  document.querySelectorAll('.edit-product-btn').forEach(button => {
      button.addEventListener('click', (event) => {
          const productId = event.currentTarget.getAttribute('data-id');
          const products = JSON.parse(localStorage.getItem('inventoryProducts')) || [];
          const productToEdit = products.find(product=> product.id === Number(productId));
          if (productToEdit) {
              // Open the modal and populate fields with the existing product data
              openEditProductModal(productId, productToEdit.product_name, productToEdit.price);
          } else {
              console.error('Product not found:', productId);
          }
      });
  });

    // Delete Buttons
    document.querySelectorAll('.delete-product-btn').forEach(button => {
      button.addEventListener('click', deleteProduct);
  });
}

// Reusable modal functions
export function openAddProductModal() {
  const productForm = document.getElementById('productForm');
  productForm.setAttribute('data-mode', 'add');  // Set form mode to 'add'
  console.log('Form mode set to:', productForm.getAttribute('data-mode'));  // Debugging log

  // Clear the input fields
  document.getElementById('productName').value = '';
  document.getElementById('price').value = '';

  // Update modal title and button text for "Add"
  document.getElementById('productModalTitle').innerText = 'Add product';
  document.getElementById('productSubmitButton').innerText = 'Add';

  // Open the modal (assuming you have some modal logic)
  document.getElementById('productModal').classList.remove('hidden');
}


// Function to open the Item Modal (for both Add and Edit)
export function openEditProductModal(productId, productName, price) {
  const productForm = document.getElementById('productForm');
  productForm.setAttribute('data-mode', 'edit');  // Set form mode to 'edit'
  productForm.setAttribute('data-id', productId);    // Set the form's data-id to the ProductID

  
  document.getElementById('productIdName').classList.remove('hidden');
 
  // Set the hidden productId input field
  document.getElementById('hiddenProductId').value = productId;

  // Populate the visible Product ID field and disable it
  const productCodeField = document.getElementById('productCode');
  productCodeField.disabled = true; // Disable the field to prevent editing

  // Populate the form fields with the item data
  document.getElementById('productName').value = productName;
  document.getElementById('price').value = price;

  // Update modal title and button text for "Edit"
  document.getElementById('productModalTitle').innerText = 'Edit Product';
  document.getElementById('productSubmitButton').innerText = 'Update';

  // Open the modal
  document.getElementById('productModal').classList.remove('hidden');
}

// Function to close the Item Modal
export function closeProductModal() {
  document.getElementById('productForm').reset(); // Clear the form
  document.getElementById('productModal').classList.add('hidden');
}

// Handling the form submission for peoduct (both add and edit)
document.getElementById('productForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const productForm = event.target;
  const mode = productForm.getAttribute('data-mode'); // Either 'add' or 'edit'
  const productName = document.getElementById('productName').value.trim();
  const price = document.getElementById('price').value.trim();


  const productNameField = document.getElementById('productName');
  const priceField = document.getElementById('price');

if (productNameField && priceField) {
  const productName = productNameField.value.trim();
  const price = priceField.value.trim();

  // Proceed with the rest of the code using productName and stockNumber
} else {
  console.error('Form elements not found: productName or price');
}


  console.log('Form Data:', { productName, price }); // Log the form data

  if (mode === 'add') {
    // Add a new item
    fetch('http://localhost:8080/api/inventory/products/products', {
      method: 'POST',
      body: JSON.stringify({ 
        product_name: productName.trim(),
        price: price.trim()
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();  // Expecting plain text response
    })
    .then(data => {
      console.log('product added response data:', data);  // Log the response
      showAlertMessage('product added successfully!', 'success');
      fetchProducts();  // Refresh the product list
    })
    .catch(error => {
      console.error('Error adding item:', error);  // Log any error
    });
    
  }   else if (mode === 'edit') {
    // Edit an existing item
    const productId = productForm.getAttribute('data-id');
    console.log('Editing product with ID:', productId); // Log the item ID being edited
    fetch(`http://localhost:8080/api/inventory/products/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ 
        product_name: productName,  // changed to product_name
        price: price // changed to price
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('Response status:', response.status); // Log response status
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();  // Expecting plain text response, not JSON
    })
    .then(data => {
      console.log('productupdated response data:', data); // Log response data
      showAlertMessage('product updated successfully!', 'success');
      fetchProducts();  // Refresh the product list
    })
    .catch(error => {
      console.error('Error updating product:', error); // Log any error
    });
  }

  closeProductModal(); // Close the modal after submitting
});



  // Function to show alert messages
function showAlertMessage(message, type) {
  if (type === 'success') {
    alertify.success(message);  // Success alert
} else if (type === 'error') {
    alertify.error(message);  // Error alert
} else if (type === 'warning') {
    alertify.warning(message);  // Warning alert
} else if (type === 'danger') {
    alertify.error(message);  // Using error for danger in Alertify
} else if (type === 'message') {
    alertify.message(message);  // General message alert
}
}

// Initialize alert message existence
document.addEventListener("DOMContentLoaded", function () {
  const alertMessage = document.getElementById("alertMessage");
  if (!alertMessage) {
      console.error("Alert message element not found.");
  }
});

// Function to close the alert manually
document.getElementById("closeProductAlert").addEventListener("click", function() {
  document.getElementById("alertMessage").classList.add("hidden");
});

export function deleteProduct(event) {
  const productId = event.target.closest('button').getAttribute('data-id');
  if (!productId) {
      console.error('No Product ID found to delete.');
      return;
  }

  // Show confirmation dialog
  alertify.confirm("Are you sure you want to delete this product?",
  function(){  // User clicked 'Ok'
      // Proceed to delete the item
      fetch(`http://localhost:8080/api/inventory/products/products/${productId}`, {
          method: 'DELETE'
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          console.log('Product deleted successfully.');

          // Show the red danger alert
          showAlertMessage('Product deleted successfully!', 'danger'); // Red for delete

          // Remove the item from localStorage
          let savedProducts = JSON.parse(localStorage.getItem('inventoryProduct')) || [];
          savedProducts = savedProducts.filter(product => product.id !== Number(itemId));
          localStorage.setItem('inventoryProducts', JSON.stringify(savedProducts));

          // Refresh the product list after deletion
          fetchProducts(); 
      })
      .catch(error => console.error('Error deleting item:', error));
  },
  function(){  // User clicked 'Cancel'
      alertify.error('Delete action canceled.');
  });
}


alertify.set('notifier', 'position', 'top-right');  // Set position of notifications
alertify.set('notifier', 'delay', 3); 