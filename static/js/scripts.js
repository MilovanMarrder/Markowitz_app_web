document.getElementById('form-activos').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    const activos = [];
    for (let i = 0; i < formData.getAll('activo-0').length; i++) {
        activos.push({
            "Periodo": i + 1,  // Asumimos un índice temporal simple para el ejemplo
            "Activo": parseFloat(formData.get(`retorno-${i}`))
        });
    }
fetch('/procesar_datos', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        activos: ['Activo1', 'Activo2'],
        retornos: [0.01, 0.02]
    })
})
.then(response => response.json())  // Asegúrate de que response.json() está bien
.then(data => {
    console.log(data);
    // Procesa los datos recibidos
})
.catch(error => {
    console.error('Error:', error);
});

}
function addRow() {
    const container = document.getElementById('activos-container');
    const rowCount = container.getElementsByClassName('activo-row').length;
    const newRow = document.createElement('div');
    newRow.className = 'activo-row';
    newRow.innerHTML = `
        <label for="activo-${rowCount}">Activo:</label>
        <input type="text" name="activo-${rowCount}" required>
        <label for="retorno-${rowCount}">Retornos:</label>
        <input type="text" name="retorno-${rowCount}" required>
    `;
    container.appendChild(newRow);
}

function plotGraph(data) {
    const trace = {
        x: data.risk,
        y: data.return,
        mode: 'markers',
        type: 'scatter',
        marker: { size: 8, color: data.sharpe_ratio, colorscale: 'Viridis', showscale: true }
    };
    const layout = {
        xaxis: { title: 'Riesgo' },
        yaxis: { title: 'Retorno' },
        title: 'Frontera Eficiente'
    };
    Plotly.newPlot('chart', [trace], layout);
}
