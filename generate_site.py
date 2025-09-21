import csv
import os
import shutil
from collections import defaultdict
from jinja2 import Environment, FileSystemLoader

# Setup Jinja2 environment
env = Environment(loader=FileSystemLoader('src/templates'))

def read_products():
    """Read products from CSV file."""
    products = []
    with open('data/products.csv', 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Convert specifications string to dictionary
            specs = dict(item.split(': ') for item in row['specifications'].split('|'))
            row['specifications'] = specs
            products.append(row)
    return products

def get_categories(products):
    """Extract categories and their products."""
    categories = defaultdict(list)
    for product in products:
        categories[product['category']].append(product)
    return dict(categories)

def ensure_output_directory():
    """Create output directory structure."""
    os.makedirs('output', exist_ok=True)
    os.makedirs('output/static', exist_ok=True)
    os.makedirs('output/products', exist_ok=True)
    os.makedirs('output/categories', exist_ok=True)
    
    # Copy static files
    if os.path.exists('static'):
        shutil.copytree('static', 'output/static', dirs_exist_ok=True)

def generate_product_page(product):
    """Generate individual product page."""
    template = env.get_template('product.html')
    output = template.render(product=product)
    
    filename = f"output/products/{product['id']}.html"
    with open(filename, 'w') as f:
        f.write(output)

def generate_category_page(category, products):
    """Generate category page."""
    template = env.get_template('category.html')
    output = template.render(category=category, products=products)
    
    filename = f"output/categories/{category.lower().replace(' ', '-')}.html"
    with open(filename, 'w') as f:
        f.write(output)

def generate_index_page(categories):
    """Generate main index page."""
    template = env.get_template('index.html')
    output = template.render(categories=categories)
    
    with open('output/index.html', 'w') as f:
        f.write(output)

def main():
    # Create output directory structure
    ensure_output_directory()
    
    # Read product data
    products = read_products()
    
    # Get categories
    categories = get_categories(products)
    
    # Generate pages
    for product in products:
        generate_product_page(product)
    
    for category, category_products in categories.items():
        generate_category_page(category, category_products)
    
    generate_index_page(categories)
    
    print("Site generated successfully!")

if __name__ == '__main__':
    main()
