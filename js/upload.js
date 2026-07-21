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
