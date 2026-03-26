document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('orderForm');
    if (!form) return;

    const modal = document.getElementById('createModalOverlay');
    const fabBtn = document.getElementById('fabBtn');
    const closeCreateBtn = document.getElementById('closeCreateModal');

    const name = document.getElementById('customerName');
    const phone = document.getElementById('customerPhone');
    const address = document.getElementById('deliveryAddress');
    const payment = document.getElementById('paymentMethod');
    const delivery = document.getElementById('deliveryMethod');
    const postService = document.getElementById('postService');

    const deliveryAddressWrap = document.getElementById('deliveryAddressWrap');
    const postServiceWrap = document.getElementById('postServiceWrap');

    function markRequired(el) {
        if (!el) return;
        el.classList.add('required-empty');

        if (el.tagName.toLowerCase() === 'input') {
            el.setAttribute('placeholder', "обов'язкове");
        }
    }

    function clearMark(el) {
        if (!el) return;
        el.classList.remove('required-empty');

        if (
            el.tagName.toLowerCase() === 'input' &&
            el.getAttribute('placeholder') === "обов'язкове"
        ) {
            el.removeAttribute('placeholder');
        }
    }

    function isAddressRequired() {
        return delivery && delivery.value && delivery.value !== 'pickup';
    }

    function isPostServiceRequired() {
        return delivery && delivery.value === 'post';
    }

    function updateDeliveryFields() {
        if (deliveryAddressWrap) {
            if (isAddressRequired()) {
                deliveryAddressWrap.style.display = '';
            } else {
                deliveryAddressWrap.style.display = 'none';
                if (address) {
                    address.value = '';
                    clearMark(address);
                }
            }
        }

        if (postServiceWrap) {
            if (isPostServiceRequired()) {
                postServiceWrap.style.display = '';
            } else {
                postServiceWrap.style.display = 'none';
                if (postService) {
                    postService.value = '';
                    clearMark(postService);
                }
            }
        }
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

        if (isPostServiceRequired() && postService && !postService.value) {
            markRequired(postService);
            ok = false;
        }

        if (isAddressRequired() && address && !address.value.trim()) {
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
        if (isPostServiceRequired() && postService && !postService.value) return postService;
        if (isAddressRequired() && address && !address.value.trim()) return address;
        return null;
    }
    function resetCreateModal() {
        form.reset();

        clearMark(name);
        clearMark(phone);
        clearMark(address);
        clearMark(payment);
        clearMark(delivery);
        clearMark(postService);

        updateDeliveryFields();
    }

    function openCreateModal() {
        resetCreateModal();
        if (modal) {
            modal.classList.add('show');
        }
    }

    function closeCreateModal() {
        if (modal) {
            modal.classList.remove('show');
        }
    }

    form.addEventListener('input', function (e) {
        const t = e.target;
        if (t && 'value' in t && String(t.value).trim()) {
            clearMark(t);
        }
    });

    form.addEventListener('change', function (e) {
        const t = e.target;

        if (t && 'value' in t && String(t.value).trim()) {
            clearMark(t);
        }

        if (t === delivery) {
            updateDeliveryFields();
        }
    });

    form.addEventListener('submit', function (e) {
        if (!validateForm()) {
            e.preventDefault();
            const first = getFirstInvalidField();
            if (first) first.focus();
        }
    });

    if (fabBtn) fabBtn.addEventListener('click', openCreateModal);
    if (closeCreateBtn) closeCreateBtn.addEventListener('click', closeCreateModal);

    updateDeliveryFields();
});