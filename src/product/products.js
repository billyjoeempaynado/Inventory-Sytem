let currentPage = 1;
const productsPerPage = 6;

// fetch the supplier name to dropdown
function fetchAndPopulateSuppliers() {
  const $supplierDropdown = $('#supplierDropdown');
  if ($supplierDropdown.length === 0) {
    console.error('supplierDropdown is undefined or null');
    return;
  }

  // Proceed with fetching suppliers if the element exists
  $.getJSON('http://localhost:8080/api/inventory/suppliers')
    .done(function (suppliers) {
      $supplierDropdown.html('<option value="">Select a supplier</option>'); // Reset dropdown options
      suppliers.forEach(supplier => {
        $supplierDropdown.append($('<option>', {
          value: supplier.supplier_id,
          text: supplier.supplier_name
        }));
      });
    })
    .fail(function (error) {
      console.error('Error fetching suppliers:', error);
    });
}

// fetch categories dropdown
function fetchAndPopulateCategories() {
  const $categoryDropdown = $('#categoryDropdown');
  if ($categoryDropdown.length === 0) {
    console.error('categoryDropdown is undefined or null');
    return;
  }

  // Proceed with fetching categories if the element exists
  $.getJSON('http://localhost:8080/api/inventory/categories')
    .done(function (categories) {
      $categoryDropdown.html('<option value="">Select a category</option>'); // Reset dropdown options
      categories.forEach(category => {
        $categoryDropdown.append($('<option>', {
          value: category.category_id,
          text: category.category_name
        }));
      });
    })
    .fail(function (error) {
      console.error('Error fetching categories:', error);
    });
}

// Fetch and display products
export function fetchProducts() {
  $.getJSON('http://localhost:8080/api/inventory/products')
    .done(function (products) {
      localStorage.setItem('inventoryProducts', JSON.stringify(products));
      displayProducts(products);
    })
    .fail(function (error) {
      console.error('Error fetching products:', error);
    });
}

// Debounce utility function
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

export function searchProducts() {
  const searchQuery = $('#searchProductInput').val().trim().toLowerCase();
  const products = JSON.parse(localStorage.getItem('inventoryProducts')) || [];

  const filteredProducts = products.filter(item =>
    item.product_name.toLowerCase().includes(searchQuery) ||
    String(item.purchase_price).toLowerCase().includes(searchQuery)
  );

  // Reset pagination to page 1 when searching
  currentPage = 1;

  // Display filtered items (make sure it handles pagination)
  displayProducts(filteredProducts);
}

const debouncedSearchProducts = debounce(searchProducts, 300); // 300ms delay

// Attach the debounced function to the input event
$('#searchProductInput').on('input', debouncedSearchProducts);

export function displayProducts(products) {
  const totalPages = Math.ceil(products.length / productsPerPage);
  const paginatedProducts = paginate(products, currentPage, productsPerPage);
  const $tableBody = $('#productTableBody');
  $tableBody.empty(); // Clear existing rows

  if (paginatedProducts.length === 0) {
    $tableBody.html('<tr><td colspan="3" class="mt-4 text-center">No product found.</td></tr>');
  } else {
    paginatedProducts.forEach(product => {
      const row = `
     <tr>
      <td class="py-4 px-6 text-sm text-gray-500 text-center">${product.product_code}</td>
      <td class="py-4 px-6 text-sm text-gray-900 text-center">${product.product_name}</td>
      <td class="py-4 px-6 text-sm text-gray-500 text-center">&#8369; ${product.selling_price}</td>
      <td class="py-4 px-6 text-sm text-gray-500 text-center">&#8369; ${product.purchase_price}</td>
      <td class="py-4 px-6 text-sm text-gray-500 text-center">${product.category_name}</td>
      <td class="py-4 px-6 text-sm text-gray-500 text-center">${product.supplier_name || 'No Supplier Assigned'}</td>
      <td class="py-4 px-6 text-sm text-gray-500 text-center">${product.reorder_level}</td>
      <td class="py-4 px-6 text-sm">
        <div class="flex items-center justify-center space-x-2">
          <button data-id="${product.product_id}" class="edit-product-btn p-2 text-gray-700 hover:text-gray-500">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button data-id="${product.product_id}" class="delete-product-btn p-2 text-red-700 hover:text-red-500">
            <i class="fa-solid fa-trash-can" style="color: #f84444;"></i>
          </button>
        </div>
      </td>
    </tr>`;
      $tableBody.append(row);
    });

    // Attach event listeners after adding rows
    attachProductEventListeners();
  }

  // Add Pagination Controls
  setupPaginationControls(totalPages, () => displayProducts(products));
}

