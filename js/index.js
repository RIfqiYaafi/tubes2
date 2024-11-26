// Mengambil tombol Add to Cart
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartCount = document.querySelector('.cart-count');

// Mengambil data keranjang dari localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Fungsi untuk menambahkan produk ke keranjang
function addToCart(event) {
    const button = event.target;
    const product = {
        name: button.dataset.name,
        price: button.dataset.price,
        image: button.dataset.image
    };

    // Menambahkan produk ke keranjang
    cart.push(product);

    // Menyimpan ke localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Memperbarui jumlah cart
    updateCartCount();
}

// Memperbarui jumlah keranjang di ikon cart
function updateCartCount() {
    cartCount.textContent = cart.length;
}

// Menambahkan event listener untuk setiap tombol
addToCartButtons.forEach(button => {
    button.addEventListener('click', addToCart);
});

// Memperbarui jumlah cart saat halaman dimuat
updateCartCount();
