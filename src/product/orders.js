
let currentPage = 1;
const ordersPerPage = 6;

function fetchAndPopulateProducts() {
  const productList = document.getElementById('productList');
  if (!productList) {
    console.error('productList is undefined or null');
    return;
  }



// Fetch the products from your API
fetch('http://localhost:8080/api/inventory/products')
  .then(response => response.json())
  .then(products => {
    const productList = document.getElementById('productList');
    productList.innerHTML = '<option value="">Select a product</option>'; // Reset dropdown options

    // Populate the product dropdown
    products.forEach(product => {
      const option = document.createElement('option');
      option.value = product.product_id; // Assuming product_id is the ID
      option.text = product.product_name; // Product name
      option.dataset.price = product.selling_price || ''; // Store selling price in a data attribute
      productList.appendChild(option);
    });
  })
  .catch(error => console.error('Error fetching products:', error));

// Add an event listener to the product dropdown
document.getElementById('productList').addEventListener('change', (event) => {
  const selectedOption = event.target.selectedOptions[0]; // Get the selected option
  const orderPriceInput = document.getElementById('orderPrice'); // Price input field
  

  if (selectedOption && selectedOption.value) {
    const price = selectedOption.dataset.price; // Get the price from the data attribute
    console.log('Selected product price:', price); // Debugging: check the price value

    // Check if the price is a valid number
    if (price && !isNaN(price)) {
      orderPriceInput.value = parseFloat(price).toFixed(2); // Set price to 2 decimal places
      console.log('Price set in field:', orderPriceInput.value); // Debugging: check if price is set
    } else {
      orderPriceInput.value = ''; // Clear the input if the price is invalid
      console.log('Invalid price or no price, clearing field.'); // Debugging: log if no price is set
    }
  } else {
    orderPriceInput.value = ''; // Clear the input if no product is selected
    console.log('No product selected, clearing price field.'); // Debugging: log if no product selected
  }
});
 
}

