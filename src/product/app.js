import { fetchItems, displayItems, deleteItem} from './items.js';
import { fetchProducts, displayProducts, deleteProduct } from './products.js';


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
    
      const addProductButton = document.getElementById('addProductButton');
      addProductButton.addEventListener('click', openProductModal);
    

      itemsButton.addEventListener('click', fetchItems);
      productsButton.addEventListener('click', fetchProducts);

    
    // Initialize default view
    fetchItems();
    fetchProducts();

    
});
