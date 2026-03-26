// ===== GET CURRENT USER =====
const currentUser = Storage.getCurrentUser();

if (!currentUser) {
    window.location.href = "login.html";
}

// ===== GET PROFILE USER =====
const params = new URLSearchParams(window.location.search);
const profileId = params.get("id");

let profileUser = profileId
    ? Storage.getUserById(profileId)
    : currentUser;

// ===== LOAD PROFILE =====
function loadProfile() {
    if (!profileUser) return;

    document.getElementById("profileUsername").textContent = profileUser.username;
    document.getElementById("profileBio").textContent =
        profileUser.bio || "This user hasn't added a bio yet.";

    // Avatar
    const avatar = document.getElementById("profileAvatar");
    if (profileUser.profilePic) {
        avatar.style.backgroundImage = `url(${profileUser.profilePic})`;
        avatar.style.backgroundSize = "cover";
    } else {
        avatar.textContent = profileUser.username[0].toUpperCase();
    }

    // Posts
    const posts = JSON.parse(localStorage.getItem("nexus_posts")) || [];
    const userPosts = posts.filter(p => p.userId == profileUser.id);

    document.getElementById("profilePostsCount").textContent = userPosts.length;

    // Render posts
    const container = document.getElementById("userPostsContainer");
    container.innerHTML = "";

    if (userPosts.length === 0) {
        container.innerHTML = `<p style="color: gray;">No posts yet</p>`;
    } else {
        userPosts.forEach(post => {
            const div = document.createElement("div");
            div.className = "post";
            div.innerHTML = `
                <p>${post.content}</p>
                <small>${post.createdAt || ""}</small>
            `;
            container.appendChild(div);
        });
    }

    // ===== BUTTON LOGIC =====
    const editBtn = document.getElementById("editProfileBtn");
    const followBtn = document.getElementById("followBtn");

    if (currentUser.id == profileUser.id) {
        editBtn.style.display = "block";
        followBtn.style.display = "none";
    } else {
        editBtn.style.display = "none";
        followBtn.style.display = "block";
    }
}

// ===== EDIT PROFILE =====
document.getElementById("editProfileBtn").addEventListener("click", () => {
    let newUsername = prompt("Edit username:", profileUser.username);
    let newBio = prompt("Edit bio:", profileUser.bio);

    if (newUsername) profileUser.username = newUsername;
    if (newBio) profileUser.bio = newBio;

    // Use Storage instead of manual localStorage
    Storage.updateUser(profileUser);
    Storage.setCurrentUser(profileUser);

    loadProfile();
});

// ===== RUN =====
loadProfile();