function paginate(products, page, productsPerPage) {
  const start = (page - 1) * productsPerPage;
  const end = start + productsPerPage;
  return products.slice(start, end);
}

function setupPaginationControls(totalPages, fetchProductsCallback) {
  const $paginationControls = $('#productPaginationControls');
  $paginationControls.empty(); // Clear existing buttons

  // Previous Button
  const prevButton = $('<button>', {
    text: 'Previous',
    class: `px-4 py-2 rounded bg-gray-300 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`,
    disabled: currentPage === 1
  }).on('click', function () {
    if (currentPage > 1) {
      currentPage--;
      fetchProductsCallback();
    }
  });
  $paginationControls.append(prevButton);

  // Page Number Buttons
  for (let page = 1; page <= totalPages; page++) {
    const pageButton = $('<button>', {
      text: page,
      class: `px-4 py-2 rounded ${page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-300'}`
    }).on('click', function () {
      currentPage = page;
      fetchProductsCallback();
    });
    $paginationControls.append(pageButton);
  }

  // Next Button
  const nextButton = $('<button>', {
    text: 'Next',
    class: `px-4 py-2 rounded bg-gray-300 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`,
    disabled: currentPage === totalPages
  }).on('click', function () {
    if (currentPage < totalPages) {
      currentPage++;
      fetchProductsCallback();
    }
  });
  $paginationControls.append(nextButton);
}

// Attach event listeners for edit and delete buttons
function attachProductEventListeners() {
  // Edit Buttons
  $('.edit-product-btn').on('click', function () {
    const productId = $(this).data('id');
    const products = JSON.parse(localStorage.getItem('inventoryProducts')) || [];
    const productToEdit = products.find(product => product.product_id === Number(productId));

    if (productToEdit) {
      openEditProductModal(
        productId,
        productToEdit.product_name,
        productToEdit.purchase_price,
        productToEdit.selling_price,
        productToEdit.reorder_level,
        productToEdit.product_code,
        productToEdit.supplier_id
      );
    } else {
      console.error('Product not found:', productId);
    }
  });
  
  // Delete Buttons
  $('.delete-product-btn').on('click', deleteProduct);
}


// Reusable modal functions
export function openAddProductModal() {
  const $productForm = $('#productForm');
  $productForm.attr('data-mode', 'add');  // Set form mode to 'add'
  console.log('Form mode set to:', productForm.getAttribute('data-mode'));  // Debugging log

  // Clear the input fields
  $('#productName').val = ('');
  $('#price').val = ('');
  $('#sellingPrice').val = ('');
  $('#reorderLevel').val = ('');
  $('#productCode').val = ('');
  

  // Update modal title and button text for "Add"
  $('#productModalTitle').text('Add product');
  $('#productSubmitButton').text('Add');

  $('#productCode').prop('disable', false); // Disable the field to prevent editing


  // Open the modal (assuming you have some modal logic)
  $('#productModal').removeClass('hidden');

  fetchAndPopulateSuppliers();
  fetchAndPopulateCategories();
}


