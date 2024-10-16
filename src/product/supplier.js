let currentPage = 1;
const suppliersPerPage = 6;

// Fetch and display Suppliers
export function fetchSuppliers() {
    fetch('http://localhost:8080/api/inventory/suppliers')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(suppliers => {
            localStorage.setItem('inventorySuppliers', JSON.stringify(suppliers));
            displaySuppliers(suppliers);
        })
        .catch(error => console.error('Error fetching suppliers:', error));
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

export function searchSuppliers() {
  const searchQuery = document.getElementById('searchSupplierInput').value.trim().toLowerCase();
  const suppliers = JSON.parse(localStorage.getItem('inventorySuppliers')) || [];

  const filteredSuppliers = suppliers.filter(item => 
      item.supplier_name.toLowerCase().includes(searchQuery)
     
  );

  // Reset pagination to page 1 when searching
  currentPage = 1; 

  // Display filtered items (make sure it handles pagination)
  displaySuppliers(filteredSuppliers);
}

const debouncedSearchSuppliers = debounce(searchSuppliers, 300); // 300ms delay

// Attach the debounced function to the input event
document.getElementById('searchSupplierInput').addEventListener('input', debouncedSearchSuppliers);

export function displaySuppliers(suppliers) {
  const totalPages = Math.ceil(suppliers.length / suppliersPerPage);
  const paginatedSuppliers = paginate(suppliers, currentPage, suppliersPerPage);
  const tableBody = document.querySelector('#supplierTableBody');
  tableBody.innerHTML = ''; // Clear existing rows

  if (paginatedSuppliers.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="3" class="text-center">No Supplier found.</td></tr>';
  } else {
      paginatedSuppliers.forEach(suppliers => {
        
          const row = document.createElement('tr');

          row.innerHTML = `
              <td class="py-4 px-6 text-sm  text-gray-900">${suppliers.supplier_name}</td>
              <td class="py-4 px-6 text-sm text-gray-500">${suppliers.contact_person}  </td>
              <td class="py-4 px-6 text-sm text-gray-500">${suppliers.phone_number}</td>
              <td class="py-4 px-6 text-sm text-gray-500">${suppliers.supplier_email}</td>
              <td class="py-4 px-6 text-sm text-gray-500"> ${suppliers.supplier_address}</td>
              <td class="sm:flex py-4 px-6 text-sm">
                  <button data-id="${suppliers.supplier_id}" class="edit-supplier-btn p-2 text-gray-700 hover:text-gray-500">
                      <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button data-id="${suppliers.supplier_id}" class="delete-supplier-btn p-2 text-red-700 hover:text-red-500">
                      <i class="fa-solid fa-trash-can" style="color: #f84444;"></i>
                  </button>
              </td>
          `;
          tableBody.appendChild(row);
      });

      // Attach event listeners after adding rows
      attachSupplierEventListeners();
  }

  // Add Pagination Controls
  setupPaginationControls(totalPages, () => displaySuppliers(suppliers));  // Use displaySupplier for re-rendering
}

// Pagination function to get supplier for the current page
function paginate(suppliers, page, suppliersPerPage) {
  const start = (page - 1) * suppliersPerPage;
  const end = start + suppliersPerPage;
  return suppliers.slice(start, end);
}

function setupPaginationControls(totalPages, fetchSupplierCallback) {
  const supplierPaginationControls = document.getElementById('supplierPaginationControls');
  supplierPaginationControls.innerHTML = ''; // Clear existing buttons

   // Previous Button
   const supplierPrevButton = document.createElement('button');
   supplierPrevButton.textContent = 'Previous';
   supplierPrevButton.className = `px-4 py-2 rounded bg-gray-300 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`;
   supplierPrevButton.disabled = currentPage === 1;
   supplierPrevButton.addEventListener('click', () => {
       if (currentPage > 1) {
           currentPage--;
           fetchSupplierCallback();
       }
   });
   supplierPaginationControls.appendChild(supplierPrevButton);

   // Page Number Buttons
   for (let page = 1; page <= totalPages; page++) {
       const supplierPageButton = document.createElement('button');
       supplierPageButton.textContent = page;
       supplierPageButton.className = `px-4 py-2 rounded ${page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-300'}`;
       
       supplierPageButton.addEventListener('click', () => {
           currentPage = page;
           fetchSupplierCallback();
       });

      supplierPaginationControls.appendChild(supplierPageButton);
   } 

   // Next Button
   const suppliertNextButton = document.createElement('button');
   suppliertNextButton.textContent = 'Next';
   suppliertNextButton.className = `px-4 py-2 rounded bg-gray-300 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`;
   suppliertNextButton.disabled = currentPage === totalPages;
   suppliertNextButton.addEventListener('click', () => {
       if (currentPage < totalPages) {
           currentPage++;
           fetchSupplierCallback();
       }
   });
   supplierPaginationControls.appendChild(suppliertNextButton);
}
// Attach event listeners for edit and delete buttons
function attachSupplierEventListeners() {
  // Edit Buttons
  document.querySelectorAll('.edit-supplier-btn').forEach(button => {
      button.addEventListener('click', (event) => {
          const supplierId = event.currentTarget.getAttribute('data-id');
          const suppliers = JSON.parse(localStorage.getItem('inventorySuppliers')) || [];
          const supplierToEdit = suppliers.find(supplier=> supplier.supplier_id === Number(supplierId));
          if (supplierToEdit) {
              // Open the modal and populate fields with the existing supplier data
              openEditSupplierModal(supplierId, supplierToEdit.supplier_name, supplierToEdit.contact_person, supplierToEdit.phone_number, supplierToEdit.supplier_email, supplierToEdit.supplier_address);
          } else {
              console.error('Supplier not found:', supplierId);
          }
      });
  });

    // Delete Buttons
    document.querySelectorAll('.delete-supplier-btn').forEach(button => {
      button.addEventListener('click', deleteSupplier);
  });
}


// Reusable modal for supplier
export function openAddSupplierModal() {
  const supplierForm = document.getElementById('supplierForm');
  supplierForm.setAttribute('data-mode', 'add');  // Set form mode to 'add'
  console.log('Form mode set to:', supplierForm.getAttribute('data-mode'));  // Debugging log

  // Clear the input fields
  document.getElementById('supplierName').value = '';
  document.getElementById('contactPerson').value = '';
  document.getElementById('phoneNumber').value = '';
  document.getElementById('supplierEmail').value = '';
  document.getElementById('supplierAddress').value = '';

  // Update modal title and button text for "Add"
  document.getElementById('supplierModalTitle').innerText = 'Add Supplier';
  document.getElementById('supplierSubmitButton').innerText = 'Add';


  // Open the modal (assuming you have some modal logic)
  document.getElementById('supplierModal').classList.remove('hidden');
}

// Function to open the supplier Modal (for both Add and Edit)
export function openEditSupplierModal(supplierId, supplierName, contactPerson, phoneNumber, supplierEmail, supplierAddress) {
  const supplierForm = document.getElementById('supplierForm');
  supplierForm.setAttribute('data-mode', 'edit');  // Set form mode to 'edit'
  supplierForm.setAttribute('data-id', supplierId);    // Set the form's data-id to the supplierID


  // Populate the form fields with the item data
  document.getElementById('supplierName').value = supplierName;
  document.getElementById('contactPerson').value = contactPerson;
  document.getElementById('phoneNumber').value = phoneNumber;
  document.getElementById('supplierEmail').value = supplierEmail;
  document.getElementById('supplierAddress').value = supplierAddress;

  // Update modal title and button text for "Edit"
  document.getElementById('supplierModalTitle').innerText = 'Edit Supplier';
  document.getElementById('supplierSubmitButton').innerText = 'Update';

  // Open the modal
  document.getElementById('supplierModal').classList.remove('hidden');
}

// Function to close the Item Modal
export function closeSupplierModal() {
  document.getElementById('supplierForm').reset(); // Clear the form
  document.getElementById('supplierModal').classList.add('hidden');
}

// Handling the form submission for supplier (both add and edit)
document.getElementById('supplierForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const supplierForm = event.target;
  const mode = supplierForm.getAttribute('data-mode'); // Either 'add' or 'edit'
  const supplierName = document.getElementById('supplierName').value.trim();
  const contactPerson = document.getElementById('contactPerson').value.trim();
  const phoneNumber = document.getElementById('phoneNumber').value.trim();
  const supplierEmail = document.getElementById('supplierEmail').value.trim();
  const supplierAddress = document.getElementById('supplierAddress').value.trim();


  console.log('Form Data:', { supplierName, contactPerson ,phoneNumber, supplierEmail, supplierAddress}); // Log the form data

  if (mode === 'add') {
    // Add a new item
    fetch('http://localhost:8080/api/inventory/suppliers', {
      method: 'POST',
      body: JSON.stringify({ 
        supplier_name: supplierName.trim(),
        contact_person: contactPerson.trim(),
        phone_number: phoneNumber.trim(),
        supplier_email: supplierEmail.trim(),
        supplier_address: supplierAddress.trim()
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
      console.log('supplier added response data:', data);  // Log the response
      showAlertMessage('supplier added successfully!', 'success');
      fetchSuppliers();  // Refresh the supplier list
    })
    .catch(error => {
      console.error('Error adding item:', error);  // Log any error
    });
    
  }   else if (mode === 'edit') {
    // Edit an existing item
    const supplierId = supplierForm.getAttribute('data-id');
    console.log('Editing supplier with ID:', supplierId); // Log the item ID being edited
    fetch(`http://localhost:8080/api/inventory/suppliers/${supplierId}`, {
      method: 'PUT',
      body: JSON.stringify({ 
        supplier_name: supplierName.trim(),
        contact_person: contactPerson.trim(),
        phone_number: phoneNumber.trim(),
        supplier_email: supplierEmail.trim(),
        supplier_address: supplierAddress.trim()
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
      console.log('supplierupdated response data:', data); // Log response data
      showAlertMessage('supplier updated successfully!', 'success');
      fetchSuppliers();  // Refresh the supplier list
    })
    .catch(error => {
      console.error('Error updating supplier:', error); // Log any error
    });
  }

  closeSupplierModal(); // Close the modal after submitting
});

export function deleteSupplier(event) {
  const supplierId = event.target.closest('button').getAttribute('data-id');
  if (!supplierId) {
      console.error('No Supplier ID found to delete.');
      return;
  }

  // Show confirmation dialog
  alertify.confirm("Are you sure you want to delete this supplier?",
  function(){  // User clicked 'Ok'
      // Proceed to delete the item
      fetch(`http://localhost:8080/api/inventory/suppliers/${supplierId}`, {
          method: 'DELETE'
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          console.log('Supplier deleted successfully.');

          // Show the red danger alert
          showAlertMessage('Supplier deleted successfully!', 'danger'); // Red for delete

          // Remove the item from localStorage
          let savedSuppliers = JSON.parse(localStorage.getItem('inventorySuppliers')) || [];
          savedSuppliers = savedSuppliers.filter(supplier => supplier.supplier_id !== Number(supplierId));
          localStorage.setItem('inventorySuppliers', JSON.stringify(savedSuppliers));

          // Refresh the supplier list after deletion
          fetchSuppliers(); 
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