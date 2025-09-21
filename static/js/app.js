// Configuration
const SHEET_ID = '1lNomVmepAIZ_gwvYiTDir4i79C-iYgza6s9U69SxrWE';  // Replace this with your actual Sheet ID
const SHEET_NAME = 'Products';  // The name of your sheet tab
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

// Cache management
let productsCache = {
    data: null,
    timestamp: null
};

// DOM Elements
const productGrid = document.getElementById('product-grid');
const categoryLinks = document.getElementById('category-links');
const productTemplate = document.getElementById('product-template');

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

// Fetch products from Google Sheets
async function fetchProducts() {
    // Check cache
    if (productsCache.data && productsCache.timestamp && (Date.now() - productsCache.timestamp < CACHE_DURATION)) {
        return productsCache.data;
    }

    try {
        console.log('Fetching from sheet:', SHEET_ID);
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;
        console.log('Request URL:', url);

        const response = await fetch(url);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        console.log('Raw response:', text);
        
        // Extract the JSON part from Google's response
        const jsonText = text.match(/google\.visualization\.Query\.setResponse\((.*)\);/);
        if (!jsonText) {
            throw new Error('Failed to parse Google Sheets response');
        }
        
        const data = JSON.parse(jsonText[1]);
        console.log('Parsed data:', data);
        
        // Transform the response into a more usable format
        const products = data.table.rows.map(row => {
            const cells = row.c || [];
            const product = {
                id: cells[0]?.v || '',
                name: cells[1]?.v || 'Unnamed Product',
                category: cells[2]?.v || 'Uncategorized',
                subcategory: cells[3]?.v || '',
                price: typeof cells[4]?.v === 'number' ? cells[4].v : 0,
                description: cells[5]?.v || '',
                image_url: cells[6]?.v || '',
                specifications: cells[7]?.v || '',
                stock_status: cells[8]?.v || 'In Stock'
            };
            
            // Ensure category is one of our main categories
            if (!['Balloons', 'Paper Plates'].includes(product.category)) {
                product.category = 'Other';
            }
            
            // Log the processed product
            console.log('Processed product:', {
                name: product.name,
                category: product.category,
                price: product.price,
                status: product.stock_status
            });
            
            return product;
        });

        // Update cache
        productsCache.data = products;
        productsCache.timestamp = Date.now();

        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

// Render a single product
function renderProduct(product) {
    const template = productTemplate.content.cloneNode(true);
    
    // Generate appropriate placeholder image based on category
    const placeholderImage = product.category === 'Balloons'
        ? 'https://placehold.co/400x300?text=🎈' + encodeURIComponent(product.name)
        : 'https://placehold.co/400x300?text=🍽️' + encodeURIComponent(product.name);
    
    const imageUrl = product.image_url?.startsWith('http') 
        ? product.image_url 
        : placeholderImage;
    template.querySelector('.product-image').src = imageUrl;
    template.querySelector('.product-image').alt = product.name;
    template.querySelector('.product-name').textContent = product.name;
    template.querySelector('.product-category').textContent = `${product.category} › ${product.subcategory}`;
    template.querySelector('.product-description').textContent = product.description;
    template.querySelector('.product-price').textContent = formatPrice(product.price);
    template.querySelector('.product-status').textContent = product.stock_status;
    
    // Handle specifications
    const specsContainer = template.querySelector('.product-specs');
    if (product.specifications) {
        const specs = product.specifications.split('|');
        specs.forEach(spec => {
            const p = document.createElement('p');
            p.className = 'spec-item';
            p.textContent = spec.trim();
            specsContainer.appendChild(p);
        });
    }

    return template;
}

// Render all products
function renderProducts(products, category = 'all') {
    productGrid.innerHTML = '';
    
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);

    filteredProducts.forEach(product => {
        productGrid.appendChild(renderProduct(product));
    });
}

// Generate category navigation
function setupCategoryNavigation(products) {
    // Define our main categories
    const mainCategories = ['All Products', 'Balloons', 'Paper Plates'];
    categoryLinks.innerHTML = '';
    
    // Add our main categories
    mainCategories.forEach(category => {
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = category;
        link.className = 'category-filter';
        link.dataset.category = category === 'All Products' ? 'all' : category;
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const filterCategory = category === 'All Products' ? 'all' : category;
            renderProducts(products, filterCategory);
            
            // Update active state
            document.querySelectorAll('.category-filter').forEach(el => {
                el.classList.remove('active');
            });
            e.target.classList.add('active');
        });
        
        categoryLinks.appendChild(link);
    });
}

// Initialize the application
async function init() {
    try {
        const products = await fetchProducts();
        renderProducts(products);
        setupCategoryNavigation(products);
        
        // Set up auto-refresh
        setInterval(async () => {
            const updatedProducts = await fetchProducts();
            renderProducts(updatedProducts);
        }, CACHE_DURATION);
        
    } catch (error) {
        console.error('Failed to initialize:', error);
    }
}

// Start the application
init();