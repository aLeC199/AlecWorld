const form = document.getElementById("uploadForm");

const title = document.getElementById("title");

const description = document.getElementById("description");

const image = document.getElementById("image");

const message = document.getElementById("uploadMessage");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    message.style.color = "white";
    message.textContent = "Uploading photo...";

    const file = image.files[0];

    if (!file) {

        message.style.color = "red";
        message.textContent = "Please select an image.";

        return;

    }

    const fileName = Date.now() + "-" + file.name;

    const filePath = "photos/" + fileName;

    const { error: uploadError } = await window.supabaseClient.storage
        .from("images")
        .upload(filePath, file);

    if (uploadError) {

        message.style.color = "red";
        message.textContent = uploadError.message;

        return;

    }

    const { data } = window.supabaseClient.storage
        .from("images")
        .getPublicUrl(filePath);

    const imageUrl = data.publicUrl;

    const { error: dbError } = await window.supabaseClient
        .from("images")
        .insert([
            {
                title: title.value,
                description: description.value,
                original_url: imageUrl,
                image_path: filePath
            }
        ]);

    if (dbError) {

        message.style.color = "red";
        message.textContent = dbError.message;

        return;

    }

    message.style.color = "#22c55e";
    message.textContent = "Photo uploaded successfully!";

    form.reset();

});
