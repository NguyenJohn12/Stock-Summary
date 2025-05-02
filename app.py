from flask import Flask, request, jsonify, render_template
import requests
import json
import os
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)

# Get API key from environment variable or use a default value
# For deployment, you should set the environment variable
API_KEY = os.environ.get('TIINGO_API_KEY', '')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_stock_data', methods=['GET'])
def get_stock_data():
    ticker = request.args.get('ticker', '')
    
    # Validate input
    if not ticker:
        return jsonify({'error': 'No ticker symbol provided'}), 400
    
    # Endpoint URLs
    meta_url = f'https://api.tiingo.com/tiingo/daily/{ticker}?token={API_KEY}'
    price_url = f'https://api.tiingo.com/iex/{ticker}?token={API_KEY}'
    
    try:
        # Get company metadata
        meta_response = requests.get(meta_url)
        
        # Check if the request was successful
        if meta_response.status_code != 200:
            return jsonify({'error': 'No record has been found, please enter a valid symbol.'}), 404
        
        meta_data = meta_response.json()
        
        # Get price data
        price_response = requests.get(price_url)
        
        # Check if the request was successful
        if price_response.status_code != 200:
            return jsonify({'error': 'No price data available for this symbol.'}), 404
        
        price_data = price_response.json()
        
        # Combine the data
        result = {
            'meta': meta_data,
            'price': price_data[0] if price_data else {}
        }
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 3000)))
