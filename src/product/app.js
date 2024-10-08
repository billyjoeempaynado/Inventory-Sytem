import { fetchProducts, openAddProductModal, searchProducts, openEditProductModal, deleteProduct } from './products.js';


document.addEventListener('DOMContentLoaded', () => {
  // get div class of each section
  const productsSection = document.getElementById('productsSection');
  const suppliersSection = document.getElementById('suppliersSection');
  const ordersSection = document.getElementById('ordersSection');
  const welcomeSection = document.getElementById('welcomeSection');

    /// buttons on dashboard
  const productsButtonDashboard = document.getElementById('productsViewButton');  
  const suppliersButton = document.getElementById('suppliersButton');
  const ordersButton = document.getElementById('ordersButton');
  const productsButton = document.getElementById('productsButton');

   // should button for cancel
  const productCancelButton = document.getElementById('productCancelButton');

  // call for modal ID
  const productModal = document.getElementById('productModal');

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
      });
  }

  if (ordersButton) {
      ordersButton.addEventListener('click', () => {
          showSection(ordersSection);
      });
  }

  

  // Ensure the section exists before using the showSection function
  function showSection(sectionToShow) {
      if (!sectionToShow) {
          console.error("Section to show is null or undefined.");
          return;
      }
      
      // Hide all sections
      productsSection?.classList.add('hidden');
      suppliersSection?.classList.add('hidden');
      ordersSection?.classList.add('hidden');
      welcomeSection?.classList.add('hidden');
      
      // Show the section passed to the function
      sectionToShow.classList.remove('hidden');
  }

  // declaration of variable to the closeModal function
  if (productCancelButton && productModal) {
    productCancelButton.onclick = () => productModal.classList.add('hidden');
  } 


  // Add modal open functionality
    
  const addProductButton = document.getElementById('addProductButton');
  addProductButton.addEventListener('click', openAddProductModal);
  
      
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