export function fetchOrders(){
  fetch('http://localhost:8080/api/inventory/orders')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(orders => {
    // Ensure localStorage is updated with the fetched orders
    localStorage.setItem('inventoryOrders', JSON.stringify(orders));
    displayOrders(orders);
  })
  .catch(error => console.error('Error fetching orders:', error));
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

export function searchOrders() {
  const searchQuery = document.getElementById('searchOrderInput').value.trim().toLowerCase();
  const orders = JSON.parse(localStorage.getItem('inventoryOrders')) || [];

  const filteredOrders = orders.filter(item =>
    item.customer_name.toLowerCase().includes(searchQuery) ||
    String(item.order_date).toLocaleLowerCase().includes(searchQuery)
  );

  currentPage = 1;

  displayOrders(filteredOrders);
}

const debouncedSearchOrders = debounce(searchOrders, 300);

document.getElementById('searchOrderInput').addEventListener('input', debouncedSearchOrders);

export function displayOrders(orders) {
  const totalPages = Math.ceil(orders.length / ordersPerPage); // Use the correctly declared variable
  const paginatedOrders = paginate(orders, currentPage, ordersPerPage);
  const tableBody = document.querySelector('#ordersTableBody');
  tableBody.innerHTML = ''; // Clear existing rows

  if (paginatedOrders.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="3" class="mt-4 text-center">No Order found.</td></tr>';
  } else {
      paginatedOrders.forEach(order => {
          const row = document.createElement('tr');
          row.innerHTML = `
                    <td class="py-4 px-6 text-sm text-gray-500 text-center">${order.customer_name}</td>
                    <td class="py-4 px-6 text-sm text-gray-900 text-center">${order.order_date}</td>
                    <td class="py-4 px-6 text-sm text-gray-500 text-center">${order.status}</td>
                    <td class="py-4 px-6 text-sm text-gray-500 text-center">&#8369; ${order.total_amount}</td>
                    
                    <td class="py-4 px-6 text-sm">
                      <div class="flex items-center justify-center space-x-2">
                        <button data-id="${order.order_id}" class="edit-order-btn p-2 text-gray-700 hover:text-gray-500">
                          <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button data-id="${order.order_id}" class="delete-order-btn p-2 text-red-700 hover:text-red-500">
                          <i class="fa-solid fa-trash-can" style="color: #f84444;"></i>
                        </button>
                      </div>
                    </td>

                    <td class="py-4 px-6 text-sm text-gray-500">
                      <div class="flex items-center justify-center space-x-2">
                        <a  href="#" id="viewDetailsButton" data-id="${order.order_id}" class="viewDetailsButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded">
                          View
                        </a>
                      </div>
                    </td>
          `;
          tableBody.appendChild(row);
      });
      
      // Attach event listeners after adding rows
      attachOrderEventListeners();
  }

  // Add Pagination Controls
  setupPaginationControls(totalPages, () => displayOrders(orders)); // Use displayOrders for re-rendering
}


function paginate(orders, page, ordersPerPage) {
  const start = (page - 1 ) * ordersPerPage;
  const end = start + ordersPerPage;
  return orders.slice(start, end);
}

function setupPaginationControls(totalPages, fetchOrdersCallback) {
  const orderPaginationControls = document.getElementById('orderPaginationControls');
  orderPaginationControls.innerHTML = ''; // Clear existing buttons

   // Previous Button
   const orderPrevButton = document.createElement('button');
   orderPrevButton.textContent = 'Previous';
   orderPrevButton.className = `px-4 py-2 rounded bg-gray-300 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`;
   orderPrevButton.disabled = currentPage === 1;
   orderPrevButton.addEventListener('click', () => {
       if (currentPage > 1) {
           currentPage--;
           fetchOrdersCallback();
       }
   });
   orderPaginationControls.appendChild(orderPrevButton);

   // Page Number Buttons
   for (let page = 1; page <= totalPages; page++) {
       const orderPageButton = document.createElement('button');
       orderPageButton.textContent = page;
       orderPageButton.className = `px-4 py-2 rounded ${page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-300'}`;
       
       orderPageButton.addEventListener('click', () => {
           currentPage = page;
           fetchOrdersCallback();
       });

      orderPaginationControls.appendChild(orderPageButton);
   } 

   // Next Button
   const orderNextButton = document.createElement('button');
   orderNextButton.textContent = 'Next';
   orderNextButton.className = `px-4 py-2 rounded bg-gray-300 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`;
   orderNextButton.disabled = currentPage === totalPages;
   orderNextButton.addEventListener('click', () => {
       if (currentPage < totalPages) {
           currentPage++;
           fetchOrdersCallback();
       }
   });
   orderPaginationControls.appendChild(orderNextButton);
}

function attachOrderEventListeners() {

  document.querySelectorAll('.edit-order-btn').forEach(button => {
    button.addEventListener('click', (event) => {
      const orderId = event.currentTarget.getAttribute('data-id');
      const orders = JSON.parse(localStorage.getItem('inventoryOrders')) || [];
      const orderToEdit = orders.find(order => order.order_id === Number(orderId));
    
      console.log('Order to edit:', orderToEdit); // Add this line to debug
    
      if(orderToEdit) {
        openEditOrderModal(
          orderId,
          orderToEdit.customer_name,
          orderToEdit.order_date,
          orderToEdit.status
        );
      } else {
        console.error('Order not found:', orderId);
      }
    });
    
  });

  document.querySelectorAll('.delete-order-btn').forEach(button => {
    button.addEventListener('click', deleteOrder);
  });

  document.querySelectorAll('.viewDetailsButton').forEach(button => {
    button.addEventListener('click', async (event) => {
      event.preventDefault(); // Prevent the default anchor behavior
      const orderId = event.currentTarget.getAttribute('data-id');
      console.log('View button clicked for Order ID:', orderId);

      try {
        // Fetch the order details from the server
        const response = await fetch(`/api/inventory/orders/${orderId}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const orderDetails = await response.json();

        // Update the orderDetailSection in your dashboard
        loadOrderDetails(orderDetails);
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    });
  });

}

function loadOrderDetails(orderDetails) {
  const ordersSection = document.getElementById('ordersSection'); // Ensure this ID matches your orders section
  const orderDetailSection = document.getElementById('orderDetailSection'); // Ensure this ID matches your order detail section
  
  // Clear any existing content
  orderDetailSection.innerHTML = '';

  // Populate the section with order details
  orderDetailSection.innerHTML = `
    <h2 class="text-lg font-semibold">Order Details</h2>
    <p><strong>Customer Name:</strong> ${orderDetails.customer_name}</p>
    <p><strong>Order Date:</strong> ${orderDetails.order_date}</p>
    <p><strong>Status:</strong> ${orderDetails.status}</p>
    <p><strong>Total Amount:</strong> &#8369; ${orderDetails.total_amount}</p>
    <!-- Add more details as needed -->
  `;

  ordersSection.classList.add('hidden'); // Hide the orders section
  // Optionally, show the order detail section if it's hidden
  orderDetailSection.classList.remove('hidden'); // Assuming you have a class to hide it
}


export function openAddOrderModal() {
  const orderForm = document.getElementById('orderForm');
  const orderPrice = document.getElementById('orderPrice');
  orderPrice.disabled = true;
  orderForm.setAttribute('data-mode', 'add');

  
  document.getElementById('customerName').value = '';
  document.getElementById('orderDate').value = '';
  document.getElementById('status').value = '';
  document.getElementById('quantity').value = '';
  document.getElementById('orderPrice').value = '';


  document.getElementById('orderModalTitle').innerText = 'Create Order';
  document.getElementById('orderSubmitButton').innerText = 'Create';

  document.getElementById('orderModal').classList.remove('hidden');

  fetchAndPopulateProducts();
}


export function openEditOrderModal(orderId, customerName, orderDate, status){
  const orderForm = document.getElementById('orderForm');
  orderForm.setAttribute('data-mode', 'edit');

  orderForm.setAttribute('data-id', orderId);


  document.getElementById('customerName').value = customerName;
  document.getElementById('orderDate').value = orderDate;
  document.getElementById('status').value = status;
  document.getElementById('quantity').value = quantity;

  document.getElementById('orderModalTitle').innerText = 'Edit Order';
  document.getElementById('orderSubmitButton').innerText = 'Update';

  document.getElementById('orderModal').classList.remove('hidden');

  fetchAndPopulateProducts();

}



// Function to create a new order
async function createOrder(customerName, orderDate, status) {
  const response = await fetch('http://localhost:8080/api/inventory/orders', {
    method: 'POST',
    body: JSON.stringify({
      customer_name: customerName,
      order_date: orderDate,
      status: status
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    throw new Error('Failed to create order');
  }
  return await response.json();
}

async function addOrderItem(orderId, productId, quantity, price) {
  const itemResponse = await fetch(`http://localhost:8080/api/inventory/orders/${orderId}/items`, {
    method: 'POST',
    body: JSON.stringify({
      order_id: orderId,
      product_id: productId,
      quantity: quantity,
      price: price
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!itemResponse.ok) {
    throw new Error('Failed to add order item');
  }
  return await itemResponse.json();
}


function closeOrderModal() {
  document.getElementById('orderForm').reset(); // Clear the form
  document.getElementById('orderModal').classList.add('hidden');
}

// Function to handle form submission for creating or updating an order
function submitOrderForm(event) {
  event.preventDefault();
  const orderForm = event.target;
  const mode = orderForm.getAttribute('data-mode');

  const customerName = document.getElementById('customerName').value.trim();
  const orderDate = document.getElementById('orderDate').value.trim();
  const status = document.getElementById('status').value.trim();
  const quantity = document.getElementById('quantity').value.trim();
  const productId = document.getElementById('productList').value.trim();
  const price = document.getElementById('orderPrice').value.trim();



  if (mode === 'add') {
    createOrder(customerName, orderDate, status)
      .then(order => {
        console.log('Order created:', order);
        const orderId = order.order_id;
        showAlertMessage('Order created successfully!', 'success');
        
        closeOrderModal(); // Close the modal after creating the order
        fetchOrders(); // Refresh the list of orders
  
        // Now try to add the order item
        return addOrderItem(orderId, productId, quantity, price);
      })
      .then(itemData => {
        console.log('Item added successfully:', itemData);
       
      })
      .catch(error => {
        console.error('Error adding order or item:', error);
        showAlertMessage('Order created, but failed to add item: ' + error.message, 'danger');
      });
  }
  else if (mode === 'edit') {
    const orderId = orderForm.getAttribute('data-id');  
    const productDropdown = document.getElementById('productList');
    const productId = productDropdown.value;
    
    const selectedOption = productDropdown.options[productDropdown.selectedIndex];
    const price = parseFloat(selectedOption.getAttribute('data-price')).toFixed(2);  // Convert price to float with two decimals

    const quantity = document.getElementById('quantity').value;
    const customerName = document.getElementById('customerName').value;
    const orderDate = document.getElementById('orderDate').value;
    const status = document.getElementById('status').value;

    // Prepare the data to send to the server
    const orderData = {
        customer_name: customerName,
        order_date: orderDate,
        status: status,
        items: [
            {
                product_id: Number(productId),
                quantity: Number(quantity),
                price: parseFloat(price)  // Ensure price is a float
            }
        ]
    };

    console.log('Order ID:', orderId);
    console.log('Payload being sent:', orderData);
    
    // Make the API call to update both order and items
    fetch(`http://localhost:8080/api/inventory/orders/${orderId}/items`, {
        method: 'PUT',
        body: JSON.stringify(orderData),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.message || 'Network response was not ok');
            });
        }
        return response.json();
    })
    .then(orderUpdateResponse => {
        console.log('Order and items updated successfully:', orderUpdateResponse);
        showAlertMessage('Order and items updated successfully!', 'success');
        closeOrderModal(); // Close the modal after updating order
        fetchOrders(); // Refresh the orders list
    })
    .catch(error => {
        console.error('Error updating order and items:', error);
        showAlertMessage('Error updating order and items: ' + error.message, 'danger');
    });
  }
}


// Attach the event listener to the order form
document.getElementById('orderForm').addEventListener('submit', submitOrderForm);



export function deleteOrder(event) {
  const orderId = event.target.closest('button').getAttribute('data-id');
  if (!orderId) {
      console.error('No Order ID found to delete.');
      return;
  }

  // Show confirmation dialog
  alertify.confirm("Are you sure you want to delete this order?",
  function(){  // User clicked 'Ok'
      // Proceed to delete the item
      fetch(`http://localhost:8080/api/inventory/orders/${orderId}`, {
          method: 'DELETE'
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          console.log('Order deleted successfully.');

          // Show the red danger alert
          showAlertMessage('Order deleted successfully!', 'danger'); // Red for delete

          // Remove the item from localStorage
          let savedOrders = JSON.parse(localStorage.getItem('inventoryOrders')) || [];
          savedOrders = savedOrders.filter(order => order.order_id !== Number(orderId));
          localStorage.setItem('inventoryOrders', JSON.stringify(savedOrders));

          // Refresh the Orders list after deletion
          fetchOrders(); 
      })
      .catch(error => console.error('Error deleting item:', error));
  },
  function(){  // User clicked 'Cancel'
      alertify.error('Delete action canceled.');
  });
}


function showAlertMessage(message, type) {
  console.log(`Showing alert: ${message}, Type: ${type}`); // Debugging log
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

// Ensure Alertify settings are applied correctly
alertify.set('notifier', 'position', 'top-right');  // Set position of notifications
alertify.set('notifier', 'delay', 3);  // Set delay for the alerts to disappear