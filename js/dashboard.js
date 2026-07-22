// ======================================
// ALECWORLD DASHBOARD
// ======================================

const photoCount = document.getElementById("photoCount");
const albumCount = document.getElementById("albumCount");
const categoryCount = document.getElementById("categoryCount");
const downloadCount = document.getElementById("downloadCount");

const imagesTable = document.getElementById("imagesTable");
const albumsTable = document.getElementById("albumsTable");
const categoriesTable = document.getElementById("categoriesTable");

// ======================================
// LOAD DASHBOARD
// ======================================

async function loadDashboard() {

    await loadStats();

    await loadImages();

    await loadAlbums();

    await loadCategories();

}

// ======================================
// LOAD STATS
// ======================================

async function loadStats() {

    const { count: photos } = await window.supabaseClient
        .from("photos")
        .select("*", { count: "exact", head: true });

    const { count: albums } = await window.supabaseClient
        .from("albums")
        .select("*", { count: "exact", head: true });

    const { count: categories } = await window.supabaseClient
        .from("categories")
        .select("*", { count: "exact", head: true });

    photoCount.textContent = photos || 0;
    albumCount.textContent = albums || 0;
    categoryCount.textContent = categories || 0;
    downloadCount.textContent = 0;

}

// ======================================
// LOAD IMAGES
// ======================================

async function loadImages() {

    const { data, error } = await window.supabaseClient
        .from("photos")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {

        imagesTable.innerHTML = `
        <tr>
            <td colspan="6">${error.message}</td>
        </tr>
        `;

        return;

    }

    if (data.length === 0) {

        imagesTable.innerHTML = `
        <tr>
            <td colspan="6">No images uploaded yet.</td>
        </tr>
        `;

        return;

    }

    imagesTable.innerHTML = "";

    data.forEach(photo => {

        imagesTable.innerHTML += `
        <tr>

            <td>
                <img
                    src="${photo.watermark_url}"
                    width="70"
                    style="border-radius:10px;"
                >
            </td>

            <td>${photo.title}</td>

            <td>${photo.album_id ?? "-"}</td>

            <td>${photo.category_id ?? "-"}</td>

            <td>${photo.downloads ?? 0}</td>

            <td>

                <button class="edit-btn">Edit</button>

                <button class="delete-btn">Delete</button>

            </td>

        </tr>
        `;

    });

}

// ======================================
// LOAD ALBUMS
// ======================================

async function loadAlbums() {

    const { data } = await window.supabaseClient
        .from("albums")
        .select("*")
        .order("name");

    if (!data || data.length === 0) {

        albumsTable.innerHTML = `
        <tr>
            <td colspan="4">No albums created.</td>
        </tr>
        `;

        return;

    }

    albumsTable.innerHTML = "";

    data.forEach(album => {

        albumsTable.innerHTML += `
        <tr>

            <td>${album.name}</td>

            <td>-</td>

            <td>${new Date(album.created_at).toLocaleDateString()}</td>

            <td>

                <button class="edit-btn">Edit</button>

                <button class="delete-btn">Delete</button>

            </td>

        </tr>
        `;

    });

}

// ======================================
// LOAD CATEGORIES
// ======================================

async function loadCategories() {

    const { data } = await window.supabaseClient
        .from("categories")
        .select("*")
        .order("name");

    if (!data || data.length === 0) {

        categoriesTable.innerHTML = `
        <tr>
            <td colspan="4">No categories created.</td>
        </tr>
        `;

        return;

    }

    categoriesTable.innerHTML = "";

    data.forEach(category => {

        categoriesTable.innerHTML += `
        <tr>

            <td>${category.name}</td>

            <td>-</td>

            <td>${new Date(category.created_at).toLocaleDateString()}</td>

            <td>

                <button class="edit-btn">Edit</button>

                <button class="delete-btn">Delete</button>

            </td>

        </tr>
        `;

    });

}

// ======================================

loadDashboard();
