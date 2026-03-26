window.OrderModal = window.OrderModal || {};

window.OrderModal.filterOrder = function () {
    const statusButtons = document.querySelectorAll('.status-btn');
    const orderCards = document.querySelectorAll('.order-card');
    const fabBtn = document.getElementById('fabBtn');
    const infoBox = document.getElementById('ordersInfoBox');

    if (!statusButtons.length || !orderCards.length) return;

    function showOrdersInfo(message) {
        if (!infoBox) return;
        infoBox.textContent = message;
        infoBox.classList.remove('hidden');
    }

    function hideOrdersInfo() {
        if (!infoBox) return;
        infoBox.textContent = '';
        infoBox.classList.add('hidden');
    }

    function updateAddButtonVisibility(status) {
        if (!fabBtn) return;

        if (status === 'all' || status === 'waiting' ) {
            fabBtn.style.display = '';
        } else {
            fabBtn.style.display = 'none';
        }
    }

    function applyFilter(selectedStatus) {
        let visibleCount = 0;

        orderCards.forEach(function (card) {
            const cardStatus = card.dataset.status;

            if (selectedStatus === 'all' || cardStatus === selectedStatus) {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (visibleCount === 0) {
            showOrdersInfo('Жодного замовленя зі статусом ' + selectedStatus + ' не знайдено.');
        } else {
            hideOrdersInfo();
        }

        updateAddButtonVisibility(selectedStatus);
    }

    statusButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const selectedStatus = button.dataset.status;

            statusButtons.forEach(function (btn) {
                btn.classList.remove('active');
            });

            button.classList.add('active');
            applyFilter(selectedStatus);
        });
    });

    const activeButton = document.querySelector('.status-btn.active');
    const initialStatus = activeButton ? activeButton.dataset.status : 'all';
    applyFilter(initialStatus);
};