// Function to open the Item Modal (for both Add and Edit)
export function openEditProductModal(productId, productName, price, sellingPrice, reorderLevel, productCode) {
  const $productForm = $('#productForm');
  $productForm.attr('data-mode', 'edit');  // Set form mode to 'edit'
  $productForm.attr('data-id', productId); // Set the form's data-id to the productId

  // Populate the visible Product ID field and disable it
   // Disable the field to prevent editing
  $('#productCode').prop('disable', true);

  // Populate the form fields with the item data
  $('#productName').val(productName);
  $('#price').val(price);
  $('#sellingPrice').val(sellingPrice);
  $('#reorderLevel').val(reorderLevel);
  $('#productCode').val(productCode);

  // Update modal title and button text for "Edit"
  $('#productModalTitle').text('Edit Product');
  $('#productSubmitButton').text('Update');

  // Open the modal
  $('#productModal').removeClass('hidden');

  // Fetch suppliers and populate the dropdown (if not already populated)
  fetchAndPopulateSuppliers();
  fetchAndPopulateCategories();
}


// Function to close the product Modal
 function closeProductModal() {
 $('#productForm')[0].reset(); // Clear the form
 $('#productModal').addClass('hidden');
}

// Handling the form submission for peoduct (both add and edit)
$('#productForm').on('submit', function(event) {
  event.preventDefault();
  const $productForm = $(event.target);
  const mode = $productForm.attr('data-mode'); // Either 'add' or 'edit'
  const productName = $('#productName').val().trim();
  const price = $('#price').val().trim();
  const sellingPrice = $('#sellingPrice').val().trim();
  const reorderLevel = $('#reorderLevel').val().trim();
  const productCode = $('#productCode').val().trim();
  const supplierId = $('#supplierDropdown').val();  // Capture supplier ID
  const categoryId = $('#categoryDropdown').val();

    // Prepare the product data object
    const productData = { 
      product_name: productName,
      purchase_price: price,
      selling_price: sellingPrice,
      reorder_level: reorderLevel,
      product_code: productCode,
      supplier_id: supplierId,
      category_id: categoryId
    };

  if (mode === 'add') {
    // Add a new product
    $.ajax({
      url: 'http://localhost:8080/api/inventory/products',
      method: 'POST',
      data: JSON.stringify(productData),
      contentType: 'application/json',
      success: function(data) {
        console.log('Product added response data:', data);  // Log the response
        showAlertMessage('Product added successfully!', 'success');
        fetchProducts();  // Refresh the product list
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.error('Error adding product:', textStatus, errorThrown);  // Log any error
      }
    });
    
  } else if (mode === 'edit') {
    // Edit an existing item
    const productId = $productForm.attr('data-id');
    console.log('Editing product with ID:', productId); // Log the item ID being edited
    $.ajax({
      url: `http://localhost:8080/api/inventory/products/${productId}`,
      method: 'PUT',
      data: JSON.stringify(productData),
      contentType: 'application/json',
      success: function(data) {
        console.log('Product updated response data:', data); // Log response data
        showAlertMessage('Product updated successfully!', 'success');
        fetchProducts();  // Refresh the product list
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.error('Error updating product:', textStatus, errorThrown); // Log any error
      }
    });
  }

  closeProductModal(); // Close the modal after submitting
});

export function deleteProduct(event) {
  const productId = $(event.target).closest('button').data('id');
  if (!productId) {
    console.error('No Product ID found to delete.');
    return;
  }

  // Show confirmation dialog using alertify or any preferred method
  alertify.confirm("Are you sure you want to delete this product?",
    function() { // User clicked 'Ok'
      // Proceed to delete the item
      $.ajax({
        url: `http://localhost:8080/api/inventory/products/${productId}`,
        method: 'DELETE',
        success: function(response) {
          console.log('Product deleted successfully.');

          // Show the success alert
          showAlertMessage('Product deleted successfully!', 'danger'); // Red for delete

          // Optionally, refresh the product list after deletion
          fetchProducts(); 
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.error('Error deleting product:', textStatus, errorThrown);
        }
      });
    },
    function() { // User clicked 'Cancel'
      alertify.error('Delete action canceled.');
    }
  ); 
}



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



alertify.set('notifier', 'position', 'top-right');  // Set position of notifications
alertify.set('notifier', 'delay', 3); 