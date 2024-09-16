let assets = []
let originalAssets = []  // Guardar una copia del CSV original para poder aplicar cambios de nuevo
let selectedAssets = []  // Activos seleccionados para análisis

// Agregar activo manualmente
$('#add-asset').click(function() {
    const name = $('#name').val()
    const returns = $('#returns').val().split(',').map(Number)
    
    if (name && returns.length > 0) {
        // Agregar el nuevo activo a la lista de activos
        assets.push({ name: name, returns: returns })
        selectedAssets.push(name)  // Seleccionar el nuevo activo por defecto

        // Actualizar la vista con el nuevo activo
        updateAssetSelection()  // Actualizar los botones de selección de activos
        updateAssetList()  // Actualizar la lista de activos

        // Limpiar los campos del formulario
        $('#name').val('')  
        $('#returns').val('')  
    } else {
        alert('Please enter both the asset name and returns.')
    }
})

// Cargar CSV
$('#csv-file').change(function(event) {
    const file = event.target.files[0]
    const delimiter = $('#delimiter-csv').is(':checked') ? ';' : ','  // Si el delimitador es ;
    const useHeader = $('#header-csv').is(':checked')  // Si se usan los nombres de los activos desde el encabezado
    const transpose = $('#transpose-csv').is(':checked')  // Si se deben transponer las filas y columnas

    if (file) {
        const reader = new FileReader()
        reader.onload = function(e) {
            const lines = e.target.result.split('\n')
            let newAssets = []
            let assetNamesFromHeader = []

            lines.forEach((line, index) => {
                const values = line.split(delimiter)
                if (index === 0 && useHeader) {
                    // Si usamos los nombres de los activos desde el encabezado
                    assetNamesFromHeader = values  // Almacenar los nombres de los activos desde la primera fila
                } else {
                    const [name, ...returns] = values
                    if (returns.length > 0) {
                        newAssets.push({ name: name, returns: returns.map(Number) })
                    }
                }
            })

            // Aplicar la transposición de datos si está seleccionado
            if (transpose) {
                let transposedAssets = []
                const numReturns = newAssets[0].returns.length
                for (let i = 0; i < numReturns; i++) {
                    let assetName = `Asset ${i + 1}`
                    if (useHeader && assetNamesFromHeader.length > 0) {
                        assetName = assetNamesFromHeader[i] || assetName  // Usar el nombre del encabezado
                    }
                    const transposedReturns = newAssets.map(asset => asset.returns[i])
                    transposedAssets.push({ name: assetName, returns: transposedReturns })
                }
                newAssets = transposedAssets
            }

            // Guardar los activos cargados desde el CSV y actualizar la lista
            assets = [...newAssets]
            selectedAssets = newAssets.map(a => a.name)  // Por defecto, seleccionar todos los activos

            updateAssetSelection()  // Actualizar los botones de selección de activos
            updateAssetList()  // Actualizar la lista de activos
        }
        reader.readAsText(file)
    }
})

// Función para actualizar los botones de selección de activos
function updateAssetSelection() {
    $('#select-assets').html('')  // Limpiar la selección anterior
    assets.forEach(asset => {
        const isSelected = selectedAssets.includes(asset.name)
        const buttonClass = isSelected ? 'btn-selected' : 'btn-deselected'
        $('#select-assets').append(`
            <button class="btn ${buttonClass}" data-asset="${asset.name}">
                ${asset.name}
            </button>
        `)
    })

    // Evento click para seleccionar/deseleccionar activos
    $('#select-assets button').click(function() {
        const assetName = $(this).data('asset')
        if (selectedAssets.includes(assetName)) {
            selectedAssets = selectedAssets.filter(a => a !== assetName)  // Deseleccionar
        } else {
            selectedAssets.push(assetName)  // Seleccionar
        }
        updateAssetSelection()  // Actualizar visualmente los botones
        updateAssetList()  // Actualizar visualmente la lista de activos
    })
}

// Función para actualizar la lista de activos
function updateAssetList() {
    $('#asset-list').html('')  // Limpiar la lista anterior
    assets.forEach(asset => {
        const isSelected = selectedAssets.includes(asset.name)
        const assetClass = isSelected ? 'selected-asset' : 'deselected-asset'
        $('#asset-list').append(`<div class="${assetClass}"><strong>${asset.name}:</strong> ${asset.returns.join(', ')}</div>`)
    })
}

// Generar gráfico
$('#generate-graph').click(function() {
    if (selectedAssets.length === 0) {
        alert('Please select at least one asset for the analysis.')
        return
    }

    // Filtrar los activos seleccionados
    const filteredAssets = assets.filter(asset => selectedAssets.includes(asset.name))
    
    $.ajax({
        url: '/analizar',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ activos: filteredAssets }),
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
        }
    })
})
