# Análisis de Portafolio de Markowitz

Este proyecto es una aplicación web que permite realizar análisis de portafolios utilizando el modelo de Markowitz. Los usuarios pueden cargar activos financieros y sus rendimientos históricos, generar carteras eficientes y ver la frontera eficiente de posibles portafolios en un gráfico interactivo. También permite calcular el rendimiento y riesgo de una cartera actual basándose en las proporciones ingresadas.

## Funcionalidades

### 1. **Cargar Activos**
- **Manualmente**: Puedes agregar activos manualmente ingresando el nombre del activo y los rendimientos históricos (separados por comas).
- **Desde un archivo CSV**: La aplicación permite cargar un archivo CSV con los activos y sus rendimientos. Ofrece opciones para personalizar la carga:
  - **Transposición**: Si los activos están en las columnas, puedes seleccionar la opción de transponer los datos.
  - **Delimitador**: Soporte para archivos con `;` como delimitador.
  - **Encabezado**: Opción para usar la primera fila del CSV como nombre de los activos.

### 2. **Selección de Activos**
- Una vez cargados los activos, puedes seleccionar o deseleccionar los activos que deseas incluir en el análisis. Los activos seleccionados se usan para generar el gráfico de la frontera eficiente.

### 3. **Generación Automática del Gráfico**
- Cada vez que seleccionas o deseleccionas activos, el gráfico de la frontera eficiente se genera automáticamente. Este gráfico muestra la relación entre el riesgo (desviación estándar) y el retorno esperado de varias carteras generadas aleatoriamente.

### 4. **Cálculo de Rendimiento y Riesgo de la Cartera Actual**
- Puedes ingresar manualmente las proporciones de tu cartera actual para los activos seleccionados.
- La aplicación calculará el rendimiento y riesgo de la cartera y resaltará en el gráfico el punto más cercano a esos valores.

### 5. **Interfaz Interactiva**
- El gráfico es interactivo y permite ver los detalles de las carteras generadas, incluyendo la composición y el ratio de Sharpe.

