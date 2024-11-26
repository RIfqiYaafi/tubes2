// Mengambil elemen untuk menampilkan produk di keranjang
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.querySelector('.cart-count'); // Elemen untuk jumlah keranjang

// Mengambil data produk dari localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Menampilkan produk di keranjang
function displayCartItems() {
    // Cek jika keranjang kosong
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        // Menampilkan item-item yang ada di keranjang
        cartItemsContainer.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" />
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p>Rp${item.price}</p>
                    <button class="remove-btn" onclick="removeItem(${index})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    // Memperbarui jumlah item di keranjang
    cartCount.textContent = cart.length;
}

// Fungsi untuk menghapus item dari keranjang
function removeItem(index) {
    // Menghapus item berdasarkan index
    cart.splice(index, 1);

    // Simpan kembali ke localStorage setelah item dihapus
    localStorage.setItem('cart', JSON.stringify(cart));

    // Memperbarui tampilan keranjang setelah item dihapus
    displayCartItems();
}

// Menangani tombol checkout
// Mengambil data checkout dari localStorage dan mengirimnya ke server
document.getElementById("checkout").addEventListener("click", function(event) {
    event.preventDefault(); // Mencegah form submission biasa

    // Persiapkan data checkout
    const checkoutData = {
        item_ids: cart.map(item => item.id),
        item_names: cart.map(item => item.name),
        item_prices: cart.map(item => item.price)
    };

    console.log('Data yang akan dikirim ke server:', checkoutData);  // Debug: Menampilkan data sebelum dikirim
    
    fetch('cart_api.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'  // Mengirim data dalam format JSON
        },
        body: JSON.stringify(checkoutData)  // Kirim data dalam format JSON
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();  // Mengubah respons menjadi JSON
    })
    .then(data => {
        if (data.status === 'success') {
            alert(data.message);  // Menampilkan pesan sukses
            localStorage.removeItem('cart');
            cart = [];
            displayCartItems();
        } else {
            alert(data.message);  // Menampilkan pesan error
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error processing your request.');
    });
});

// Memperbarui jumlah cart saat halaman dimuat
displayCartItems();
