import numpy as np
import pandas as pd

def calcular_carteras(returns, total_inversion=100000):
    # Calculamos la matriz de covarianza
    cov_matrix = returns.cov()
    expected_returns = returns.mean()

    # Generamos carteras aleatorias
    n_assets = len(returns.columns)
    n_portfolios = 10000
    results = np.zeros((3 + n_assets, n_portfolios))

    for i in range(n_portfolios):
        weights = np.random.random(n_assets)
        weights /= np.sum(weights)
        portfolio_return, portfolio_risk = portfolio_performance(weights, expected_returns, cov_matrix)
        results[0, i] = portfolio_return
        results[1, i] = portfolio_risk
        results[2, i] = portfolio_return / portfolio_risk
        results[3:, i] = weights

    # Crear DataFrame con resultados
    df_results = pd.DataFrame({
        'Return': results[0],
        'Risk': results[1],
        'Sharpe': results[2],
    })

    for i, asset in enumerate(returns.columns):
        df_results[f'Weight_{asset}'] = results[3 + i]

    # Seleccionar la cartera de mayor Sharpe Ratio
    max_sharpe_idx = np.argmax(results[2])
    distribucion_activos = []
    for i, asset in enumerate(returns.columns):
        porcentaje = results[3 + i, max_sharpe_idx] * 100
        distribucion_activos.append({
            'Activo': asset,
            'Porcentaje': porcentaje
        })

    df_distribucion = pd.DataFrame(distribucion_activos)
    df_distribucion['Valor Inversión (Lempiras)'] = (df_distribucion['Porcentaje'] / 100) * total_inversion

    return df_results, df_distribucion

def portfolio_performance(weights, returns, cov_matrix):
    portfolio_return = np.sum(returns * weights)
    portfolio_risk = np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))
    return portfolio_return, portfolio_risk
