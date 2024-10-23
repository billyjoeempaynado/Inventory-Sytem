import { fetchProducts, openAddProductModal, searchProducts, openEditProductModal, deleteProduct } from './products.js';
import { fetchSuppliers,openAddSupplierModal, searchSuppliers ,openEditSupplierModal, deleteSupplier } from './supplier.js';
import { fetchOrders, openAddOrderModal, searchOrders, openEditOrderModal } from './orders.js';


document.addEventListener('DOMContentLoaded', () => {
  // get div class of each section
  const productsSection = document.getElementById('productsSection');
  const suppliersSection = document.getElementById('suppliersSection');
  const ordersSection = document.getElementById('ordersSection');
  const inventoryLevelSection = document.getElementById('inventoryLevelSection');
  const reportsSection = document.getElementById('reportsSection');
  const logsSection = document.getElementById('logsSection');
  const orderDetailSection = document.getElementById('orderDetailSection');
  const welcomeSection = document.getElementById('welcomeSection');

    /// buttons on dashboard
  const productsButtonDashboard = document.getElementById('productsViewButton');  
  const suppliersButton = document.getElementById('suppliersButton');
  const ordersButton = document.getElementById('ordersButton');
  const productsButton = document.getElementById('productsButton');
  const inventoryLevelButton = document.getElementById('inventoryLevelButton');
  const reportsButton = document.getElementById('reportsButton');
  const viewDetailsButton = document.getElementById('.viewDetailsButton');
  const logsButton = document.getElementById('logsButton');

   // should button for cancel
  const productCancelButton = document.getElementById('productCancelButton');
  const supplierCancelButton = document.getElementById('supplierCancelButton');
  const orderCancelButton = document.getElementById('orderCancelButton');

  // call for modal ID
  const productModal = document.getElementById('productModal');
  const supplierModal = document.getElementById('supplierModal');
  const orderModal = document.getElementById('orderModal');

  // Check if the elements exist before attaching event listeners
  if (productsButtonDashboard) {
      productsButtonDashboard.addEventListener('click', () => {
          showSection(productsSection);
          fetchProducts();
      });
  }

  if (productsButton) {
    productsButton.addEventListener('click', () => {
        showSection(productsSection);
        fetchProducts();
    });
  }

  if (suppliersButton) {
      suppliersButton.addEventListener('click', () => {
          showSection(suppliersSection);
          fetchSuppliers();
      });
  }

  if (ordersButton) {
      ordersButton.addEventListener('click', () => {
          showSection(ordersSection);
          fetchOrders();
      });
  }
  if (inventoryLevelButton) {
    inventoryLevelButton.addEventListener('click', () => {
        showSection(inventoryLevelSection);

    });
  }

  if (reportsButton) {
    reportsButton.addEventListener('click', () => {
        showSection(reportsSection);

    });
  }
  if (logsButton) {
    logsButton.addEventListener('click', () => {
        showSection(logsSection);

    });
  }
  if (viewDetailsButton) {
    viewDetailsButton.addEventListener('click', () => {
        showSection(orderDetailSection);

    });
  }


  // Ensure the section exists before using the showSection function
  function showSection(sectionToShow) {
    const sections = [productsSection, suppliersSection, ordersSection, inventoryLevelSection, reportsSection, logsSection, orderDetailSection ,welcomeSection];
    sections.forEach(section => section.classList.add('hidden')); // Hide all sections
    sectionToShow.classList.remove('hidden'); // Show selected section
}

  // declaration of variable to the closeModal function
  if (productCancelButton && productModal) {
    productCancelButton.onclick = () => productModal.classList.add('hidden');
  } 

  if (supplierCancelButton && supplierModal) {
    supplierCancelButton.onclick = () => supplierModal.classList.add('hidden');
  } 

  if (orderCancelButton && orderModal) {
    orderCancelButton.onclick = () => orderModal.classList.add('hidden');
  } 


  // Add modal open functionality
    
  const addProductButton = document.getElementById('addProductButton');
  addProductButton.addEventListener('click', openAddProductModal);

  const addSupplierButton = document.getElementById('addSupplierButton');
  addSupplierButton.addEventListener('click', openAddSupplierModal);

  const addOrderButton = document.getElementById('addOrderButton');
  addOrderButton.addEventListener('click', openAddOrderModal);
  
      
    // Initialize default view

    fetchProducts();
      
    fetch('http://localhost:8080/api/counts')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Update the page with the fetched counts   
      document.getElementById('productCount').textContent = data.productCount;
    })
    .catch(error => {
      console.error('Error fetching counts:', error);
      document.getElementById('productCount').textContent = 'Error';
    });
  
    
});