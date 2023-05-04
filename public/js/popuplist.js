
var selectedElement = null;

function showcompendiumSyle() {
    document.getElementById('compendiumSyleContainer').style.visibility = 'visible';
}

function hidecompendiumSyle() {
    document.getElementById('compendiumSyleContainer').style.visibility = 'hidden';
}

function selectItem(element) {
    if (selectedElement != null) {
        selectedElement.classList.remove('selected');
    }
    selectedElement = element;
    selectedElement.classList.add('selected');
}


