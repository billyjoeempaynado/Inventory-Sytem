
let currentPage = 1;
const itemsPerPage = 6; // Adjust as needed

// Fetch and display items
export function fetchItems() {
    fetch('http://localhost:8080/api/inventory/items/items')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(items => {
            localStorage.setItem('inventoryItems', JSON.stringify(items)); // Update cache
            displayItems(items);
        })
        .catch(error => console.error('Error fetching items:', error));
}

document.getElementById('searchItemInput').addEventListener('input', searchItems);

export function searchItems() {
  const searchQuery = document.getElementById('searchItemInput').value.trim().toLowerCase();
  const items = JSON.parse(localStorage.getItem('inventoryItems')) || [];

  const filteredItems = items.filter(item => 
      item.item_name.toLowerCase().includes(searchQuery) ||
      String(item.stock_number).toLowerCase().includes(searchQuery)  // Convert stock_number to string
  );

  // Reset pagination to page 1 when searching
  currentPage = 1;

  // Display filtered items (make sure it handles pagination)
  displayItems(filteredItems);
}


export function displayItems(items) {
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const paginatedItems = paginate(items, currentPage, itemsPerPage);
  const tableBody = document.querySelector('#itemTableBody');
  tableBody.innerHTML = ''; // Clear existing rows

  if (paginatedItems.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="3" class="text-center">No items found.</td></tr>';
  } else {
      paginatedItems.forEach(item => {
          const row = document.createElement('tr');
          row.innerHTML = `
              <td class="py-4 px-6 text-sm font-medium text-gray-900">${item.item_name}</td>
              <td class="py-4 px-6 text-sm text-gray-500">${item.stock_number}</td>
              <td class="sm:flex py-4 px-6 text-sm">
                  <button data-id="${item.id}" class="edit-item-btn p-2 text-gray-700 hover:text-gray-500">
                      <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button data-id="${item.id}" class="delete-item-btn p-2 text-red-700 hover:text-red-500">
                      <i class="fa-solid fa-trash-can" style="color: #f84444;"></i>
                  </button>
              </td>
          `;
          tableBody.appendChild(row);
      });

      // Attach event listeners after adding rows
      attachItemEventListeners();
  }

  // Add Pagination Controls
  setupPaginationControls(totalPages, () => displayItems(items));  // Use displayItems for re-rendering
}



// Pagination helper function
function paginate(items, page, itemsPerPage) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return items.slice(start, end);
}

// Setup pagination controls
function setupPaginationControls(totalPages, fetchFunction) {
    const paginationControls = document.getElementById('paginationControls');
    paginationControls.innerHTML = ''; // Clear existing buttons

    // Previous Button
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.className = `px-4 py-2 rounded bg-gray-300 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`;
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchFunction();
        }
    });
    paginationControls.appendChild(prevButton);

    // Page Number Buttons
    for (let page = 1; page <= totalPages; page++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = page;
        pageButton.className = `px-4 py-2 rounded ${page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-300'}`;
        
        pageButton.addEventListener('click', () => {
            currentPage = page;
            fetchFunction();
        });

        paginationControls.appendChild(pageButton);
    }

    // Next Button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.className = `px-4 py-2 rounded bg-gray-300 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`;
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            fetchFunction();
        }
    });
    paginationControls.appendChild(nextButton);
}

// Attach event listeners for edit and delete buttons
function attachItemEventListeners() {
  // Edit Buttons
  document.querySelectorAll('.edit-item-btn').forEach(button => {
      button.addEventListener('click', (event) => {
          const itemId = event.currentTarget.getAttribute('data-id');
          const items = JSON.parse(localStorage.getItem('inventoryItems')) || [];
          const itemToEdit = items.find(item => item.id === Number(itemId));
          if (itemToEdit) {
              // Open the modal and populate fields with the existing item data
              openEditItemModal(itemId, itemToEdit.item_name, itemToEdit.stock_number);
          } else {
              console.error('Item not found:', itemId);
          }
      });
  });

  // Delete Buttons
  document.querySelectorAll('.delete-item-btn').forEach(button => {
      button.addEventListener('click', deleteItem);
  });
}


// Reusable modal functions
export function openAddItemModal() {
  const itemForm = document.getElementById('itemForm');
  itemForm.setAttribute('data-mode', 'add');  // Set form mode to 'add'
  console.log('Form mode set to:', itemForm.getAttribute('data-mode'));  // Debugging log

// Clear the hidden itemId input field since we're adding a new item
  document.getElementById('itemId').value = '';

  // Clear the input fields
  document.getElementById('itemName').value = '';
  document.getElementById('stockNumber').value = '';

  // Update modal title and button text for "Add"
  document.getElementById('itemModalTitle').innerText = 'Add Item';
  document.getElementById('itemSubmitButton').innerText = 'Add';

  // Open the modal (assuming you have some modal logic)
  document.getElementById('itemModal').classList.remove('hidden');
}




