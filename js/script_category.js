// script_category.js - Xử lý trang danh mục sản phẩm

document.addEventListener('DOMContentLoaded', function() {
    initializeCategoryPage();
    setupCategoryFilters();
    loadCategoryProducts();
});

// Khởi tạo trang danh mục
function initializeCategoryPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryType = urlParams.get('type') || 'all';
    
    updateCategoryTitle(categoryType);
    setupSidebarActiveState(categoryType);
    setupMobileSidebar();
}

// Cập nhật tiêu đề danh mục
function updateCategoryTitle(categoryType) {
    const titleElement = document.getElementById('categoryTitle');
    const descriptionElement = document.getElementById('categoryDescription');
    
    const categoryData = {
        'all': {
            title: 'Tất Cả Sản Phẩm',
            description: 'Khám phá tất cả sản phẩm thời trang của chúng tôi'
        },
        'ao': {
            title: 'Áo',
            description: 'Các loại áo thời trang phong cách và thoải mái'
        },
        'ao-thun': {
            title: 'Áo Thun',
            description: 'Áo thun chất liệu cotton mềm mại, thoáng mát'
        },
        'ao-so-mi': {
            title: 'Áo Sơ Mi',
            description: 'Áo sơ mi thanh lịch, phù hợp nhiều dịp'
        },
        'ao-khoac': {
            title: 'Áo Khoác',
            description: 'Áo khoác thời trang, giữ ấm và phong cách'
        },
        'ao-len': {
            title: 'Áo Len',
            description: 'Áo len ấm áp, thiết kế hiện đại'
        },
        'quan': {
            title: 'Quần',
            description: 'Các loại quần thời trang nam nữ'
        },
        'quan-jeans': {
            title: 'Quần Jeans',
            description: 'Quần jeans chất liệu bền đẹp, form dáng chuẩn'
        },
        'quan-tay': {
            title: 'Quần Tây',
            description: 'Quần tây thanh lịch, phù hợp công sở'
        },
        'quan-kaki': {
            title: 'Quần Kaki',
            description: 'Quần kaki thoải mái, dễ phối đồ'
        },
        'quan-short': {
            title: 'Quần Short',
            description: 'Quần short mát mẻ, năng động'
        },
        'vay': {
            title: 'Váy',
            description: 'Váy đẹp cho phái nữ, nhiều kiểu dáng'
        },
        'vay-lien': {
            title: 'Váy Liền',
            description: 'Váy liền thân thanh lịch, quyến rũ'
        },
        'vay-xoe': {
            title: 'Váy Xòe',
            description: 'Váy xòe điệu đà, nữ tính'
        },
        'vay-midi': {
            title: 'Váy Midi',
            description: 'Váy midi thanh lịch, phù hợp nhiều dịp'
        },
        'vay-maxi': {
            title: 'Váy Maxi',
            description: 'Váy maxi dáng dài, thướt tha'
        },
        'phu-kien': {
            title: 'Phụ Kiện',
            description: 'Phụ kiện thời trang hoàn thiện phong cách'
        },
        'mu': {
            title: 'Mũ',
            description: 'Mũ thời trang bảo vệ và làm đẹp'
        },
        'khan-choang': {
            title: 'Khăn Choàng',
            description: 'Khăn choàng ấm áp và thời trang'
        },
        'tui-xach': {
            title: 'Túi Xách',
            description: 'Túi xách phong cách, tiện lợi'
        },
        'that-lung': {
            title: 'Thắt Lưng',
            description: 'Thắt lưng thời trang, chất liệu da'
        }
    };
    
    const data = categoryData[categoryType] || categoryData['all'];
    titleElement.textContent = data.title;
    descriptionElement.textContent = data.description;
}

// Thiết lập trạng thái active cho sidebar
function setupSidebarActiveState(categoryType) {
    // Remove active class from all links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current category
    const currentLink = document.querySelector(`[href="category.html?type=${categoryType}"]`);
    if (currentLink) {
        currentLink.classList.add('active');
    }
    
    // If it's a sub-category, also activate parent
    if (categoryType.includes('-')) {
        const parentType = categoryType.split('-')[0];
        const parentLink = document.querySelector(`[href="category.html?type=${parentType}"]`);
        if (parentLink) {
            parentLink.classList.add('active');
        }
    }
}

// Thiết lập bộ lọc
function setupCategoryFilters() {
    const sortBy = document.getElementById('sortBy');
    const priceRange = document.getElementById('priceRange');
    
    sortBy.addEventListener('change', loadCategoryProducts);
    priceRange.addEventListener('change', loadCategoryProducts);
}

