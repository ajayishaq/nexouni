// Shopping Cart functionality
let cart = JSON.parse(localStorage.getItem('nexo-cart')) || [];

// Product data
const products = {
    1: { name: 'Classic White T-Shirt', price: 29.99, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400' },
    2: { name: 'Premium Denim Jacket', price: 89.99, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400' },
    3: { name: 'Casual Sneakers', price: 79.99, image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400' },
    4: { name: 'Summer Dress', price: 59.99, image: 'https://images.unsplash.com/photo-1516762689617-e1cfddf819d3?w=400' },
    5: { name: 'Black Polo Shirt', price: 39.99, image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400' },
    6: { name: 'Leather Jacket', price: 149.99, image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400' }
};

// Add to Cart functionality
function addToCart(productId = null, size = 'M', color = 'default') {
    if (!productId) {
        // Get product info from current page or button data
        const addToCartBtn = event.target;
        productId = addToCartBtn.getAttribute('data-product') || '1';
    }
    
    const product = products[productId];
    if (!product) return;
    
    // Check if item already exists in cart
    const existingItem = cart.find(item => 
        item.id === productId && item.size === size && item.color === color
    );
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            size: size,
            color: color,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartDisplay();
    showNotification('Item added to cart!');
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('nexo-cart', JSON.stringify(cart));
}

// Update cart display
function updateCartDisplay() {
    const cartBtn = document.querySelector('.cart-btn');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartBtn && totalItems > 0) {
        cartBtn.innerHTML = `<i class="fas fa-shopping-cart"></i> (${totalItems})`;
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #000;
        color: white;
        padding: 12px 24px;
        border-radius: 4px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Product Detail Page Functions
function changeMainImage(src) {
    const mainImage = document.getElementById('mainProductImage');
    if (mainImage) {
        mainImage.src = src.replace('w=150', 'w=600');
    }
}

function increaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue < 10) {
            quantityInput.value = currentValue + 1;
        }
    }
}

function decreaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    }
}

// Product Options Selection
document.addEventListener('DOMContentLoaded', function() {
    // Size selection
    const sizeButtons = document.querySelectorAll('.size-btn');
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            sizeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Color selection
    const colorButtons = document.querySelectorAll('.color-btn');
    colorButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            colorButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-product');
            addToCart(productId);
        });
    });
    
    // Update cart display on page load
    updateCartDisplay();
});

// Product Tabs
function showTab(tabName) {
    // Hide all tab panels
    const tabPanels = document.querySelectorAll('.tab-panel');
    tabPanels.forEach(panel => panel.classList.remove('active'));
    
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab panel
    const selectedPanel = document.getElementById(tabName);
    if (selectedPanel) {
        selectedPanel.classList.add('active');
    }
    
    // Add active class to selected tab button
    event.target.classList.add('active');
}

// Cart Page Functions
function updateQuantity(itemIndex, change) {
    const quantityInput = document.getElementById(`quantity-${itemIndex}`);
    if (quantityInput) {
        const currentValue = parseInt(quantityInput.value);
        const newValue = Math.max(1, currentValue + change);
        quantityInput.value = newValue;
        updateItemTotal(itemIndex);
    }
}

function updateItemTotal(itemIndex) {
    const quantityInput = document.getElementById(`quantity-${itemIndex}`);
    const itemTotalElement = document.getElementById(`item-total-${itemIndex}`);
    
    if (quantityInput && itemTotalElement) {
        const quantity = parseInt(quantityInput.value);
        const priceText = document.querySelector(`#item-total-${itemIndex}`).parentElement.parentElement.querySelector('.item-price').textContent;
        const price = parseFloat(priceText.replace('$', ''));
        const total = (quantity * price).toFixed(2);
        itemTotalElement.textContent = `$${total}`;
        
        updateCartSummary();
    }
}

function updateCartSummary() {
    // This would normally calculate the actual totals
    // For demo purposes, we'll use fixed values
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    
    if (subtotalElement && totalElement) {
        // Calculate actual totals from cart items
        let subtotal = 0;
        const cartItems = document.querySelectorAll('.cart-item');
        cartItems.forEach((item, index) => {
            const totalText = item.querySelector('.item-total span').textContent;
            subtotal += parseFloat(totalText.replace('$', ''));
        });
        
        const tax = subtotal * 0.08; // 8% tax
        const total = subtotal + tax;
        
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        totalElement.textContent = `$${total.toFixed(2)}`;
        
        const taxElement = document.getElementById('tax');
        if (taxElement) {
            taxElement.textContent = `$${tax.toFixed(2)}`;
        }
    }
}

function removeItem(itemIndex) {
    const cartItem = document.querySelector(`.cart-item:nth-child(${itemIndex})`);
    if (cartItem) {
        cartItem.remove();
        updateCartSummary();
        showNotification('Item removed from cart');
    }
}

function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        const cartItems = document.querySelector('.cart-items');
        const items = cartItems.querySelectorAll('.cart-item');
        items.forEach(item => item.remove());
        
        // Add empty cart message
        cartItems.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #666;">
                <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                <h3>Your cart is empty</h3>
                <p>Continue shopping to add items to your cart.</p>
                <a href="collection.html" class="btn btn-primary" style="margin-top: 1rem;">Shop Now</a>
            </div>
        `;
        
        cart = [];
        saveCart();
        updateCartDisplay();
        showNotification('Cart cleared');
    }
}

function applyPromo() {
    const promoCode = document.getElementById('promoCode').value;
    if (promoCode.toLowerCase() === 'welcome10') {
        showNotification('Promo code applied! 10% discount added.');
    } else if (promoCode) {
        showNotification('Invalid promo code');
    }
}

function proceedToCheckout() {
    alert('Checkout functionality would be implemented here. This is a demo.');
}

// Collection Page Filtering
function filterProducts() {
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (!categoryFilter || !sortFilter) return;
    
    const category = categoryFilter.value;
    const sortBy = sortFilter.value;
    
    const productCards = document.querySelectorAll('.product-card');
    
    // Filter by category
    productCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Sort functionality would be implemented here
    showNotification(`Filtered by ${category === 'all' ? 'all items' : category}`);
}

// Add event listeners for filters
document.addEventListener('DOMContentLoaded', function() {
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', filterProducts);
    }
});

// Contact Form
function submitContactForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    
    // Simulate form submission
    showNotification('Thank you for your message! We\'ll get back to you soon.');
    event.target.reset();
}

// FAQ Toggle
function toggleFaq(index) {
    const faqAnswer = document.getElementById(`faq-${index}`);
    const icon = event.target.querySelector('.fa-chevron-down') || 
                 event.target.parentElement.querySelector('.fa-chevron-down');
    
    if (faqAnswer.classList.contains('active')) {
        faqAnswer.classList.remove('active');
        if (icon) icon.style.transform = 'rotate(0deg)';
    } else {
        // Close all other FAQs
        document.querySelectorAll('.faq-answer').forEach(answer => {
            answer.classList.remove('active');
        });
        document.querySelectorAll('.faq-question i').forEach(i => {
            i.style.transform = 'rotate(0deg)';
        });
        
        // Open clicked FAQ
        faqAnswer.classList.add('active');
        if (icon) icon.style.transform = 'rotate(180deg)';
    }
}

// Newsletter Subscription
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (email) {
                showNotification('Thank you for subscribing to our newsletter!');
                this.reset();
            }
        });
    }
});

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification {
        animation: slideIn 0.3s ease;
    }
`;
document.head.appendChild(style);
