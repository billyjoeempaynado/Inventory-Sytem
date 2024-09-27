export default class UI {
    constructor() {
        this.links = document.querySelectorAll('a[data-link]');
        this.contentDiv = document.getElementById('content');
        this.modal = document.getElementById('modal');
        this.modalTitle = document.getElementById('modal-title');
        this.modalForm = document.getElementById('modalForm');
        this.statusDiv = document.getElementById('statusDiv');
        this.cancelButton = document.getElementById('cancelButton');
        this.deleteBtn = document.querySelector('#deleteBtn');
      

        // Pagination control
        this.currentPage = 1; // Default to the first page
        this.itemsPerPage = 10; // Set items per page

        // Attach click event to all links with data-link attribute
        this.links.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const target = event.target.closest('a').getAttribute('data-link');
                this.loadContent(target); // Call the method that loads content
            });
        });

    }

    loadContent(target) {
        let content = '';

        switch (target) {
            case 'items':
                content = this.getItemContent();
                break;
            case 'products':
                content = this.getProductContent();
                break;
            default:
                content = this.getDefaultContent();
                break;
        }

        // Load the content into the contentDiv
        this.contentDiv.innerHTML = content;

        // Attach modal open event
    if (target === 'items') {
        document.getElementById('addItemButton')?.addEventListener('click', () => this.openModal('items'));

        // Load saved items from localStorage and populate the table with pagination
        const savedItems = JSON.parse(localStorage.getItem('items')) || [];
        this.renderTableWithPagination(savedItems, 'items');  // Render table with pagination
    } else if (target === 'products') {
        document.getElementById('addProductButton')?.addEventListener('click', () => this.openModal('products'));

        // Load saved products from localStorage and populate the table with pagination
        const savedProducts = JSON.parse(localStorage.getItem('products')) || [];
        this.renderTableWithPagination(savedProducts, 'products');  // Render table with pagination
    }
    }

         renderTableWithPagination(data, type) {
        const totalPages = Math.ceil(data.length / this.itemsPerPage);  // Calculate total pages
        
        // Slice data to display only the current page's items
        const paginatedData = data.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
        
        // Clear the table body
        const tableBody = document.getElementById(`${type}TableBody`);
        tableBody.innerHTML = '';  // Clear current rows
    
        // Populate table with the paginated data
        paginatedData.forEach(item => {
            this.addNewRowToTable(item, type);
        });
    
        // Render pagination buttons
        this.renderPaginationControls(totalPages, type);  // Render the pagination buttons for navigating pages
    }
    

    renderPaginationControls(totalPages, type) {
        const paginationDiv = document.getElementById('pagination');
      
        paginationDiv.innerHTML = ''; // Clear the current pagination buttons
    
        // Add "Previous" button if the current page is greater than 1
        if (this.currentPage > 1) {
            const prevButton = document.createElement('button');
            prevButton.className = 'pagination-button bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md transition-colors duration-300';
            prevButton.textContent = 'Previous';
            prevButton.addEventListener('click', () => {
                this.currentPage--;  // Move to the previous page
                this.renderTableWithPagination(JSON.parse(localStorage.getItem(type)), type);  // Re-render the table
            });
            paginationDiv.appendChild(prevButton);
        }
    
        // Add numbered page buttons
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.className = `pagination-button px-4 py-2 rounded-md transition-colors duration-300 ${i === this.currentPage ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700 hover:bg-blue-400 hover:text-white'}`;
            pageButton.textContent = i;
            pageButton.disabled = (i === this.currentPage);  // Disable the current page button
            pageButton.addEventListener('click', () => {
                this.currentPage = i;  // Set current page to the clicked page number
                this.renderTableWithPagination(JSON.parse(localStorage.getItem(type)), type);  // Re-render the table
            });
            paginationDiv.appendChild(pageButton);
        }
    
        // Add "Next" button if the current page is less than the total pages
        if (this.currentPage < totalPages) {
            const nextButton = document.createElement('button');
            nextButton.className = 'pagination-button bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md transition-colors duration-300';
            nextButton.textContent = 'Next';
            nextButton.addEventListener('click', () => {
                this.currentPage++;  // Move to the next page
                this.renderTableWithPagination(JSON.parse(localStorage.getItem(type)), type);  // Re-render the table
            });
            paginationDiv.appendChild(nextButton);
        }
    }
    
    
    

    getItemContent() {
        return `
                <h2 class="text-xl font-semibold mb-4">Manage Items</h2>
                <button id="addItemButton" class="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700">Add Item</button>
                <div class="bg-white shadow-md rounded-lg overflow-hidden">
                    <table class="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th class="py-2 px-6 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                                <th class="py-2 px-6 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Number</th>
                                <th class="py-2 px-6 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody id="itemsTableBody" class="bg-white divide-y divide-gray-200"></tbody>
                    </table>
                </div>
                <div id="pagination" class="mt-4 flex justify-center space-x-2"></div>
            `;
    }

    getProductContent() {
        return `
                <h2 class="text-xl font-semibold mb-4">Manage Products</h2>
                <button id="addProductButton" class="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700">Add Product</button>
                <div class="bg-white shadow-md rounded-lg overflow-hidden">
                    <table class="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th class="py-2 px-6 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                                <th class="py-2 px-6 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th class="py-2 px-6 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody id="productsTableBody" class="bg-white divide-y divide-gray-200"></tbody>
                    </table>
                </div>
                <div id="pagination" class="mt-4 flex justify-center space-x-2"></div>
            `;
    }

    addNewRowToTable(data, type) {
        const tableBody = document.getElementById(`${type}TableBody`);

        //   // Debug: Check if the data object contains the id
        //  console.log('Data object:', data);  // This will show if data.id exists 

        if (tableBody) {
            // Create a new row
            const newRow = document.createElement('tr');
                   
            newRow.innerHTML = `
          
                <td class="py-4 px-6 text-sm font-medium text-gray-900">${data.item_name || data.product_name}</td>
                <td class="py-4 px-6 text-sm text-gray-500">${type === 'items' ? data.stock_number : `\u20B1${data.price}`}</td>
                <td class="sm:flex py-4 px-6 text-sm">
                    <button id="edit" class="p-2 text-gray-700 hover:text-gray-500">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button data-id="${type.id}" class="deleteBtn p-2 text-red-700 hover:text-red-500">
                        <i class="fa-solid fa-trash-can" style="color: #f84444;"></i>
                    </button>
                </td>
           
            `;

            
            const deleteBtn = newRow.querySelector('.deleteBtn');
            deleteBtn.addEventListener('click', (event) => {
            const itemId = event.target.closest('button').getAttribute('data-id'); // Get the data-id of the clicked row
            console.log(`Deleting item with ID: ${itemId}`);

            
              });

            tableBody.appendChild(newRow);

            } else {
                console.error(`Table body element not found for type: ${type}`);
            }

        }
                    

    openModal(type) {
        this.modalForm.reset();

        if (type === 'items') {
            this.modalTitle.textContent = 'Add Item';
            this.modalForm.innerHTML = `
                <div class="mb-4">
                    <label for="itemName" class="block text-gray-700 text-sm font-bold mb-2">Item Name</label>
                    <input type="text" id="itemName" name="item_name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-4">
                    <label for="stockNumber" class="block text-gray-700 text-sm font-bold mb-2">Stock Number</label>
                    <input type="number" id="stockNumber" name="stock_number" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button id="saveChanges" type="submit" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">Save changes</button>
                    <button id="cancelModal" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:w-auto sm:text-sm">Cancel</button>
                </div>
            `;
        } else if (type === 'products') {
            this.modalTitle.textContent = 'Add Product';
            this.modalForm.innerHTML = `
                <div class="mb-4">
                    <label for="productName" class="block text-gray-700 text-sm font-bold mb-2">Product Name</label>
                    <input type="text" id="productName" name="product_name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-4">
                    <label for="price" class="block text-gray-700 text-sm font-bold mb-2">Price</label>
                    <input type="number" id="price" name="price" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                 <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button id="saveChanges" type="submit" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">Save changes</button>
                <button id="cancelModal" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:w-auto sm:text-sm">Cancel</button>
                </div>
            `;
        }

        this.modal.classList.remove('hidden');

        // Add event listener to the cancel button to close the modal
        document.getElementById('cancelModal').addEventListener('click', () => {
            this.closeModal(); // Close the modal without adding data
        });;
    }

    closeModal() {
        this.modal.classList.add('hidden');
    }
}
