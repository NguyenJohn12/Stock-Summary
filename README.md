# 📈 Stock Tracking 

This project implements a web application that allows users to search for stock information using the Tiingo Stock API. The application is built using Python Flask for the backend and HTML, CSS, and JavaScript for the frontend.

## 🚀 Project Structure

```
project/
├── app.py                   # Flask application
├── requirements.txt         # Python dependencies
├── static/
│   ├── css/
│   │   └── styles.css       # CSS styles
│   └── js/
│       └── script.js        # Frontend JavaScript
└── templates/
    └── index.html           # HTML template
```

## 🛠️ Features

1. **🔎 Search Form**:
   - Allows users to enter a stock ticker symbol
   - Validates input (requires a stock ticker)
   - Provides Search and Clear buttons

2. **👀 Company Outlook Tab**:
   - Displays company name, ticker symbol, exchange code, start date, and description
   - Truncates description to 5 lines with an ellipsis

3. **📊 Stock Summary Tab**:
   - Displays current stock information including previous closing price, opening price, high/low prices
   - Shows price change with up/down arrow indicators
   - Displays trading volume

4. **🐞 Error Handling**:
   - Shows an appropriate error message when an invalid ticker is entered


### 👨‍💻 Local Development

1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Set your Tiingo API key as an environment variable:
   ```
   export TIINGO_API_KEY="your_api_key_here"
   ```

3. Run the application:
   ```
   python app.py
   ```

4. Access the application at `http://localhost:5000`

## 🏙️ Implementation Details

- The backend is implemented using Python Flask
- API requests to Tiingo are made server-side using the `requests` library
- Frontend uses XMLHttpRequest to communicate with the Flask backend
- Tabs are implemented using JavaScript for switching between Company Outlook and Stock Summary views
- Error handling for both client and server-side errors