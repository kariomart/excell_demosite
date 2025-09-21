# Dynamic Product Catalog with Google Sheets

This is a dynamic product catalog that pulls data directly from Google Sheets. Update your product information in Google Sheets, and the website updates automatically!

## Setup Instructions

### 1. Create Your Google Sheet

1. Create a new Google Sheet
2. Name the first sheet "Products"
3. Add these column headers in row 1:
   - id
   - name
   - category
   - subcategory
   - price
   - description
   - image_url
   - specifications
   - stock_status

### 2. Configure Google Sheet for Public Access

1. Click "Share" in the top right
2. Click "Change to anyone with the link"
3. Set to "Viewer"
4. Copy the Sheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[THIS-IS-YOUR-SHEET-ID]/edit#gid=0
   ```

### 3. Update Website Configuration

1. Open `static/js/app.js`
2. Replace `YOUR_GOOGLE_SHEET_ID` with your actual Sheet ID:
   ```javascript
   const SHEET_ID = 'your-sheet-id-here';
   ```

### 4. Host the Website

You can host this website on any static hosting service:
- GitHub Pages
- Netlify
- Vercel
- Any web server

## Product Data Format

Format your Google Sheet data as follows:

- **id**: Unique identifier (number)
- **name**: Product name (text)
- **category**: Main category (text)
- **subcategory**: Sub-category (text)
- **price**: Price in USD (number)
- **description**: Product description (text)
- **image_url**: URL to product image (text)
- **specifications**: Product specifications (text, use pipe | as separator)
- **stock_status**: Availability (text: "In Stock", "Out of Stock", etc.)

Example row:
```
1, "Cool Product", "Electronics", "Gadgets", 99.99, "Amazing gadget", "images/product1.jpg", "Color: Blue|Size: Medium", "In Stock"
```

## Features

- 🔄 Real-time updates from Google Sheets
- 📱 Responsive design
- 🏷️ Category filtering
- 🚀 Fast loading with caching
- 🖼️ Image optimization support
- 📊 Easy product management

## Customization

### Styling
Edit `static/css/style.css` to customize the look and feel.

### Cache Duration
Adjust `CACHE_DURATION` in `static/js/app.js` to control how often the site checks for updates:
```javascript
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
```

### Adding Features
The JavaScript is modular and easy to extend. Common additions might include:
- Search functionality
- Sorting options
- Advanced filtering
- Product details modal

## Troubleshooting

1. **Products not loading?**
   - Check if your Sheet ID is correct
   - Verify the sheet is publicly accessible
   - Check browser console for errors

2. **Images not displaying?**
   - Ensure image URLs are publicly accessible
   - Use absolute URLs for images
   - Check for typos in URLs

3. **Categories not showing?**
   - Make sure category names are consistent
   - Check for extra spaces in category names

## Best Practices

1. **Images**
   - Use consistent image sizes
   - Optimize images before uploading
   - Use a CDN for better performance

2. **Data Management**
   - Keep categories consistent
   - Use clear, descriptive names
   - Regular backup your sheet
   - Consider using data validation in Google Sheets

3. **Updates**
   - Make updates during low-traffic periods
   - Test changes in a separate sheet first
   - Keep a backup of working data