// ======================================
// ALECWORLD UPLOAD
// ======================================

const form = document.getElementById("uploadForm");
const imageInput = document.getElementById("image");
const preview = document.getElementById("preview");
const title = document.getElementById("title");
const description = document.getElementById("description");
const album = document.getElementById("album");
const category = document.getElementById("category");
const featured = document.getElementById("featured");
const progressBar = document.getElementById("progressBar");
const uploadMessage = document.getElementById("uploadMessage");

// ======================================
// LOAD ALBUMS
// ======================================

async function loadAlbums() {

    const { data, error } = await window.supabaseClient
        .from("albums")
        .select("*")
        .order("name");

    album.innerHTML = '<option value="">Select Album</option>';

    if (error) {

        uploadMessage.textContent = error.message;
        return;

    }

    data.forEach(item => {

        album.innerHTML += `
            <option value="${item.id}">
                ${item.name}
            </option>
        `;

    });

}

// ======================================
// LOAD CATEGORIES
// ======================================

async function loadCategories() {

    const { data, error } = await window.supabaseClient
        .from("categories")
        .select("*")
        .order("name");

    category.innerHTML = '<option value="">Select Category</option>';

    if (error) {

        uploadMessage.textContent = error.message;
        return;

    }

    data.forEach(item => {

        category.innerHTML += `
            <option value="${item.id}">
                ${item.name}
            </option>
        `;

    });

}

loadAlbums();
loadCategories();

// ======================================
// IMAGE PREVIEW
// ======================================

imageInput.addEventListener("change", () => {

    const file = imageInput.files[0];

    if (!file) return;

    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";

});

// ======================================
// UPLOAD
// ======================================

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    uploadMessage.style.color = "white";
    uploadMessage.textContent = "Uploading...";

    progressBar.style.width = "20%";

    const file = imageInput.files[0];

    if (!file) {

        uploadMessage.style.color = "red";
        uploadMessage.textContent = "Select an image.";

        return;

    }

    const fileName = Date.now() + "-" + file.name;

    // Upload image

    const { error: uploadError } = await window.supabaseClient
        .storage
        .from("images")
        .upload(`originals/${fileName}`, file);

    if (uploadError) {

        uploadMessage.style.color = "red";
        uploadMessage.textContent = uploadError.message;

        return;

    }

    progressBar.style.width = "70%";

    const imageUrl = window.supabaseClient
        .storage
        .from("images")
        .getPublicUrl(`originals/${fileName}`)
        .data.publicUrl;

    // Save to database

    const { error: dbError } = await window.supabaseClient
        .from("photos")
        .insert([{

            title: title.value,

            description: description.value,

            original_url: imageUrl,

            watermark_url: imageUrl,

            album_id: album.value || null,

            category_id: category.value || null,

            featured: featured.checked

        }]);

    if (dbError) {

        uploadMessage.style.color = "red";
        uploadMessage.textContent = dbError.message;

        return;

    }

    progressBar.style.width = "100%";

    uploadMessage.style.color = "#22c55e";
    uploadMessage.textContent = "Photo uploaded successfully.";

    setTimeout(() => {

        window.location.href = "dashboard.html";

    }, 1000);

});
