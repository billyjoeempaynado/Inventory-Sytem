export default class UI {
  constructor() {
      this.links = document.querySelectorAll('a[data-link]');
      this.contentDiv = document.getElementById('content');
      this.modal = document.getElementById('modal');
      this.modalTitle = document.getElementById('modal-title');
      this.modalForm = document.getElementById('modalForm');
      this.statusDiv = document.getElementById('statusDiv');
      this.cancelButton = document.getElementById('cancelButton');
      this.addItemButton = document.getElementById('addItemButton');

      // Attach click event to all links with data-link attribute
      this.links.forEach(link => {
          link.addEventListener('click', (event) => {
              event.preventDefault();
              const target = event.target.closest('a').getAttribute('data-link');
              this.loadContent(target); // Call the method that loads content
          });
      });

      // Hide modal on cancel
      this.cancelButton.addEventListener('click', () => {
          this.closeModal();
      });
  }

  loadContent(target) {
      let content = '';

      switch (target) {
          case 'items':
              content = this.getItemContent();
              break;
          case 'product':
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
      } else if (target === 'product') {
          document.getElementById('addProductButton')?.addEventListener('click', () => this.openModal('product'));
      }
  }

  getItemContent() {
      return `
          <h2 class="text-xl font-semibold mb-4">Manage Items</h2>
          <button id="addItemButton" class="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700">Add Items</button>
          <div class="bg-white shadow-md rounded-lg overflow-hidden">
              <table class="min-w-full bg-white">
                  <thead>
                      <tr>
                          <th class="py-2 px-6 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          <th class="py-2 px-6 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                          <th class="py-2 px-6 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                      <tr>
                          <td class="py-4 px-6 text-sm font-medium text-gray-900">Example Category 1</td>
                          <td class="py-4 px-6 text-sm text-gray-500">Active</td>
                          <td class="sm:flex py-4 px-6 text-sm">
                              <button class="p-2 text-gray-700 hover:text-gray-500">
                                  <i class="fa-solid fa-pen-to-square"></i>
                              </button>
                              <button class="p-2 text-red-700 hover:text-red-500">
                                  <i class="fa-solid fa-trash-can" style="color: #f84444;"></i>
                              </button>
                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>
      `;
  }

  getProductContent() {
      return `
          <h2 class="text-xl font-semibold mb-4">Manage Products</h2>
          <button id="addProductButton" class="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-700">Add Product</button>
          <div class="bg-white shadow-md rounded-lg overflow-hidden">
              <table class="min-w-full bg-white">
                  <thead>
                      <tr>
                          <th class="py-2 px-6 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                          <th class="py-2 px-6 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th class="py-2 px-6 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                      <tr>
                          <td class="py-4 px-6 text-sm font-medium text-gray-900">Example Product 1</td>
                          <td class="py-4 px-6 text-sm text-gray-500">$100</td>
                          <td class="sm:flex py-4 px-6 text-sm">
                              <button class="p-2 text-gray-700 hover:text-gray-500">
                                  <i class="fa-solid fa-pen-to-square"></i>
                              </button>
                              <button class="p-2 text-red-700 hover:text-red-500">
                                  <i class="fa-solid fa-trash-can" style="color: #f84444;"></i>
                              </button>
                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>
      `;
  }

  getDefaultContent() {
      return `
          <h2 class="text-xl font-semibold mb-4">Welcome</h2>
          <p>Select an option from the sidebar to manage items or products.</p>
      `;
  }

  openModal(type) {
      this.modalForm.reset();

      if (type === 'items') {
          this.modalTitle.textContent = 'Add Item';
          this.statusDiv.classList.remove('hidden');
          this.modalForm.innerHTML = `
              <div class="mb-4">
                  <label for="itemName" class="block text-gray-700 text-sm font-bold mb-2">Item Name</label>
                  <input type="text" id="itemName" name="item_name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              </div>
              <div class="mb-4">
                  <label for="stockNumber" class="block text-gray-700 text-sm font-bold mb-2">Stock Number</label>
                  <input type="number" id="stockNumber" name="stock_number" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              </div>
              <button id="saveChanges" type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
          `;
      } else if (type === 'product') {
          this.modalTitle.textContent = 'Add Product';
          this.statusDiv.classList.add('hidden');
          this.modalForm.innerHTML = `
              <div class="mb-4">
                  <label for="productName" class="block text-gray-700 text-sm font-bold mb-2">Product Name</label>
                  <input type="text" id="productName" name="product_name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              </div>
              <div class="mb-4">
                  <label for="price" class="block text-gray-700 text-sm font-bold mb-2">Price</label>
                  <input type="number" id="price" name="price" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              </div>
              <button id="saveChanges" type="submit" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">Save</button>
          `;
      }

      this.modal.classList.remove('hidden');
  }

  closeModal() {
      this.modal.classList.add('hidden');
  }
}
