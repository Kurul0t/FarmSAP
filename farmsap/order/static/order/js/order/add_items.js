const els = {
    productSelect: document.getElementById("productSelect"),
    priceInput: document.getElementById("priceInput"),
    qtyInput: document.getElementById("qtyInput"),
    addItemBtn: document.getElementById("addItemBtn"),
    itemsTableBody: document.querySelector("#itemsTable tbody"),
    itemsJson: document.getElementById("itemsJson"),
    itemsCount: document.getElementById("itemsCount"),
    totalValue: document.getElementById("totalValue"),
    receiptTotal: document.getElementById("receiptTotal"),
    orderForm: document.getElementById("orderForm"),
    submitBtn: document.getElementById("orderSubmitBtn"),
    customerName: document.getElementById("customerName"),
    customerPhone: document.getElementById("customerPhone"),
    deliveryAddress: document.getElementById("deliveryAddress"),
    paymentMethod: document.getElementById("paymentMethod"),
    deliveryMethod: document.getElementById("deliveryMethod"),
    postService: document.getElementById("postService"),
    customerId: document.getElementById("customerId")
};

const state = {
    orderItems: [],
    modalMode: "create",
    editingOrderId: null,
    hasOrderChanges: false,
    currentOrderStatus: "waiting"
};

function markChanged() {
    state.hasOrderChanges = true;
}

function getOrderTotal() {
    return state.orderItems.reduce((sum, item) => sum + item.qty * item.price, 0);
}

function isValidQty(item, qty) {
    if (!item || qty <= 0) return false;
    if (item.unit === "pcs" && !Number.isInteger(qty)) return false;
    return true;
}

function syncOrderStatus() {
    state.currentOrderStatus = state.orderItems.some(item => item.locked)
        ? "packing"
        : "waiting";
}

function updateSummary() {
    const total = getOrderTotal();

    if (els.itemsCount) els.itemsCount.textContent = state.orderItems.length;
    if (els.totalValue) els.totalValue.textContent = total.toFixed(2);
    if (els.receiptTotal) els.receiptTotal.textContent = total.toFixed(2);
    if (els.itemsJson) els.itemsJson.value = JSON.stringify(state.orderItems);
}

function renderItemsTable() {
    if (!els.itemsTableBody) return;

    els.itemsTableBody.innerHTML = "";

    state.orderItems.forEach((item, index) => {
        const lineTotal = item.qty * item.price;
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.price.toFixed(2)}</td>
            <td>
                <input
                    type="number"
                    class="table-qty-input"
                    data-index="${index}"
                    value="${item.qty}"
                    min="${item.unit === 'pcs' ? '1' : '0.001'}"
                    step="${item.unit === 'pcs' ? '1' : '0.001'}"
                    ${item.locked ? "disabled" : ""}
                />
            </td>
            <td>${lineTotal.toFixed(2)}</td>
            <td class="table-actions">
                ${state.modalMode === "edit" ? `
                    <button type="button" class="btn btn-warning btn-sm lock-item-btn" data-index="${index}">
                        <i class="bi ${item.locked ? "bi-lock-fill" : "bi-unlock"}"></i>
                        ${item.locked ? "lock" : "unlock"}
                    </button>
                ` : ""}
                <button
                    type="button"
                    class="btn btn-secondary btn-sm edit-create-item-btn"
                    data-index="${index}"
                    ${item.locked ? "disabled" : ""}
                >
                    ✎
                </button>
                <button
                    type="button"
                    class="btn btn-danger btn-sm remove-create-item-btn"
                    data-index="${index}"
                    ${item.locked ? "disabled" : ""}
                >
                    ×
                </button>
            </td>
        `;

        els.itemsTableBody.appendChild(row);
    });
}

function updateSaveButtonState() {
    if (!els.submitBtn) return;

    const hasItems = state.orderItems.length > 0;

    const hasName = !!els.customerName?.value.trim();
    const hasPhone = !!els.customerPhone?.value.trim();
    const hasPayment = !!els.paymentMethod?.value;
    const hasDelivery = !!els.deliveryMethod?.value;

    const addressRequired = els.deliveryMethod?.value && els.deliveryMethod.value !== "pickup";
    const postServiceRequired = els.deliveryMethod?.value === "post";

    const hasAddress = !addressRequired || !!els.deliveryAddress?.value.trim();
    const hasPostService = !postServiceRequired || !!els.postService?.value;

    const formValid = hasName && hasPhone && hasPayment && hasDelivery && hasAddress && hasPostService;

    if (!formValid || !hasItems) {
        els.submitBtn.disabled = true;
        return;
    }

    if (state.modalMode === "edit" && state.currentOrderStatus === "packing") {
        els.submitBtn.disabled = !state.orderItems.every(item => item.locked);
        return;
    }

    els.submitBtn.disabled = false;
}

function refreshUI() {
    renderItemsTable();
    updateSummary();
    updateSaveButtonState();
}

function addItem() {
    if (!els.productSelect || !els.qtyInput) return;

    const selected = els.productSelect.options[els.productSelect.selectedIndex];
    const id = selected.value;
    const name = selected.dataset.name;
    const price = parseFloat((selected.dataset.price || "0").replace(",", "."));
    const unit = selected.dataset.unit || "pcs";
    const qty = parseFloat(els.qtyInput.value || "1");

    if (!id) {
        alert("Оберіть товар");
        return;
    }

    if (!isValidQty({ unit }, qty)) {
        alert(unit === "pcs"
            ? "Для товару в штуках кількість має бути цілим числом"
            : "Кількість має бути більшою за 0");
        return;
    }

    const existing = state.orderItems.find(item => item.id === id);

    if (existing) {
        existing.qty += qty;
    } else {
        state.orderItems.push({
            id,
            name,
            price,
            qty,
            unit,
            step: unit === "pcs" ? 1 : 0.001,
            locked: false
        });
    }

    markChanged();
    refreshUI();

    els.productSelect.value = "";
    if (els.priceInput) els.priceInput.value = "";
    els.qtyInput.value = "1";
    els.qtyInput.step = "1";
}

function updateItemQty(index, qty) {
    const item = state.orderItems[index];
    if (!item || item.locked || !isValidQty(item, qty)) return false;

    item.qty = qty;
    markChanged();
    refreshUI();
    return true;
}

function removeItem(index) {
    if (state.orderItems[index]?.locked) return;

    state.orderItems.splice(index, 1);
    markChanged();
    syncOrderStatus();
    refreshUI();
}

function toggleItemLock(index) {
    const item = state.orderItems[index];
    if (!item) return;

    item.locked = !item.locked;
    markChanged();
    syncOrderStatus();
    refreshUI();
}