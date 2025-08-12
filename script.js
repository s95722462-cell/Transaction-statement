document.addEventListener('DOMContentLoaded', function() {
    const itemTableBody = document.querySelector('#itemTable tbody');
    const addItemBtn = document.getElementById('addItemBtn');
    const grandTotalElem = document.getElementById('grandTotal');
    const printBtn = document.getElementById('printBtn');
    // issueDateInput and its usage removed

    let itemCounter = 0;

    function createNewItemRow() {
        itemCounter++;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td data-label="No." class="item-no">${itemCounter}</td>
            <td data-label="규격"><input type="text" class="form-control item-spec" placeholder="규격"></td>
            <td data-label="수량"><input type="text" class="form-control item-quantity" value="0"></td>
            <td data-label="단가"><input type="text" class="form-control item-unit-price" value="0"></td>
            <td data-label="금액" class="item-amount item-amount-wide">0</td>
        `;
        itemTableBody.appendChild(row);
        addEventListenersToRow(row);
        updateGrandTotals();
    }

    function addEventListenersToRow(row) {
        const quantityInput = row.querySelector('.item-quantity');
        const unitPriceInput = row.querySelector('.item-unit-price');
        // Removed deleteBtn and its event listener

        quantityInput.addEventListener('input', updateRowTotals);
        unitPriceInput.addEventListener('input', function(event) {
            formatNumberInput(event.target); // Call new formatting function
            updateRowTotals(event); // Then update totals
        });
    }

    // New formatting function
    function formatNumberInput(input) {
        let value = input.value.replace(/[^0-9.]/g, ''); // Remove non-digits except dot
        let parts = value.split('.');
        let integerPart = parts[0];
        let decimalPart = parts.length > 1 ? '.' + parts[1] : '';

        // Add commas to integer part
        integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        input.value = integerPart + decimalPart;
    }

    function updateRowTotals(event) {
        const row = event.target.closest('tr');
        // Remove commas before parsing for calculation
        const quantity = parseFloat(row.querySelector('.item-quantity').value.replace(/,/g, '')) || 0;
        const unitPrice = parseFloat(row.querySelector('.item-unit-price').value.replace(/,/g, '')) || 0;

        const amount = quantity * unitPrice; // Simplified to just 'amount'

        row.querySelector('.item-amount').textContent = amount.toLocaleString(); // Update item-amount

        updateGrandTotals();
    }

    function updateGrandTotals() {
        let grandTotal = 0; // Only grandTotal needed

        document.querySelectorAll('#itemTable tbody tr').forEach(row => {
            const amountText = row.querySelector('.item-amount').textContent.replace(/,/g, ''); // Get amount
            grandTotal += parseFloat(amountText) || 0;
        });

        grandTotalElem.textContent = grandTotal.toLocaleString(); // Only grandTotalElem
    }

    addItemBtn.addEventListener('click', createNewItemRow);
    printBtn.addEventListener('click', function() {
        const statement = document.querySelector('.container'); // The element to capture
        html2canvas(statement).then(canvas => {
            const imageURL = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.href = imageURL;
            downloadLink.download = '거래명세서.png';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        });
    });

    const deleteLastItemBtn = document.getElementById('deleteLastItemBtn'); // New button
    deleteLastItemBtn.addEventListener('click', function() {
        const rows = itemTableBody.querySelectorAll('tr');
        if (rows.length > 0) { // Ensure there's at least one row
            rows[rows.length - 1].remove(); // Remove the last row
            itemCounter--; // Decrement counter
            if (itemCounter < 0) itemCounter = 0; // Prevent negative counter
            updateGrandTotals();
        }
    });

    // Add an initial row when the page loads
    createNewItemRow();
});