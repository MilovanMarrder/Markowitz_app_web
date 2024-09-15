import numpy as np

def portfolio_performance(weights, returns, cov_matrix):
    portfolio_return = np.sum(returns * weights)
    portfolio_risk = np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))
    return portfolio_return, portfolio_risk

def calculate_efficient_frontier(df):
    returns = df.mean()
    cov_matrix = df.cov()
    n_assets = len(df.columns)
    n_portfolios = 10000
    results = np.zeros((3 + n_assets, n_portfolios))

    max_accepted_risk = 0.20
    for i in range(n_portfolios):
        weights = np.random.random(n_assets)
        weights /= np.sum(weights)
        portfolio_return, portfolio_risk = portfolio_performance(weights, returns, cov_matrix)
        results[0,i] = portfolio_return
        results[1,i] = portfolio_risk
        results[2,i] = portfolio_return / portfolio_risk
        results[3:,i] = weights

    filtered_results = results[:, results[1,:] <= max_accepted_risk]
    return {
        "return": results[0,:].tolist(),
        "risk": results[1,:].tolist(),
        "sharpe_ratio": results[2,:].tolist(),
        "weights": results[3:,:].tolist()
    }
