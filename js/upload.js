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

async function loadAlbums(){

    const { data, error } = await window.supabaseClient
        .from("albums")
        .select("*")
        .order("name");

    album.innerHTML =
        '<option value="">Select Album</option>';

    if(error){

        console.error(error);

        return;

    }

    data.forEach(item=>{

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

async function loadCategories(){

    const { data, error } = await window.supabaseClient
        .from("categories")
        .select("*")
        .order("name");

    category.innerHTML =
        '<option value="">Select Category</option>';

    if(error){

        console.error(error);

        return;

    }

    data.forEach(item=>{

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

imageInput.addEventListener("change",()=>{

    const file = imageInput.files[0];

    if(!file) return;

    preview.src = URL.createObjectURL(file);

    preview.style.display="block";

});

// ======================================
// PUBLISH PHOTO
// ======================================

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    uploadMessage.style.color = "white";
    uploadMessage.textContent = "Uploading...";

    progressBar.style.width = "10%";

    const file = imageInput.files[0];

    if (!file) {

        uploadMessage.style.color = "red";
        uploadMessage.textContent = "Please select an image.";

        return;

    }

    const fileName = `${Date.now()}-${file.name}`;

    // Upload Original
    const { error: originalError } = await window.supabaseClient
        .storage
        .from("images")
        .upload(`originals/${fileName}`, file);

    if (originalError) {

        uploadMessage.style.color = "red";
        uploadMessage.textContent = originalError.message;

        return;

    }

    progressBar.style.width = "40%";

    // Create Watermarked Version
    const img = new Image();

    img.src = URL.createObjectURL(file);

    await new Promise(resolve => img.onload = resolve);

    const canvas = document.createElement("canvas");

    canvas.width = img.width;

    canvas.height = img.height;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(img, 0, 0);

    ctx.font = `${Math.max(30, img.width / 35)}px Poppins`;

    ctx.fillStyle = "rgba(255,255,255,0.35)";

    ctx.textAlign = "right";

    ctx.fillText(
        "AlecWorld",
        img.width - 40,
        img.height - 40
    );

    const watermarkedBlob = await new Promise(resolve =>
        canvas.toBlob(resolve, "image/jpeg", 0.95)
    );

    progressBar.style.width = "60%";

    const { error: watermarkError } = await window.supabaseClient
        .storage
        .from("images")
        .upload(
            `watermarks/${fileName}`,
            watermarkedBlob
        );

    if (watermarkError) {

        uploadMessage.style.color = "red";
        uploadMessage.textContent = watermarkError.message;

        return;

    }

    progressBar.style.width = "80%";

    const originalURL = window.supabaseClient
        .storage
        .from("images")
        .getPublicUrl(`originals/${fileName}`)
        .data.publicUrl;

    const watermarkURL = window.supabaseClient
        .storage
        .from("images")
        .getPublicUrl(`watermarks/${fileName}`)
        .data.publicUrl;

    const { error: dbError } = await window.supabaseClient
        .from("photos")
        .insert([{

            title: title.value,

            description: description.value,

            original_url: originalURL,

            watermark_url: watermarkURL,

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
    uploadMessage.textContent = "Upload completed successfully!";

    setTimeout(() => {

        window.location.href = "dashboard.html";

    }, 1200);

});
