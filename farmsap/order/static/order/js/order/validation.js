window.OrderModal = window.OrderModal || {};

window.OrderModal.initValidation = function () {
    const form = document.getElementById('orderForm');
    if (!form) return;

    const name = document.getElementById('customerName');
    const phone = document.getElementById('customerPhone');
    const address = document.getElementById('deliveryAddress');
    const payment = document.getElementById('paymentMethod');
    const delivery = document.getElementById('deliveryMethod');
    const postService = document.getElementById('postService');
    const submitBtn = document.getElementById('orderSubmitBtn');

    function markRequired(el) {
        if (!el) return;
        el.classList.add('required-empty');

        if (el.tagName.toLowerCase() === 'input') {
            el.setAttribute('placeholder', "обов'язкове");
        }
    }

    function clearMark(el) {
        if (window.OrderModal.clearMark) {
            window.OrderModal.clearMark(el);
        }
    }

    function hasItems() {
        return Array.isArray(window.orderItems) && window.orderItems.length > 0;
    }

    function isFormValid() {
        if (name && !name.value.trim()) return false;
        if (phone && !phone.value.trim()) return false;
        if (payment && !payment.value) return false;
        if (delivery && !delivery.value) return false;

        if (
            window.OrderModal.isPostServiceRequired &&
            window.OrderModal.isPostServiceRequired() &&
            postService &&
            !postService.value
        ) {
            return false;
        }

        if (
            window.OrderModal.isAddressRequired &&
            window.OrderModal.isAddressRequired() &&
            address &&
            !address.value.trim()
        ) {
            return false;
        }

        return true;
    }

    function validateForm() {
        let ok = true;

        if (name && !name.value.trim()) {
            markRequired(name);
            ok = false;
        }

        if (phone && !phone.value.trim()) {
            markRequired(phone);
            ok = false;
        }

        if (payment && !payment.value) {
            markRequired(payment);
            ok = false;
        }

        if (delivery && !delivery.value) {
            markRequired(delivery);
            ok = false;
        }

        if (
            window.OrderModal.isPostServiceRequired &&
            window.OrderModal.isPostServiceRequired() &&
            postService &&
            !postService.value
        ) {
            markRequired(postService);
            ok = false;
        }

        if (
            window.OrderModal.isAddressRequired &&
            window.OrderModal.isAddressRequired() &&
            address &&
            !address.value.trim()
        ) {
            markRequired(address);
            ok = false;
        }

        return ok;
    }

    function getFirstInvalidField() {
        if (name && !name.value.trim()) return name;
        if (phone && !phone.value.trim()) return phone;
        if (payment && !payment.value) return payment;
        if (delivery && !delivery.value) return delivery;

        if (
            window.OrderModal.isPostServiceRequired &&
            window.OrderModal.isPostServiceRequired() &&
            postService &&
            !postService.value
        ) return postService;

        if (
            window.OrderModal.isAddressRequired &&
            window.OrderModal.isAddressRequired() &&
            address &&
            !address.value.trim()
        ) return address;

        return null;
    }

    function updateSubmitButtonState() {
        if (!submitBtn) return;

        const enabled = isFormValid() && hasItems();
        submitBtn.disabled = !enabled;
    }

    function resetCreateModal() {
        form.reset();

        clearMark(name);
        clearMark(phone);
        clearMark(address);
        clearMark(payment);
        clearMark(delivery);
        clearMark(postService);

        if (window.OrderModal.updateDeliveryFields) {
            window.OrderModal.updateDeliveryFields();
        }

        updateSubmitButtonState();
    }

    form.addEventListener('input', function (e) {
        const t = e.target;

        if (t && 'value' in t && String(t.value).trim()) {
            clearMark(t);
        }

        updateSubmitButtonState();
    });

    form.addEventListener('change', function (e) {
        const t = e.target;

        if (t && 'value' in t && String(t.value).trim()) {
            clearMark(t);
        }
        

        updateSubmitButtonState();
    });

    form.addEventListener('submit', function (e) {
        const formOk = validateForm();
        const itemsOk = hasItems();

        if (!itemsOk) {
            alert('Додайте хоча б один товар');
        }

        if (!formOk || !itemsOk) {
            e.preventDefault();

            const first = getFirstInvalidField();
            if (first) {
                first.focus();
            }
        }
    });

    window.OrderModal.resetCreateModal = resetCreateModal;
    window.OrderModal.updateSubmitButtonState = updateSubmitButtonState;
    window.OrderModal.isFormValid = isFormValid;

    updateSubmitButtonState();
};