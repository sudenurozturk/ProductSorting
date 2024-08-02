document.addEventListener('DOMContentLoaded', function() {
    const productsContainer = document.querySelector('.row');
    const products = Array.from(document.querySelectorAll('.col'));
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    const getProductData = (product) => {
        let priceText = product.querySelector('.card-body').textContent || product.querySelector('.fw-bolder').parentElement.textContent;
        let price;

        priceText = priceText.replace(/\s/g, '').replace(/[^\d\.-]/g, '');

        if (priceText.includes('-')) {
            const priceRange = priceText.split('-').map(price => parseFloat(price.replace('$', '').trim()));
            price = (priceRange[0] + priceRange[1]) / 2; 
        } else {
            price = parseFloat(priceText.replace('$', ''));
        }

        const rating = product.querySelectorAll('.bi-star-fill').length;
        const isOnSale = product.querySelector('.badge') !== null; 
        const productName = product.querySelector('.fw-bolder') ? product.querySelector('.fw-bolder').textContent.toLowerCase() : '';
        const category = product.getAttribute('data-category');
        return { product, price, rating, isOnSale, productName, category };
    };

    const sortProducts = (criteria, order = 'asc') => {
        const sortedProducts = products
            .map(getProductData)
            .sort((a, b) => {
                if (a.isOnSale !== b.isOnSale) {
                    return a.isOnSale ? -1 : 1; // Sale items should come first
                }

                if (criteria === 'price') {
                    return order === 'asc' ? a.price - b.price : b.price - a.price;
                } else if (criteria === 'rating') {
                    return order === 'asc' ? a.rating - b.rating : b.rating - a.rating;
                }
            });

        productsContainer.innerHTML = '';
        sortedProducts.forEach(item => productsContainer.appendChild(item.product));
    };

    const filterProducts = () => {
        const searchText = searchInput.value.toLowerCase();

        if (searchText === '') {
            products.forEach(product => {
                product.style.display = '';
            });
            return;
        }

        let matchedCategory = null;

        products.forEach(product => {
            const productData = getProductData(product);
            const productName = productData.productName;

            if (productName.includes(searchText)) {
                matchedCategory = productData.category;
            }
        });

        products.forEach(product => {
            const productData = getProductData(product);
            if (productData.category === matchedCategory) {
                product.style.display = '';
            } else {
                product.style.display = 'none';
            }
        });
    };

    searchButton.addEventListener('click', filterProducts);

    sortProducts('price', 'asc'); 

    document.querySelector('.dropdown-menu').addEventListener('click', function(event) {
        if (event.target.matches('.dropdown-item')) {
            const sortOption = event.target.textContent.trim();
            if (sortOption === 'Price High to Low') {
                sortProducts('price', 'desc');
            } else if (sortOption === 'Price Low to High') {
                sortProducts('price', 'asc');
            } else if (sortOption === 'Rating Low to High') {
                sortProducts('rating', 'asc');
            } else if (sortOption === 'Rating High to Low') {
                sortProducts('rating', 'desc');
            }
        }
    });
});