// Tải sản phẩm theo danh mục
function loadCategoryProducts() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryType = urlParams.get('type') || 'all';
    const sortBy = document.getElementById('sortBy').value;
    const priceRange = document.getElementById('priceRange').value;
    
    showLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
        const products = filterProductsByCategory(categoryType);
        const filteredProducts = filterProductsByPrice(products, priceRange);
        const sortedProducts = sortProducts(filteredProducts, sortBy);
        
        displayCategoryProducts(sortedProducts);
        updateProductsCount(sortedProducts.length);
        showLoading(false);
    }, 500);
}

// Lọc sản phẩm theo danh mục
function filterProductsByCategory(categoryType) {
    const allProducts = JSON.parse(localStorage.getItem('products')) || [];
    
    if (categoryType === 'all') {
        return allProducts;
    }
    
    return allProducts.filter(product => {
        const productType = product.type.toLowerCase();
        
        switch(categoryType) {
            case 'ao':
                return productType.includes('áo');
            case 'ao-thun':
                return productType.includes('áo thun') || productType.includes('áo phông');
            case 'ao-so-mi':
                return productType.includes('áo sơ mi');
            case 'ao-khoac':
                return productType.includes('áo khoác');
            case 'ao-len':
                return productType.includes('áo len');
            case 'quan':
                return productType.includes('quần');
            case 'quan-jeans':
                return productType.includes('quần jeans') || productType.includes('quần bò');
            case 'quan-tay':
                return productType.includes('quần tây');
            case 'quan-kaki':
                return productType.includes('quần kaki');
            case 'quan-short':
                return productType.includes('quần short');
            case 'vay':
                return productType.includes('váy') || productType.includes('đầm');
            case 'vay-lien':
                return productType.includes('váy liền') || productType.includes('đầm liền');
            case 'vay-xoe':
                return productType.includes('váy xòe');
            case 'vay-midi':
                return productType.includes('váy midi');
            case 'vay-maxi':
                return productType.includes('váy maxi');
            case 'phu-kien':
                return productType.includes('phụ kiện') || 
                       productType.includes('mũ') || 
                       productType.includes('khăn') || 
                       productType.includes('túi') || 
                       productType.includes('thắt lưng');
            case 'mu':
                return productType.includes('mũ');
            case 'khan-choang':
                return productType.includes('khăn');
            case 'tui-xach':
                return productType.includes('túi');
            case 'that-lung':
                return productType.includes('thắt lưng');
            default:
                return true;
        }
    });
}

// Lọc sản phẩm theo giá
function filterProductsByPrice(products, priceRange) {
    if (priceRange === 'all') return products;
    
    const [min, max] = priceRange.split('-').map(Number);
    
    return products.filter(product => {
        if (max) {
            return product.price >= min && product.price <= max;
        } else {
            return product.price >= min;
        }
    });
}

// Sắp xếp sản phẩm
function sortProducts(products, sortBy) {
    return [...products].sort((a, b) => {
        switch(sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'name-desc':
                return b.name.localeCompare(a.name);
            case 'price':
                return a.price - b.price;
            case 'price-desc':
                return b.price - a.price;
            default:
                return 0;
        }
    });
}

// Hiển thị sản phẩm
function displayCategoryProducts(products) {
    const container = document.getElementById('categoryProducts');
    const noProducts = document.getElementById('noProducts');
    
    if (products.length === 0) {
        container.innerHTML = '';
        noProducts.style.display = 'block';
        return;
    }
    
    noProducts.style.display = 'none';
    
    container.innerHTML = products.map(product => `
        <div class="item">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='images/default-product.jpg'">
            <h3>${product.name}</h3>
            <p class="price">${formatPrice(product.price)}₫</p>
            <button class="buy-btn" data-product='${JSON.stringify(product).replace(/'/g, "&#39;")}'>
                Mua ngay
            </button>
        </div>
    `).join('');
    
    // Thêm sự kiện cho các nút mua hàng
    setupCartEventListeners();
}

// Cập nhật số lượng sản phẩm
function updateProductsCount(count) {
    document.getElementById('productsCount').textContent = `${count} sản phẩm`;
}

// Hiển thị/ẩn loading
function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    spinner.style.display = show ? 'block' : 'none';
}

// Định dạng giá
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Thiết lập sidebar mobile
function setupMobileSidebar() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebarToggle && overlay) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        });
        
        overlay.addEventListener('click', function() {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }
}