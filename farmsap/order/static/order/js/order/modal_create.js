window.OrderModal = window.OrderModal || {};

window.OrderModal.initModal = function () {
    const form = document.getElementById('orderForm');
    if (!form) return;

    const modal = document.getElementById('createModalOverlay');
    const fabBtn = document.getElementById('fabBtn');
    const closeCreateBtn = document.getElementById('closeCreateModal');

    function openCreateModal() {
        if (window.OrderModal.resetCreateModal) {
            window.OrderModal.resetCreateModal();
        }

        if (modal) {
            modal.classList.add('show');
        }
    }
    

    function closeCreateModal() {
        if (window.OrderModal.resetCreateModal) {
            window.OrderModal.resetCreateModal();
        }

        if (modal) {
            modal.classList.remove('show');
        }
    }

    if (fabBtn) fabBtn.addEventListener('click', openCreateModal);
    if (closeCreateBtn) closeCreateBtn.addEventListener('click', closeCreateModal);

    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                closeCreateModal();
            }
        });
    }

    window.OrderModal.openCreateModal = openCreateModal;
    window.OrderModal.closeCreateModal = closeCreateModal;
};