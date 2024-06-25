import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  const productList = document.getElementById('product-list');
  const loadMoreBtn = document.getElementById('load-more');
  const loadingIndicator = document.getElementById('loading');
  const searchInput = document.getElementById('search');
  const categoryFilter = document.getElementById('category-filter');
  const sortFilter = document.getElementById('sort-filter');
  let products = [];
  let filteredProducts = [];
  let itemsToShow = 10;
  let itemsDisplayed = 0;

  // Fetch products from API
  const fetchProducts = async () => {
    loadingIndicator.style.display = 'block';
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      products = await response.json();
      filteredProducts = products;
      displayProducts();
      populateCategoryFilter();
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      loadingIndicator.style.display = 'none';
    }
  };

  // Display products
  const displayProducts = () => {
    const productsToDisplay = filteredProducts.slice(
      0,
      itemsDisplayed + itemsToShow
    );
    productList.innerHTML = '';
    productsToDisplay.forEach((product) => {
      const productItem = document.createElement('div');
      productItem.classList.add('product-item');
      productItem.innerHTML = `
              <img src="${product.image}" alt="${product.title}">
              <h2>${product.title}</h2>
              <p>${product.description.substring(0, 100)}...</p>
              <p class="price">$${product.price}</p>
          `;
      productList.appendChild(productItem);
    });
    itemsDisplayed = productsToDisplay.length;
    if (itemsDisplayed >= filteredProducts.length) {
      loadMoreBtn.style.display = 'none';
    } else {
      loadMoreBtn.style.display = 'block';
    }
  };

  // Populate category filter
  const populateCategoryFilter = () => {
    const categories = [
      ...new Set(products.map((product) => product.category)),
    ];
    categories.forEach((category) => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
  };

  // Filter products
  const filterProducts = () => {
    const searchQuery = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    filteredProducts = products.filter((product) => {
      return (
        (selectedCategory === '' || product.category === selectedCategory) &&
        (product.title.toLowerCase().includes(searchQuery) ||
          product.description.toLowerCase().includes(searchQuery))
      );
    });
    sortProducts();
  };

  // Sort products
  const sortProducts = () => {
    const sortValue = sortFilter.value;
    if (sortValue === 'price-asc') {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'price-desc') {
      filteredProducts.sort((a, b) => b.price - a.price);
    }
    itemsDisplayed = 0;
    displayProducts();
  };

  // Event listeners
  loadMoreBtn.addEventListener('click', displayProducts);
  searchInput.addEventListener('input', filterProducts);
  categoryFilter.addEventListener('change', filterProducts);
  sortFilter.addEventListener('change', sortProducts);

  // Initial fetch
  fetchProducts();
});
