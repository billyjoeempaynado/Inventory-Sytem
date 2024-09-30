function closeItemModal() { itemModal.classList.add('hidden'); }
itemCancelButton.onclick = closeItemModal;

let currentPage = 1;
const itemsPerPage = 6; // Adjust the number of items per page as needed

export function fetchItems() {
    fetch('http://localhost:8080/api/inventory/items/items')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(items => {
        // console.log('Fetched items from server:', items);  // <-- Log fetched items
        localStorage.setItem('inventoryItems', JSON.stringify(items));  // Update cache
        displayItems(items);
      })
      .catch(error => console.error('Error fetching items:', error));
  }
  
  export function displayItems(items) {
    const totalPages = Math.ceil(items.length / itemsPerPage);
  
    const paginatedItems = paginate(items, currentPage, itemsPerPage);  // Use the paginate function here
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
            <button id="edit" data-id="${item.id}" class="p-2 text-gray-700 hover:text-gray-500">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button data-id="${item.id}" class="delete-item-btn p-2 text-red-700 hover:text-red-500">
              <i class="fa-solid fa-trash-can" style="color: #f84444;"></i>
            </button>
          </td>
        `;
        tableBody.appendChild(row);
      });
  
      document.querySelectorAll('.delete-item-btn').forEach(button => {
        button.addEventListener('click', deleteItem);
      });
    }
  
    // Add Pagination Controls
    setupPaginationControls(totalPages, fetchItems);
  }

// Pagination function to get items for the current page
function paginate(items, page, itemsPerPage) {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return items.slice(start, end);
}

  
  
 // Common Pagination Setup Function for Items and Products
function setupPaginationControls(totalPages, fetchFunction) {
    const paginationControls = document.getElementById('paginationControls');
    paginationControls.innerHTML = ''; // Clear existing pagination buttons
  
    // Create Previous Button
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.className = `px-4 py-2 ${currentPage === 1 ? 'bg-gray-300' : 'bg-blue-500 text-white'}`;
    prevButton.disabled = currentPage === 1; // Disable if on the first page
    prevButton.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        fetchFunction(); // Call the appropriate fetch function (items or products)
      }
    });
    paginationControls.appendChild(prevButton);
  
    // Create Page Number Buttons
    for (let page = 1; page <= totalPages; page++) {
      const pageButton = document.createElement('button');
      pageButton.textContent = page;
      pageButton.className = `px-4 py-2 ${page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-300'}`;
      
      pageButton.addEventListener('click', () => {
        currentPage = page;
        fetchFunction(); // Call the appropriate fetch function (items or products)
      });
  
      paginationControls.appendChild(pageButton);
    }
  
    // Create Next Button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.className = `px-4 py-2 ${currentPage === totalPages ? 'bg-gray-300' : 'bg-blue-500 text-white'}`;
    nextButton.disabled = currentPage === totalPages; // Disable if on the last page
    nextButton.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        fetchFunction(); // Call the appropriate fetch function (items or products)
      }
    });
    paginationControls.appendChild(nextButton);
  }
  

    // Modal logic for Add Item
  const addItemForm = document.getElementById('addItemForm');
  addItemForm.addEventListener('submit', function (e) {
    e.preventDefault();
  
    const item_name = document.querySelector('input[name="itemName"]').value;
    const stock_number = document.querySelector('input[name="stockNumber"]').value;

    fetch('http://localhost:8080/api/inventory/items/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_name, stock_number })
      })
        .then(response => {
          // Try to parse the response as JSON, but if it fails, return plain text
          return response.text().then(text => {
            try {
              return JSON.parse(text);  // If it's JSON, parse it
            } catch (error) {
              return text;  // If it's plain text, return the raw text
            }
          });
        })
        .then(result => {
          if (typeof result === 'object' && result.item) {
            // JSON response case: Item was added and returned in JSON format
            console.log('Item added successfully:', result.item);
            
            // Add the new item to local storage
            const savedItems = JSON.parse(localStorage.getItem('inventoryItems')) || [];
            savedItems.push(result.item);
            localStorage.setItem('inventoryItems', JSON.stringify(savedItems));
            
            fetchItems();  // Refresh the items list
          } else {
            // Plain text response case: Server sent a message instead of JSON
            console.log('Server message:', result);  // Log the plain text response
            
            // Optionally, fetch items from the server to get the latest list
            fetchItems();
          }
      
          // Close the modal and reset the form
          closeItemModal();
          addItemForm.reset();
        })
        .catch(error => console.error('Error adding item:', error));
      
});
  


// Function to delete an item
export function deleteItem(event) {
  const itemId = event.target.closest('button').getAttribute('data-id'); // Fixing the itemId fetching
  if (!itemId) {
    console.error('No item ID found to delete.');
    return;
  }

  fetch(`http://localhost:8080/api/inventory/items/items/${itemId}`, {
    method: 'DELETE'
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log('Item deleted successfully.');

      // Remove the item from localStorage
      let savedItems = JSON.parse(localStorage.getItem('inventoryItems')) || [];
      savedItems = savedItems.filter(item => item.id !== Number(itemId)); // Ensure matching ID type
      localStorage.setItem('inventoryItems', JSON.stringify(savedItems));

      fetchItems(); // Refresh the items list after deletion
    })
    .catch(error => console.error('Error deleting item:', error));
}
