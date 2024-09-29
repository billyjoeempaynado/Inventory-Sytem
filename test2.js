import UI from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    const ui = new UI();


    // Add event listener for form submission
    document.getElementById('modalForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const type = ui.modalTitle.textContent.toLowerCase().includes('item') ? 'items' : 'products';

        let data = {};
        if (type === 'items') {
            const item_name = document.getElementById('itemName').value;
            const stock_number = document.getElementById('stockNumber').value;
            data = { item_name, stock_number };
        } else if (type === 'products') {
           
            const product_name = document.getElementById('productName').value;
            const price = document.getElementById('price').value;
            data = { product_name, price };
        } else {
            throw new error("Invalid")
        }

        try {
            const response = await fetch(`http://localhost:8080/api/v1/inventory/${type}/${type}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
                
            });

            console.log('Data:', data);
            console.log('URL:', `http://localhost:8080/api/v1/inventory/${type}`);

            if (type === 'items') {
                alert(`${type === 'items' ? 'Item' : 'Product'} added successfully`);
                ui.addNewRowToTable(data, type);
                ui.closeModal();

                // Save item to localStorage
                const storedItems = JSON.parse(localStorage.getItem('items')) || [];
                storedItems.push(data);
                localStorage.setItem('items', JSON.stringify(storedItems));               
            } else if (type === 'products') {
                alert(`${type === 'items' ? 'Item' : 'Product'} added successfully`);
                ui.addNewRowToTable(data, type);
                ui.closeModal();

                   // Save product to localStorage
                const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
                storedProducts.push(data);
                localStorage.setItem('products', JSON.stringify(storedProducts));
                    }

            else {
                alert(`Error adding ${type}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert(`Failed to add ${type}`);
        }
    });


    document.getElementById('delete').addEventListener('click', deleteDisplay => {
            
    });

    
});