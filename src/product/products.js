function closeProductModal() { productModal.classList.add('hidden'); }
productCancelButton.onclick = closeProductModal;

let currentPage = 1;
const productsPerPage = 5;


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
  const paginationControls = document.getElementById('paginationControls');
  paginationControls.innerHTML = ''; // Clear existing pagination buttons

  console.log('Total pages:', totalPages); // Debugging

   // Previous Button
  const prevButton = document.createElement('button');
  prevButton.textContent = 'Previous';
  prevButton.className = 'px-4 py-2';
  prevButton.disabled = currentPage === 1;
  prevButton.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      fetchProductsCallback(); // Refresh products for the previous page
    }
  };
  paginationControls.appendChild(prevButton);

   // Numbered Buttons
   for (let page = 1; page <= totalPages; page++) {
    console.log('Creating button for page:', page); // Debugging

    const pageButton = document.createElement('button');
    pageButton.textContent = page;
    pageButton.className = `px-4 py-2 ${page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-300'}`;
    
    pageButton.addEventListener('click', () => {
      currentPage = page;
      fetchProductsCallback(); // Refresh products for the new page
    });

    paginationControls.appendChild(pageButton);
  }

  // Next Button
  const nextButton = document.createElement('button');
  nextButton.textContent = 'Next';
  nextButton.className = 'px-4 py-2';
  nextButton.disabled = currentPage === totalPages;
  nextButton.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      fetchProductsCallback(); // Refresh products for the next page
    }
  };
  paginationControls.appendChild(nextButton);
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
                    return JSON.parse(text);  // Try to parse JSON response
                } catch (error) {
                    return text;  // Return plain text if parsing fails
                }
            });
        })
        .then(result => {
            if (typeof result === 'object' && result.product) {
                console.log('Product added successfully:', result.product);
                const savedProducts = JSON.parse(localStorage.getItem('inventoryProducts')) || [];
                savedProducts.push(result.product);
                localStorage.setItem('inventoryProducts', JSON.stringify(savedProducts));
                fetchProducts();  // Refresh the products list
            } else {
                console.log('Server message:', result);
                fetchProducts(); // Refresh the products list in case of server message
            }
            closeProductModal();
            addProductForm.reset();
        })
        .catch(error => console.error('Error adding product:', error));
});

// Function to delete a product
export function deleteProduct(event) {
    const productId = event.target.closest('button').getAttribute('data-id');
    if (!productId) {
        console.error('No Product ID found to delete.');
        return;
    }

    fetch(`http://localhost:8080/api/inventory/products/products/${productId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log('Product deleted successfully.');

            // Remove the product from localStorage
            let savedProducts = JSON.parse(localStorage.getItem('inventoryProducts')) || [];
            savedProducts = savedProducts.filter(product => product.id !== Number(productId));
            localStorage.setItem('inventoryProducts', JSON.stringify(savedProducts));

            fetchProducts(); // Refresh the products list after deletion
        })
        .catch(error => console.error('Error deleting product:', error));
}

// Initial fetch of products on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
});
