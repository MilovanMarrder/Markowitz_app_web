from flask import Flask, render_template, request, jsonify
import pandas as pd
import numpy as np
import math

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analizar', methods=['POST'])
def analizar():
    data = request.get_json()
    activos = data['activos']

    # Convertir a DataFrame
    activos_rendimientos = {activo['name']: activo['returns'] for activo in activos}
    df = pd.DataFrame(activos_rendimientos)

    # Calcular retornos esperados y matriz de covarianza
    returns = df.mean().to_numpy()
    cov = df.cov().to_numpy()

    # Generar carteras aleatorias
    n_portfolios = 2000
    x = []
    y = []
    text = []

    for _ in range(n_portfolios):
        weights = np.random.random(len(activos))
        weights /= np.sum(weights)
        portfolio_return = np.dot(weights, returns)
        portfolio_risk = np.sqrt(np.dot(weights.T, np.dot(cov, weights)))

        x.append(portfolio_risk)
        y.append(portfolio_return)
        text.append(generate_tooltip_text(activos, weights, portfolio_return, portfolio_risk))

    return jsonify({'x': x, 'y': y, 'text': text})

def generate_tooltip_text(activos, weights, portfolio_return, portfolio_risk):
    text = f"Return: {portfolio_return:.4f}<br>Risk: {portfolio_risk:.4f}<br><br>Weights:<br>"
    for i, asset in enumerate(activos):
        text += f"{asset['name']}: {(weights[i] * 100):.2f}%<br>"
    return text

if __name__ == '__main__':
    app.run(debug=True)
