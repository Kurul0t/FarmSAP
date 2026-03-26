document.addEventListener('DOMContentLoaded', function () {
    if (window.OrderModal.initDelivery) {
        window.OrderModal.initDelivery();
    }

    if (window.OrderModal.initValidation) {
        window.OrderModal.initValidation();
    }

    if (window.OrderModal.initModal) {
        window.OrderModal.initModal();
    }
    if (window.OrderModal.filterOrder) {
        window.OrderModal.filterOrder();
    }
    if (window.OrderModal.setView) {
        window.OrderModal.setView();
    }
     if (window.OrderModal.addItems) {
        window.OrderModal.addItems();
    }
});