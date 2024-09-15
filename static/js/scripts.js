let assets = []
let originalAssets = []  // Guardar una copia del CSV original para poder aplicar cambios de nuevo
let assetNamesFromHeader = []  // Almacenar los nombres de los activos desde el encabezado (si está marcado el checkbox)

// Agregar activo
$('#add-asset').click(function() {
    const name = $('#name').val()
    const returns = $('#returns').val().split(',').map(Number)
    if (name && returns.length > 0) {
        assets.push({ name: name, returns: returns })
        $('#asset-list').append(`<div><strong>${name}:</strong> ${returns.join(', ')}</div>`)
        $('#name').val('')  // Limpiar campo de nombre
        $('#returns').val('')  // Limpiar campo de retornos
    } else {
        alert('Please enter both the asset name and returns.')
    }
})

// Cargar CSV
$('#csv-file').change(function(event) {
    const file = event.target.files[0]
    const delimiter = $('#delimiter-csv').is(':checked') ? ';' : ','  // Delimitador del CSV
    const useHeader = $('#header-csv').is(':checked')  // Si se usa el encabezado como nombres de activos

    if (file) {
        const reader = new FileReader()
        reader.onload = function(e) {
            const lines = e.target.result.split('\n')
            assetNamesFromHeader = []  // Resetear en cada carga de CSV
            const newAssets = []

            lines.forEach((line, index) => {
                const values = line.split(delimiter)
                if (index === 0 && useHeader) {
                    // Si es la primera línea y se usa el encabezado
                    assetNamesFromHeader = values  // Almacenar los nombres de los activos desde el encabezado
                } else {
                    const [name, ...returns] = values
                    newAssets.push({ name: name, returns: returns.map(Number) })
                }
            })

            originalAssets = [...newAssets]  // Guardar copia del CSV original para futuras modificaciones
            applyAssetChanges()
        }
        reader.readAsText(file)
    }
})

// Función para aplicar transposición, nombres de encabezado, y actualizar la lista de activos
function applyAssetChanges() {
    let modifiedAssets = [...originalAssets]
    const transpose = $('#transpose-csv').is(':checked')  // Si se debe transponer el CSV
    const useHeader = $('#header-csv').is(':checked')  // Si se usa el encabezado como nombres de activos

    if (transpose) {
        const transposedAssets = []
        const numReturns = modifiedAssets[0].returns.length
        for (let i = 0; i < numReturns; i++) {
            let name = `Asset ${i + 1}`
            if (useHeader && assetNamesFromHeader.length > 0) {
                name = assetNamesFromHeader[i] || name  // Usar el nombre del encabezado si está disponible
            }
            const asset = { name: name, returns: [] }
            modifiedAssets.forEach(a => asset.returns.push(a.returns[i]))
            transposedAssets.push(asset)
        }
        assets = transposedAssets
    } else {
        assets = modifiedAssets
    }

    // Actualizar la lista de activos en el frontend
    $('#asset-list').html('')  // Limpiar la lista anterior
    assets.forEach(asset => {
        $('#asset-list').append(`<div><strong>${asset.name}:</strong> ${asset.returns.join(', ')}</div>`)
    })
}

// Listener para los checkboxes
$('#transpose-csv').change(applyAssetChanges)
$('#header-csv').change(applyAssetChanges)
$('#delimiter-csv').change(function() {
    const file = $('#csv-file')[0].files[0]
    if (file) {
        // Vuelve a leer el CSV con el nuevo delimitador
        $('#csv-file').trigger('change')
    }
})

// Generar gráfico
$('#generate-graph').click(function() {
    if (assets.length === 0) {
        alert('Please add at least one asset before generating the graph.')
        return
    }
    
    $.ajax({
        url: '/analizar',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ activos: assets }),
        success: function(data) {
            Plotly.newPlot('plotly-graph', [{
                x: data.x,
                y: data.y,
                mode: 'markers',
                marker: { size: 5, color: 'blue' },
                text: data.text,
                hoverinfo: 'text'
            }], {
                title: 'Efficient Frontier',
                xaxis: { title: 'Risk (Standard Deviation)' },
                yaxis: { title: 'Expected Return' },
                width: 800,
                height: 600
            })
        },
        error: function() {
            alert('Error generating the graph. Please try again.')
        }
    })
})
