const form = document.getElementById('productForm');
const productsGrid = document.getElementById('productsGrid');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const desc = document.getElementById('desc').value;
    const price = document.getElementById('price').value;
    const imageFile = document.getElementById('image').files[0];

    const storageRef = storage.ref(`products/${imageFile.name}`);
    await storageRef.put(imageFile);
    const imageUrl = await storageRef.getDownloadURL();

    await db.collection('products').add({
        name,
        desc,
        price,
        imageUrl
    });

    alert('Product added successfully!');
    form.reset();
    loadProducts();
});

async function loadProducts() {
    productsGrid.innerHTML = '';
    const snapshot = await db.collection('products').get();
    snapshot.forEach(doc => {
        const data = doc.data();
        const card = document.createElement('div');
        card.classList.add('product-card');
        card.innerHTML = `
            <img src="${data.imageUrl}" alt="${data.name}" />
            <h3>${data.name}</h3>
            <p>${data.desc}</p>
            <p>Price: $${data.price}</p>
        `;
        productsGrid.appendChild(card);
    });
}

// Load products on page load
loadProducts();