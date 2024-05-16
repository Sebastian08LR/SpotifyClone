function showSelectedColumn(column) {
    // Ocultar todas las secciones
    document.getElementById('firstColumn').style.display = 'none';
    document.getElementById('secondColumn').style.display = 'none';
    document.getElementById('thirdColumn').style.display = 'none';

    // Mostrar la sección seleccionada
    if (column === 'first') {
        document.getElementById('firstColumn').style.display = 'flex';
    } else if (column === 'second') {
        document.getElementById('secondColumn').style.display = 'flex';
    } else if (column === 'third') {
        document.getElementById('thirdColumn').style.display = 'flex';
    }
}