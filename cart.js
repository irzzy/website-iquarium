document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart-items");
  const totalPriceElement = document.getElementById("total-price");
  const checkoutBtn = document.getElementById("checkout-btn");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function renderCart() {
    cartContainer.innerHTML = "";

    if (cart.length === 0) {
      cartContainer.innerHTML = "<p>Keranjang masih kosong.</p>";
      totalPriceElement.textContent = "";
      checkoutBtn.style.display = "none";
      return;
    }

    let total = 0;

    cart.forEach((item, index) => {
      total += item.price * item.qty;

      const itemDiv = document.createElement("div");
      itemDiv.className = "cart-item";
      itemDiv.innerHTML = `
        <strong>${item.name}</strong><br/>
        Harga: Rp${item.price}<br/>
        Jumlah: 
        <button onclick="updateQty(${index}, -1)">-</button>
        <span>${item.qty}</span>
        <button onclick="updateQty(${index}, 1)">+</button>
        = Rp${item.price * item.qty}
        <button onclick="removeItem(${index})">Hapus</button>
        <hr/>
      `;

      cartContainer.appendChild(itemDiv);
    });

    totalPriceElement.textContent = `Total: Rp${total}`;
    checkoutBtn.style.display = "block";
  }

  window.updateQty = function (index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  };

  window.removeItem = function (index) {
    if (confirm("Yakin ingin menghapus item ini dari keranjang?")) {
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    }
  };

  checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) return;

  let message = "Halo, saya ingin memesan:\n";

  cart.forEach((item) => {
    message += `- ${item.name} x${item.qty} (Rp${item.price * item.qty})\n`;
  });

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  message += `\nTotal: Rp${total}\n\nTerima kasih!`;

  const phoneNumber = "628995527135"; // Ganti dengan nomor WhatsApp penjual (format internasional tanpa +)
  const encodedMessage = encodeURIComponent(message);
  const waLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  // Arahkan ke WhatsApp
  window.location.href = waLink;

  // Opsional: Kosongkan keranjang setelah checkout
  localStorage.removeItem("cart");
});


  renderCart();
});
