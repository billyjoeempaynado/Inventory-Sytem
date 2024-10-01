function closeProductModal() { productModal.classList.add('hidden'); }
productCancelButton.onclick = closeProductModal;

let currentPage = 1;
const productsPerPage = 6;


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

export function displayProducts(products) {
  const totalPages = Math.ceil(products.length / productsPerPage);

  const paginatedProducts = paginate(products, currentPage, productsPerPage);
  const tableBody = document.querySelector('#productTableBody');
  tableBody.innerHTML = ''; // Clear existing rows

  if (paginatedProducts.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="3" class="text-center">No items found.</td></tr>';
  } else {
    paginatedProducts.forEach(product => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="py-4 px-6 text-sm font-medium text-gray-900">${product.product_name}</td>
        <td class="py-4 px-6 text-sm text-gray-500">${product.price}</td>
        <td class="sm:flex py-4 px-6 text-sm">
          <button id="edit" data-id="${product.id}" class="p-2 text-gray-700 hover:text-gray-500">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button data-id="${product.id}" class="delete-product-btn p-2 text-red-700 hover:text-red-500">
            <i class="fa-solid fa-trash-can" style="color: #f84444;"></i>
          </button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    document.querySelectorAll('.delete-product-btn').forEach(button => {
      button.addEventListener('click', deleteProduct);
    });
    
  }

  // Add Pagination Controls
  setupPaginationControls(totalPages, fetchProducts);
}


// Pagination function to get products for the current page
function paginate(products, page, productsPerPage) {
  const start = (page - 1) * productsPerPage;
  const end = start + productsPerPage;
  return products.slice(start, end);
}

function setupPaginationControls(totalPages, fetchProductsCallback) {
  const prevButton = document.getElementById('prevPageButton');
  const nextButton = document.getElementById('nextPageButton');
  const pageButtonsContainer = document.getElementById('pageButtons');

  // Update the state of the "Previous" and "Next" buttons
  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === totalPages;

  // Clear the existing page number buttons
  pageButtonsContainer.innerHTML = '';

  // Create page number buttons dynamically
  for (let page = 1; page <= totalPages; page++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = page;
    pageButton.className = `px-4 py-2 rounded ${page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-300'}`;

    pageButton.addEventListener('click', () => {
      currentPage = page;
      fetchProductsCallback(); // Fetch the products for the selected page
    });

    pageButtonsContainer.appendChild(pageButton);
  }

  // Set up the "Previous" button click handler
  prevButton.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      fetchProductsCallback(); // Refresh products for the previous page
    }
  };

  // Set up the "Next" button click handler
  nextButton.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      fetchProductsCallback(); // Refresh products for the next page
    }
  };
}


// Add product modal logic
const addProductForm = document.getElementById('addProductForm');
addProductForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const product_name = document.querySelector('input[name="productName"]').value;
    const price = document.querySelector('input[name="price"]').value;

   fetch('http://localhost:8080/api/inventory/products/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_name, price })
    })
    .then(response => {
      return response.text().then(text => {
        try {
          return JSON.parse(text);
        } catch (error) {
          return text;
        }
      });
    })
    .then(result => {
      if (typeof result === 'object' && result.product) {
        console.log('Product added successfully:', result.product);


        const savedProducts = JSON.parse(localStorage.getItem('inventoryProducts')) || [];
        savedProducts.push(result.product);
        localStorage.setItem('inventoryProducts', JSON.stringify(savedProducts));
        fetchProducts(); // Refresh the items list
      } else {
        console.log('Server message:', result);
        fetchProducts();
      }

      // Close the modal and reset the form
      closeProductModal();
      showAlertMessage('Product added successfully!', 'success');
      addProductForm.reset();
    })
    .catch(error => console.error('Error adding product:', error));
});

function showAlertMessage(message, type) {
  const alertMessage = document.getElementById("productAlertMessage");

  if (alertMessage) {
    // Set the alert message text
    alertMessage.querySelector('span').textContent = message;

    // Remove existing classes
    alertMessage.classList.remove("hidden", "bg-green-100", "border-green-400", "text-green-700", "bg-red-100", "border-red-400", "text-red-700");

    // Add appropriate classes based on alert type
    if (type === 'success') {
      alertMessage.classList.add("bg-green-100", "border-green-400", "text-green-700");
    } else if (type === 'danger') {
      alertMessage.classList.add("bg-red-100", "border-red-400", "text-red-700");
    }

    // Show the alert
    alertMessage.classList.remove("hidden");

    // Auto-hide the alert after 3 seconds
    setTimeout(() => {
      alertMessage.classList.add("hidden");
    }, 3000);
  } else {
    console.error("Alert message element not found.");
  }
}


document.addEventListener("DOMContentLoaded", function () {
  const alertMessage = document.getElementById("productAlertMessage");
  if (!alertMessage) {
    console.error("Alert message element not found.");
  }
});


// Function to close the alert manually
document.getElementById("productCloseAlert").addEventListener("click", function() {
  document.getElementById("productAlertMessage").classList.add("hidden");
});

// Function to delete a product
export function deleteProduct(event) {
  const productId = event.target.closest('button').getAttribute('data-id');
  if (!productId) {
    console.error('No Product ID found to delete.');
    return;
  }

  const userConfirmed = window.confirm('Are you sure you want to delete this item? This action cannot be undone.');

  if (!userConfirmed) {
    return; // Exit if the user cancels
  }

  fetch(`http://localhost:8080/api/inventory/products/products/${productId}`, {
    method: 'DELETE'
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log('Product deleted successfully.');

      // Show the red danger alert
      showAlertMessage('Product deleted successfully!', 'danger');  // <-- Red for delete

      // Remove the item from localStorage
      let savedProducts = JSON.parse(localStorage.getItem('inventoryProducts')) || [];
      savedProducts = savedProducts.filter(product => product.id !== Number(productId));
      localStorage.setItem('inventoryProducts', JSON.stringify(savedProducts));

      fetchProducts();  // Refresh the items list after deletion
    })
    .catch(error => console.error('Error deleting item:', error));
}