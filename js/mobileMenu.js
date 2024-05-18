function showSelectedColumn(column) {
    // Ocultar todas las secciones
    document.getElementById('firstColumn').style.display = 'none';
    document.getElementById('secondColumn').style.display = 'none';
    document.getElementById('thirdColumn').style.display = 'none';

    // Mostrar la sección seleccionada
    if (column === 'first') {
        document.getElementById('firstColumn').style.display = 'block';
        document.getElementById('reproducer').style.display = 'flex';
        document.getElementById('reproducer').style.width = '70px';
        document.getElementById('reproducer').style.gap = '0em';
    } else if (column === 'second') {
        document.getElementById('secondColumn').style.display = 'flex';
        document.getElementById('reproducer').style.display = 'none';
    } else if (column === 'third') {
        document.getElementById('thirdColumn').style.display = 'flex';
        document.getElementById('reproducer').style.display = 'flex';
    }
}