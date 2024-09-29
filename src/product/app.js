document.addEventListener('DOMContentLoaded', () => {
  const itemsSection = document.getElementById('itemsSection');
  const productsSection = document.getElementById('productsSection');
  const welcomeSection = document.getElementById('welcomeSection');

  const itemsButton = document.getElementById('itemsButton');
  const productsButton = document.getElementById('productsButton');
  const itemCancelButton = document.getElementById('itemCancelButton');
  const productCancelButton = document.getElementById('productCancelButton');

  const itemModal = document.getElementById('itemModal');
  const productModal = document.getElementById('productModal');

  function showSection(sectionToShow) {
    itemsSection.classList.add('hidden');
    productsSection.classList.add('hidden');
    welcomeSection.classList.add('hidden');
    sectionToShow.classList.remove('hidden');
  }

  itemsButton.addEventListener('click', () => showSection(itemsSection));
  productsButton.addEventListener('click', () => showSection(productsSection));
  showSection(welcomeSection);

  function openItemModal() { itemModal.classList.remove('hidden'); }
  function closeItemModal() { itemModal.classList.add('hidden'); }
  function openProductModal() { productModal.classList.remove('hidden'); }
  function closeProductModal() { productModal.classList.add('hidden'); }

  itemCancelButton.onclick = closeItemModal;
  productCancelButton.onclick = closeProductModal;

  const addItemButton = document.getElementById('addItemButton');
  addItemButton.addEventListener('click', openItemModal);

  function displayItems(items) {
    const tableBody = document.querySelector('#itemsTableBody');
    tableBody.innerHTML = '';  // Clear existing rows

    if (items.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="3" class="text-center">No items found.</td></tr>';
    } else {
      items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td class="py-4 px-6 text-sm font-medium text-gray-900">${item.item_name}</td>
          <td class="py-4 px-6 text-sm text-gray-500">${item.stock_number}</td>
          <td class="sm:flex py-4 px-6 text-sm">
            <button id="edit" data-id="${item.id}" class="p-2 text-gray-700 hover:text-gray-500">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button data-id="${item.id}" class="delete-btn p-2 text-red-700 hover:text-red-500">
              <i class="fa-solid fa-trash-can" style="color: #f84444;"></i>
            </button>
          </td>
        `;
        tableBody.appendChild(row);
      });

      document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', deleteItem);
      });
    }
  }

  function fetchItems() {
    const savedItems = localStorage.getItem('inventoryItems');
    if (savedItems) {
      const items = JSON.parse(savedItems);
      displayItems(items);
    } else {
      fetch('http://localhost:8080/api/inventory/items/items')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(items => {
          localStorage.setItem('inventoryItems', JSON.stringify(items));
          displayItems(items);
        })
        .catch(error => console.error('Error fetching items:', error));
    }
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
        if (!response.ok) {
          return response.text().then(text => { throw new Error(text); });
        }
        return response.text(); // Handling plain text response instead of JSON
      })
      .then(message => {
        console.log('Item added successfully:', message);
        
        // Simulate a new item based on the user input (you might get an ID from the server)
        const newItem = { id: Date.now(), item_name, stock_number }; // Simulate new item with a unique ID

        // Add item to localStorage
        const savedItems = JSON.parse(localStorage.getItem('inventoryItems')) || [];
        savedItems.push(newItem);
        localStorage.setItem('inventoryItems', JSON.stringify(savedItems));

        fetchItems(); // Refresh items in the table
        closeItemModal(); // Close the modal
        addItemForm.reset(); // Clear form
      })
      .catch(error => console.error('Error adding item:', error));
  });

  // Function to delete an item
  function deleteItem(event) {
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

  // Initial fetch of items on page load
  fetchItems();

  // Add product modal logic (if needed)
  const addProductButton = document.getElementById('addProductButton');
  addProductButton.addEventListener('click', openProductModal);

  const addProductForm = document.getElementById('addProductForm');
  addProductForm.addEventListener('submit', function (e) {
    e.preventDefault();
    closeProductModal();
  });
});
