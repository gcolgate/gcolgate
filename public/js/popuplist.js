
var selectedElement = null;

function showPopup() {
    document.getElementById('popupContainer').style.visibility = 'visible';
}

function hidePopup() {
    document.getElementById('popupContainer').style.visibility = 'hidden';
}

function selectItem(element) {
    if (selectedElement != null) {
        selectedElement.classList.remove('selected');
    }
    selectedElement = element;
    selectedElement.classList.add('selected');
}


