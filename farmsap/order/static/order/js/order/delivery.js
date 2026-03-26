window.OrderModal = window.OrderModal || {};

window.OrderModal.initDelivery = function(){

    const form = document.getElementById('orderForm');
    if(!form) return;

    const delivery = document.getElementById('deliveryMethod');
    const address = document.getElementById('deliveryAddress');
    const postService = document.getElementById('postService');

    const deliveryAddressWrap = document.getElementById('deliveryAddressWrap');
    const postServiceWrap = document.getElementById('postServiceWrap');

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

    window.OrderModal.isAddressRequired = isAddressRequired;
    window.OrderModal.isPostServiceRequired = isPostServiceRequired;
    window.OrderModal.updateDeliveryFields = updateDeliveryFields;
    window.OrderModal.clearMark = clearMark;

    if (delivery) {
        delivery.addEventListener('change', updateDeliveryFields);
    }

    updateDeliveryFields();
};