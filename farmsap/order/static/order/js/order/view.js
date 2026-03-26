window.OrderModal = window.OrderModal || {};

window.OrderModal.setView = function(){

    const listBtn = document.getElementById("listBtn");
    const gridBtn = document.getElementById("gridBtn");
    if (listBtn) listBtn.addEventListener("click", setListView);
    if (gridBtn) gridBtn.addEventListener("click", setGridView);
    const ordersContainer = document.getElementById("ordersContainer");

    function setListView() {
        if (!ordersContainer || !listBtn || !gridBtn) return;

        ordersContainer.classList.remove("grid-view");
        ordersContainer.classList.add("list-view");

        listBtn.classList.add("active");
        gridBtn.classList.remove("active");
        localStorage.setItem("ordersViewMode", "list");
        console.debug("orders: setListView called");
    }

    function setGridView() {
        if (!ordersContainer || !listBtn || !gridBtn) return;

        ordersContainer.classList.remove("list-view");
        ordersContainer.classList.add("grid-view");

        gridBtn.classList.add("active");
        listBtn.classList.remove("active");
        localStorage.setItem("ordersViewMode", "grid");
        console.debug("orders: setGridView called");
    }

}