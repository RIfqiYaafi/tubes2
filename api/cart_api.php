<?php
// Set the response content type to JSON
header('Content-Type: application/json');

// Membaca data JSON yang dikirimkan dalam body request
$data = json_decode(file_get_contents('php://input'), true);

// Cek jika data berhasil di-decode
if (!$data) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid JSON data']);
    exit;
}

// Ambil data yang diperlukan dari request
$item_ids = $data['item_ids'] ?? [];
$item_names = $data['item_names'] ?? [];
$item_prices = $data['item_prices'] ?? [];

// Validasi data
if (empty($item_ids) || count($item_ids) !== count($item_names) || count($item_ids) !== count($item_prices)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid cart data.']);
    exit;
}

// Proses penyimpanan data ke database (contoh)
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "tubes";

// Koneksi ke database
$conn = new mysqli($servername, $username, $password, $dbname);

// Cek koneksi
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Menyiapkan query untuk memasukkan data ke tabel keranjang
$stmt = $conn->prepare("INSERT INTO cart_items (item_id, item_name, item_price) VALUES (?, ?, ?)");

// Periksa jika query berhasil dipersiapkan
if ($stmt === false) {
    echo json_encode(['status' => 'error', 'message' => 'Failed to prepare SQL query.']);
    exit;
}

// Eksekusi query untuk setiap item
for ($i = 0; $i < count($item_ids); $i++) {
    $item_id = $item_ids[$i];
    $item_name = $item_names[$i];
    $item_price = $item_prices[$i];

    // Bind parameter
    $stmt->bind_param("isd", $item_id, $item_name, $item_price);

    // Eksekusi statement
    if (!$stmt->execute()) {
        echo json_encode(['status' => 'error', 'message' => 'Error inserting item: ' . $stmt->error]);
        exit;
    }
}

// Tutup statement dan koneksi
$stmt->close();
$conn->close();

// Kirimkan response sukses
echo json_encode(['status' => 'success', 'message' => 'Checkout successful!']);
?>
