document.addEventListener("DOMContentLoaded", () => {

    // ===== GET CURRENT USER =====
    const currentUser = Storage.getCurrentUser();

    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    // ===== GET PROFILE USER =====
    const params = new URLSearchParams(window.location.search);
    const profileId = params.get("id");

    let profileUser = profileId
        ? Storage.getUserById(profileId)
        : currentUser;

    if (!profileUser) return;

    // ===== LOAD PROFILE =====
    function loadProfile() {

        document.getElementById("profileUsername").textContent = profileUser.username;
        document.getElementById("profileBio").textContent =
            profileUser.bio || "This user hasn't added a bio yet.";

        // Avatar
        const avatar = document.getElementById("profileAvatar");

        if (profileUser.profilePic) {
            avatar.style.backgroundImage = `url(${profileUser.profilePic})`;
            avatar.style.backgroundSize = "cover";
            avatar.textContent = "";
        } else {
            avatar.style.backgroundImage = "";
            avatar.textContent = profileUser.username[0].toUpperCase();
        }

        // Posts
        const posts = JSON.parse(localStorage.getItem("nexus_posts")) || [];
        const userPosts = posts.filter(p => p.userId == profileUser.id);

        document.getElementById("profilePostsCount").textContent = userPosts.length;

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

        // Buttons show/hide
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

    // ===== OPEN MODAL =====
    function openEditProfile() {
        document.getElementById("editUsername").value = profileUser.username;
        document.getElementById("editBio").value = profileUser.bio || "";

        document.getElementById("editProfileModal").style.display = "flex";
    }

    // ===== SAVE EDIT =====
    function saveProfileEdit() {
        profileUser.username = document.getElementById("editUsername").value;
        profileUser.bio = document.getElementById("editBio").value;

        Storage.updateUser(profileUser);
        Storage.setCurrentUser(profileUser);

        document.getElementById("editProfileModal").style.display = "none";

        loadProfile();
    }

    // ===== CLOSE MODAL =====
    function closeEditProfile() {
        document.getElementById("editProfileModal").style.display = "none";
    }

    // ===== BUTTON EVENTS =====
    document.getElementById("editProfileBtn")
        ?.addEventListener("click", openEditProfile);

    document.getElementById("saveProfileBtn")
        ?.addEventListener("click", saveProfileEdit);

    document.getElementById("closeProfileBtn")
        ?.addEventListener("click", closeEditProfile);

    // ===== RUN =====
    loadProfile();
});