document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const searchForm = document.getElementById('search-form');
    const searchBtn = document.getElementById('search-btn');
    const clearBtn = document.getElementById('clear-btn');
    const tickerInput = document.getElementById('ticker');
    const resultContainer = document.getElementById('result-container');
    const errorMessage = document.getElementById('error-message');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Add event listeners
    searchForm.addEventListener('submit', handleSearch);
    clearBtn.addEventListener('click', handleClear);
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    
    // Function to handle search
    function handleSearch(e) {
        e.preventDefault();
        
        const ticker = tickerInput.value.trim();
        
        if (!ticker) {
            alert('Please fill out this field');
            return;
        }
        
        // Show loading or disable button while fetching
        searchBtn.disabled = true;
        searchBtn.textContent = 'Loading...';
        
        // Clear previous results and errors
        errorMessage.style.display = 'none';
        resultContainer.style.display = 'none';
        
        // Make request to backend
        fetchStockData(ticker);
    }
    
    // Function to fetch stock data from backend
    function fetchStockData(ticker) {
        const apiUrl = `/get_stock_data?ticker=${encodeURIComponent(ticker)}`;
        
        // Use XMLHttpRequest
        const xhr = new XMLHttpRequest();
        xhr.open('GET', apiUrl, true);
        
        xhr.onload = function() {
            // Re-enable search button
            searchBtn.disabled = false;
            searchBtn.textContent = 'Search';
            
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                displayResults(data);
            } else {
                let errorMsg = 'Error: No record has been found, please enter a valid symbol.';
                try {
                    const response = JSON.parse(xhr.responseText);
                    if (response.error) {
                        errorMsg = response.error;
                    }
                } catch (e) {
                    // Use default error message
                }
                displayError(errorMsg);
            }
        };
        
        xhr.onerror = function() {
            // Re-enable search button
            searchBtn.disabled = false;
            searchBtn.textContent = 'Search';
            
            displayError('Network error. Please try again later.');
        };
        
        xhr.send();
    }
    
    // Function to display results
    function displayResults(data) {
        // Company Outlook data
        document.getElementById('company-name').textContent = data.meta.name;
        document.getElementById('company-ticker').textContent = data.meta.ticker;
        document.getElementById('exchange-code').textContent = data.meta.exchangeCode;
        document.getElementById('start-date').textContent = data.meta.startDate;
        
        // Truncate description to 5 lines (approximate using character count)
        const description = data.meta.description;
        const truncatedDesc = truncateText(description, 400); // Approximate 5 lines
        document.getElementById('description').textContent = truncatedDesc;
        
        // Stock Summary data
        document.getElementById('stock-ticker').textContent = data.price.ticker;
        
        // Format the timestamp to just show the date
        const timestamp = data.price.timestamp;
        const date = timestamp ? timestamp.split('T')[0] : 'N/A';
        document.getElementById('trading-day').textContent = date;
        
        document.getElementById('prev-close').textContent = data.price.prevClose?.toFixed(2) || 'N/A';
        document.getElementById('opening-price').textContent = data.price.open?.toFixed(2) || 'N/A';
        document.getElementById('high-price').textContent = data.price.high?.toFixed(2) || 'N/A';
        document.getElementById('low-price').textContent = data.price.low?.toFixed(2) || 'N/A';
        document.getElementById('last-price').textContent = data.price.last?.toFixed(2) || 'N/A';
        
        // Calculate change and change percent
        const last = data.price.last;
        const prevClose = data.price.prevClose;
        
        if (last !== undefined && prevClose !== undefined) {
            const change = last - prevClose;
            const changePercent = (change / prevClose) * 100;
            
            // Determine arrow direction
            const arrowHtml = change >= 0 
                ? '<span class="up-arrow">▲</span>' 
                : '<span class="down-arrow">▼</span>';
            
            document.getElementById('change').innerHTML = `${change.toFixed(2)} ${arrowHtml}`;
            document.getElementById('change-percent').innerHTML = `${changePercent.toFixed(2)}% ${arrowHtml}`;
        } else {
            document.getElementById('change').textContent = 'N/A';
            document.getElementById('change-percent').textContent = 'N/A';
        }
        
        document.getElementById('volume').textContent = data.price.volume || 'N/A';
        
        // Show result container and set default tab
        resultContainer.style.display = 'block';
        switchTab('company-outlook');
    }
    
    // Function to display error message
    function displayError(msg) {
        errorMessage.textContent = msg;
        errorMessage.style.display = 'block';
        resultContainer.style.display = 'none';
    }
    
    // Function to handle clear button
    function handleClear() {
        tickerInput.value = '';
        resultContainer.style.display = 'none';
        errorMessage.style.display = 'none';
    }
    
    // Function to switch tabs
    function switchTab(tabId) {
        // Update active tab button
        tabBtns.forEach(btn => {
            if (btn.dataset.tab === tabId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Update active tab content
        tabContents.forEach(content => {
            if (content.id === tabId) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
    }
    
    // Helper function to truncate text with ellipsis
    function truncateText(text, maxLength) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }
});