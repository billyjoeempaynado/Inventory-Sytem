import { ui } from "./ui";



document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[data-link]');
    const contentDiv = document.getElementById('content');
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalForm = document.getElementById('modalForm');
    const statusDiv = document.getElementById('statusDiv');
    const cancelButton = document.getElementById('cancelButton');

    // Attach click event to all links with data-link attribute
    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const target = event.target.closest('a').getAttribute('data-link');
            loadContent(target);
        });
    });

    // Function to load content dynamically based on the clicked link
    function loadContent(target) {
        let content = '';

        switch (target) {
            case 'items':
                content = `
                    <h2 class="text-xl font-semibold mb-4">Manage Items</h2>
                    <button id="addItemButton" class="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700">Add Items</button>
                    <div class="bg-white shadow-md rounded-lg overflow-hidden">
                        <table class="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th class="py-2 px-6 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th class="py-2 px-6 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th class="py-2 px-6 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td class="py-4 px-6 text-sm font-medium text-gray-900">Example Category 1</td>
                                    <td class="py-4 px-6 text-sm text-gray-500">Active</td>
                                    <td class="sm:flex py-4 px-6 text-sm">
                                        <button class="p-2 text-gray-700  hover:text-gray-500  ">
                                        <i class="fa-solid fa-pen-to-square"></i>
                                        </button>
                                        <button class="p-2 text-red-700 hover:text-red-500">
                                        <i class="fa-solid fa-trash-can" style="color: #f84444;"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="py-4 px-6 text-sm font-medium text-gray-900">Example Category 2</td>
                                    <td class="py-4 px-6 text-sm text-gray-500">Inactive</td>
                                    <td class="sm:flex py-4 px-6 text-sm">
                                        <button class="p-2 text-gray-700  hover:text-gray-500  ">
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
                break;

            case 'product':
                content = `
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
                                        <button class="p-2 text-gray-700  hover:text-gray-500  ">
                                        <i class="fa-solid fa-pen-to-square"></i>
                                        </button>
                                        <button class="p-2 text-red-700 hover:text-red-500">
                                        <i class="fa-solid fa-trash-can" style="color: #f84444;"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="py-4 px-6 text-sm font-medium text-gray-900">Example Product 2</td>
                                    <td class="py-4 px-6 text-sm text-gray-500">$200</td>
                                    <td class="sm:flex py-4 px-6 text-sm">
                                        <button class="p-2 text-gray-700  hover:text-gray-500  ">
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
                break;

            default:
                content = `
                    <h2 class="text-xl font-semibold mb-4">Welcome</h2>
                    <p>Select an option from the sidebar to manage items or products.</p>
                `;
                break;
        }

        // Load the content into the contentDiv
        contentDiv.innerHTML = content;

        // Attach the modal opening event after content is loaded
        if (target === 'items') {
            document.getElementById('addItemButton')?.addEventListener('click', function() {
                openModal('items');
            });
        } else if (target === 'product') {
            document.getElementById('addProductButton')?.addEventListener('click', function() {
                openModal('product');
            });
        }
    }

    // Function to open the modal based on the type (items or products)
    function openModal(type) {
        // Clear the form
        modalForm.reset();

        if (type === 'items') {
            // Modify modal for "Add Item"
            modalTitle.textContent = 'Add Item';
            statusDiv.classList.remove('hidden');
        } else if (type === 'product') {
            // Modify modal for "Add Product"
            modalTitle.textContent = 'Add Product';
            statusDiv.classList.add('hidden');
            modalForm.innerHTML = `
                <div class="mb-4">
                    <label for="productName" class="block text-gray-700 text-sm font-bold mb-2">Product Name</label>
                    <input type="text" id="productName" name="productName" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-4">
                    <label for="price" class="block text-gray-700 text-sm font-bold mb-2">Price</label>
                    <input type="number" id="price" name="price" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                </div>
            `;
        }

        // Show the modal
        modal.classList.remove('hidden');
    }

    // Hide modal on cancel
    cancelButton.addEventListener('click', function() {
        modal.classList.add('hidden');
    });

    // Handle save functionality
    document.getElementById('saveChanges').addEventListener('click', function() {
        // Add your save functionality here
        modal.classList.add('hidden');
    });
});