// Function to open the Item Modal (for both Add and Edit)
export function openEditItemModal(itemId, itemName, stockNumber) {
  const itemForm = document.getElementById('itemForm');
  itemForm.setAttribute('data-mode', 'edit');  // Set form mode to 'edit'
  itemForm.setAttribute('data-id', itemId);    // Set the form's data-id to the itemId

  // Set the hidden itemId input field
  document.getElementById('itemId').value = itemId;

  // Populate the form fields with the item data
  document.getElementById('itemName').value = itemName;
  document.getElementById('stockNumber').value = stockNumber;

  // Update modal title and button text for "Edit"
  document.getElementById('itemModalTitle').innerText = 'Edit Item';
  document.getElementById('itemSubmitButton').innerText = 'Update';

  // Open the modal
  document.getElementById('itemModal').classList.remove('hidden');
}



// Function to close the Item Modal
export function closeItemModal() {
  document.getElementById('itemForm').reset(); // Clear the form
  document.getElementById('itemModal').classList.add('hidden');
}


// Handling the form submission for items (both add and edit)
document.getElementById('itemForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const itemForm = event.target;
  const mode = itemForm.getAttribute('data-mode'); // Either 'add' or 'edit'
  const itemName = document.getElementById('itemName').value.trim();
  const stockNumber = document.getElementById('stockNumber').value.trim();


  const itemNameField = document.getElementById('itemName');
  const stockNumberField = document.getElementById('stockNumber');

if (itemNameField && stockNumberField) {
  const itemName = itemNameField.value.trim();
  const stockNumber = stockNumberField.value.trim();

  // Proceed with the rest of the code using itemName and stockNumber
} else {
  console.error('Form elements not found: itemName or stockNumber');
}


  console.log('Form Data:', { itemName, stockNumber }); // Log the form data

  if (mode === 'add') {
    // Add a new item
    fetch('http://localhost:8080/api/inventory/items/items', {
      method: 'POST',
      body: JSON.stringify({ 
        item_name: itemName.trim(),
        stock_number: stockNumber.trim()
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
      console.log('Item added response data:', data);  // Log the response
      showAlertMessage('Item added successfully!', 'success');
      fetchItems();  // Refresh the items list
    })
    .catch(error => {
      console.error('Error adding item:', error);  // Log any error
    });
    
  }   else if (mode === 'edit') {
    // Edit an existing item
    const itemId = itemForm.getAttribute('data-id');
    console.log('Editing item with ID:', itemId); // Log the item ID being edited
    fetch(`http://localhost:8080/api/inventory/items/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ 
        item_name: itemName,  // changed to item_name
        stock_number: stockNumber  // changed to stock_number
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
      console.log('Item updated response data:', data); // Log response data
      showAlertMessage('Item updated successfully!', 'success');
      fetchItems();  // Refresh the items list
    })
    .catch(error => {
      console.error('Error updating item:', error); // Log any error
    });
  }

  closeItemModal(); // Close the modal after submitting
});


// Handling the Cancel button for items
document.getElementById('itemCancelButton').addEventListener('click', closeItemModal);

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
document.getElementById("closeItemAlert").addEventListener("click", function() {
    document.getElementById("alertMessage").classList.add("hidden");
});

export function deleteItem(event) {
  const itemId = event.target.closest('button').getAttribute('data-id');
  if (!itemId) {
      console.error('No item ID found to delete.');
      return;
  }

  // Show confirmation dialog
  alertify.confirm("Are you sure you want to delete this item?",
  function(){  // User clicked 'Ok'
      // Proceed to delete the item
      fetch(`http://localhost:8080/api/inventory/items/items/${itemId}`, {
          method: 'DELETE'
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          console.log('Item deleted successfully.');

          // Show the red danger alert
          showAlertMessage('Item deleted successfully!', 'danger'); // Red for delete

          // Remove the item from localStorage
          let savedItems = JSON.parse(localStorage.getItem('inventoryItems')) || [];
          savedItems = savedItems.filter(item => item.id !== Number(itemId));
          localStorage.setItem('inventoryItems', JSON.stringify(savedItems));

          // Refresh the items list after deletion
          fetchItems(); 
      })
      .catch(error => console.error('Error deleting item:', error));
  },
  function(){  // User clicked 'Cancel'
      alertify.error('Delete action canceled.');
  });
}


alertify.set('notifier', 'position', 'top-right');  // Set position of notifications
alertify.set('notifier', 'delay', 3); 