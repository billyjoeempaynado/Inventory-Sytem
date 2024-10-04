import { fetchItems, openAddItemModal, searchItems, openEditItemModal, deleteItem } from './items.js';
import { fetchProducts, openAddProductModal, searchProducts, openEditProductModal, deleteProduct } from './products.js';


document.addEventListener('DOMContentLoaded', () => {
    // get div class of each section
    const itemsSection = document.getElementById('itemsSection');
    const productsSection = document.getElementById('productsSection');
    const welcomeSection = document.getElementById('welcomeSection');

    /// buttons on dashboard
    const itemsButtonDashboard = document.getElementById('itemsViewButton');
    const productsButtonDashboard = document.getElementById('productsViewButton');
    const itemsButton = document.getElementById('itemsButton');
    const productsButton = document.getElementById('productsButton');

    // should button for cancel
    const itemCancelButton = document.getElementById('itemCancelButton');
    const productCancelButton = document.getElementById('productCancelButton');


   
    // call for modal ID
    const itemModal = document.getElementById('itemModal');
    const productModal = document.getElementById('productModal');
    
    // function to show and hide each section
    function showSection(sectionToShow) {
        itemsSection.classList.add('hidden');
        productsSection.classList.add('hidden');
        welcomeSection.classList.add('hidden');
        sectionToShow.classList.remove('hidden');
      }
      
      // click funtion when click items and product button on dashboard
      itemsButtonDashboard.addEventListener('click', () => {
        showSection(itemsSection);
        fetchItems(); // Call fetch items when the button is clicked
       });

      itemsButton.addEventListener('click', () => {
        showSection(itemsSection);
        fetchItems();
       });

       productsButton.addEventListener('click', () => {
        showSection(productsSection);
        fetchProducts();
       });

       productsButtonDashboard.addEventListener('click', () => {
        showSection(productsSection);
        fetchItems(); // Call fetch items when the button is clicked
       });

        // Initially show welcome section
       showSection(welcomeSection);
      
      // function for open and close of each modal
      function closeItemModal() { itemModal.classList.add('hidden'); }  
      function closeProductModal() { productModal.classList.add('hidden'); }
      

      // declaration of variable to the closeModal function
      itemCancelButton.onclick = closeItemModal;
      productCancelButton.onclick = closeProductModal;
    
        // Add Item Button
      const addItemButton = document.getElementById('addItemButton');
      addItemButton.addEventListener('click', openAddItemModal);
    
      const addProductButton = document.getElementById('addProductButton');
      addProductButton.addEventListener('click', openAddProductModal);
    
      //  it is connected from itemSection when click this button it fetchItems
      itemsButton.addEventListener('click', fetchItems);
      productsButton.addEventListener('click', fetchProducts);


         // Trigger search on button click
      const searchItemButton = document.getElementById('searchItemButton');
      searchItemButton.addEventListener('click', searchItems);

      
         // Trigger search product on button click
         const searchProductButton = document.getElementById('searchProductButton');
         searchProductButton.addEventListener('click', searchProducts);
      
    // Initialize default view
    fetchItems();
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
      document.getElementById('itemCount').textContent = data.itemCount;
      document.getElementById('productCount').textContent = data.productCount;
    })
    .catch(error => {
      console.error('Error fetching counts:', error);
      document.getElementById('itemCount').textContent = 'Error';
      document.getElementById('productCount').textContent = 'Error';
    });
  
    
});