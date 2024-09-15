from flask import Flask, render_template, request, jsonify
import pandas as pd
import numpy as np
import plotly.graph_objects as go
from plotly.subplots import make_subplots
from utils import calcular_carteras

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analizar', methods=['POST'])
def analizar():
    # Recibir los datos del formulario
    data = request.get_json()
    activos = data['activos']

    # Extraer solo los rendimientos para el DataFrame
    activos_rendimientos = {}
    for activo in activos:
        activos_rendimientos[activo['nombre']] = activo['rendimientos']

    # Crear un DataFrame solo con los rendimientos
    returns = pd.DataFrame(activos_rendimientos)

    # Calcular carteras posibles usando el modelo de Markowitz
    results, df_distribucion = calcular_carteras(returns)

    # Crear el gráfico con Plotly (sin cambios en esta parte)
    fig = go.Figure()

    # Crear hover text (sin cambios en esta parte)
    hover_text = []
    for _, row in results.iterrows():
        text = f"Return: {row['Return']:.4f}<br>Risk: {row['Risk']:.4f}<br>Sharpe: {row['Sharpe']:.4f}<br>"
        text += "<br>".join([f"{col.replace('Weight_', '')}: {w:.2%}" for col, w in row.items() if col.startswith('Weight_')])
        hover_text.append(text)

    # Crear el gráfico de dispersión
    fig.add_trace(go.Scatter(
        x=results['Risk'],
        y=results['Return'],
        mode='markers',
        marker=dict(
            size=5,
            color=results['Sharpe'],
            colorscale='Viridis',
            colorbar=dict(title='Sharpe Ratio'),
            showscale=True
        ),
        text=hover_text,
        hoverinfo='text'
    ))

    fig.update_layout(
        title='Carteras Posibles',
        xaxis_title='Riesgo de la cartera',
        yaxis_title='Rendimiento de la cartera',
        width=800,
        height=600
    )

    # Convertir gráfico a JSON
    graphJSON = fig.to_json()

    return jsonify({'graph': graphJSON, 'distribucion': df_distribucion.to_dict(orient='records')})

if __name__ == '__main__':
    app.run(debug=True)
