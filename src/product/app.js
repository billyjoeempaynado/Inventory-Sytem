// app.js
import UI from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    const ui = new UI();

    document.addEventListener('click', (event) => {
        if (event.target && event.target.matches('#addItemButton')) {
            ui.openModal('items');
        }

        if (event.target && event.target.matches('#addProductButton')) {
            ui.openModal('product');
        }
    });

    document.getElementById('modalForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const type = ui.modalTitle.textContent.toLowerCase().includes('item') ? 'items' : 'product';

        let data = {};

        if (type === 'items') {
            const item_name = document.getElementById('itemName').value;
            const stock_number = document.getElementById('stockNumber').value;
            data = { item_name, stock_number };
        } else if (type === 'product') {
            const product_name = document.getElementById('productName').value;
            const price = document.getElementById('price').value;
            data = { product_name, price };
        }

        try {
            const response = await fetch(`http://localhost:8080/api/v1/Inventory_System/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                alert(`${type === 'items' ? 'Item' : 'Product'} added successfully`);
                ui.closeModal(); // Hide modal after success
            } else {
                alert(`Error adding ${type}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert(`Failed to add ${type}`);
        }
    });
});
