
let currentPage = 1;
const ordersPerPage = 6;

function fetchAndPopulateProducts() {
  const productList = document.getElementById('productList');
  if (!productList) {
    console.error('productList is undefined or null');
    return;
  }

  // Fetch the products from your API
  fetch('http://localhost:8080/api/inventory/products/products')
    .then(response => response.json())
    .then(products => {
      productList.innerHTML = '<option value="">Select a product</option>'; // Reset dropdown options
      products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.product_id; // Assuming product_id is the ID
        option.text = product.product_name; // Product name
        option.dataset.price = product.price; // Set price as data attribute
        productList.appendChild(option);
      });

      // Add an event listener for when the product is selected
      productList.addEventListener('change', (event) => {
        const selectedOption = event.target.selectedOptions[0];
        const orderPriceInput = document.getElementById('orderPrice');

        if (selectedOption) {
          console.log('Selected option:', selectedOption); // Debugging log
          const price = selectedOption.dataset.price;

          if (price !== undefined) {
            orderPriceInput.value = price; // Set the price in the input field
          } else {
            console.error('Price is undefined for the selected option');
            orderPriceInput.value = ''; // Clear the input if undefined
          }
        } else {
          orderPriceInput.value = ''; // Clear the input if no product is selected
        }
      });
    })
    .catch(error => console.error('Error fetching products:', error));
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
              <td class="py-4 px-6 text-sm text-gray-500">${order.customer_name}</td>
              <td class="py-4 px-6 text-sm text-gray-900">${order.order_date}</td>
              <td class="py-4 px-6 text-sm text-gray-500">${order.status}</td>
              <td class="py-4 px-6 text-sm text-gray-500"></td>
              <td class="sm:flex py-4 px-6 text-sm">
                  <button data-id="${order.order_id}" class="edit-order-btn p-2 text-gray-700 hover:text-gray-500">
                      <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button data-id="${order.order_id}" class="delete-order-btn p-2 text-red-700 hover:text-red-500">
                      <i class="fa-solid fa-trash-can" style="color: #f84444;"></i>
                  </button>
              <td class="py-4 px-6 text-sm text-gray-500"></td>          
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
}




export function openAddOrderModal() {
  const orderForm = document.getElementById('orderForm');
  orderForm.setAttribute('data-mode', 'add');

  document.getElementById('customerName').value = '';
  document.getElementById('orderDate').value = '';
  document.getElementById('status').value = '';


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

  document.getElementById('orderModalTitle').innerText = 'Edit Order';
  document.getElementById('orderSubmitButton').innerText = 'Update';

  document.getElementById('orderModal').classList.remove('hidden');

  fetchAndPopulateProducts();

}

export function closeOrderModal() {
  document.getElementById('orderForm').reset();
  document.getElementById('orderModal').classList.add('hidden');
}

document.getElementById('orderForm').addEventListener('submit', function(event){
  event.preventDefault();
  const orderForm = event.target;
  const mode = orderForm.getAttribute('data-mode');

  const customerName = document.getElementById('customerName').value.trim();
  const orderDate = document.getElementById('orderDate').value.trim();
  const status = document.getElementById('status').value.trim();

  if (mode === 'add'){

    fetch('http://localhost:8080/api/inventory/orders', {
      method: 'POST',
      body: JSON.stringify({
        customer_name: customerName,
        order_date: orderDate,
        status: status
      }),
      headers: {
        'Content-Type' : 'application/json'
      }
    })
    .then(response => {
      if(!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(data => {
      console.log('Order Added response data:', data);

      showAlertMessage('order added successfully!', 'success');
      fetchOrders();
    })
    .catch(error => {
      console.error('Error Adding order:', error);
    });

  } else if(mode === 'edit') {
    const orderId = orderForm.getAttribute('data-id');
    console.log('Editing order with ID:', orderId);

    fetch(`http://localhost:8080/api/inventory/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify({
        customer_name: customerName,
        order_date: orderDate,
        status: status
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('Response status:', response.status);

      if(!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(data => {
      console.log('Order updated response data:', data);

      showAlertMessage('order updated successfully!', 'success');
      fetchOrders();
    })
    .catch(error => {
      console.error('Error updating order:', error);
    });
  }

  closeOrderModal();
});

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