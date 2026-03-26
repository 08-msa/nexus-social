document.addEventListener("DOMContentLoaded", () => {

    // ===== GET CURRENT USER =====
    let currentUser = Storage.getCurrentUser();
    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    // ===== GET PROFILE USER =====
    const params = new URLSearchParams(window.location.search);
    const profileId = params.get("id");
    let profileUser = profileId ? Storage.getUserById(profileId) : currentUser;

    if (!profileUser) return;

    // ===== LOAD PROFILE =====
    function loadProfile() {

        // Username & Bio
        document.getElementById("profileUsername").textContent = profileUser.username;
        document.getElementById("profileBio").textContent = profileUser.bio || "This user hasn't added a bio yet.";

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
                const date = new Date(post.createdAt);
                const formattedDate = date.toLocaleString();
                const div = document.createElement("div");
                div.className = "post";
                div.innerHTML = `
                    <p>${post.content}</p>
                    <small class="post-date">${formattedDate}</small>
                `;
                container.appendChild(div);
            });
        }

        // Followers & Following counts
        document.getElementById("profileFollowersCount").textContent = profileUser.followers?.length || 0;
        document.getElementById("profileFollowingCount").textContent = profileUser.following?.length || 0;

        // ===== BUTTON LOGIC =====
        const editBtn = document.getElementById("editProfileBtn");
        const followBtn = document.getElementById("followBtn");

        if (currentUser.id === profileUser.id) {
            // Own profile
            editBtn.style.display = "block";
            followBtn.style.display = "none"; // hide follow button on own profile
        } else {
            // Other user's profile
            editBtn.style.display = "none";
            followBtn.style.display = "block";
            followBtn.disabled = false;
            followBtn.title = "";

            // Set initial button text
            followBtn.textContent = currentUser.following?.includes(profileUser.id) ? "Unfollow" : "Follow";

            // Follow/Unfollow click
            followBtn.onclick = () => {
                // Reload latest users
                let updatedCurrentUser = Storage.getCurrentUser();
                let updatedProfileUser = Storage.getUserById(profileUser.id);

                const isFollowing = updatedCurrentUser.following?.includes(profileUser.id);

                if (isFollowing) {
                    // Unfollow
                    updatedCurrentUser.following = updatedCurrentUser.following.filter(id => id !== profileUser.id);
                    updatedProfileUser.followers = updatedProfileUser.followers.filter(id => id !== updatedCurrentUser.id);
                    followBtn.textContent = "Follow";
                } else {
                    // Follow
                    updatedCurrentUser.following = updatedCurrentUser.following || [];
                    updatedProfileUser.followers = updatedProfileUser.followers || [];

                    updatedCurrentUser.following.push(profileUser.id);
                    updatedProfileUser.followers.push(updatedCurrentUser.id);
                    followBtn.textContent = "Unfollow";
                }

                // Save changes
                Storage.updateUser(updatedCurrentUser);
                Storage.updateUser(updatedProfileUser);
                Storage.setCurrentUser(updatedCurrentUser);

                // Update counts
                document.getElementById("profileFollowersCount").textContent = updatedProfileUser.followers.length;
                document.getElementById("profileFollowingCount").textContent = updatedCurrentUser.following.length;

                // Update local vars
                profileUser = updatedProfileUser;
                currentUser = updatedCurrentUser;
            };
        }
    }

    // ===== EDIT PROFILE =====
    function openEditProfile() {
        document.getElementById("editUsername").value = profileUser.username;
        document.getElementById("editBio").value = profileUser.bio || "";
        document.getElementById("editProfileModal").style.display = "flex";
    }

    function saveProfileEdit(e) {
        e.preventDefault();

        profileUser.username = document.getElementById("editUsername").value;
        profileUser.bio = document.getElementById("editBio").value;

        const uploadInput = document.getElementById("uploadProfilePic");

        if (uploadInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(event) {
                profileUser.profilePic = event.target.result;
                Storage.updateUser(profileUser);
                Storage.setCurrentUser(profileUser);
                document.getElementById("editProfileModal").style.display = "none";
                loadProfile();
            }
            reader.readAsDataURL(uploadInput.files[0]);
        } else {
            Storage.updateUser(profileUser);
            Storage.setCurrentUser(profileUser);
            document.getElementById("editProfileModal").style.display = "none";
            loadProfile();
        }
    }

    function closeEditProfile() {
        document.getElementById("editProfileModal").style.display = "none";
    }

    // ===== BUTTON EVENTS =====
    document.getElementById("editProfileBtn")?.addEventListener("click", openEditProfile);
    document.getElementById("saveProfileBtn")?.addEventListener("click", saveProfileEdit);
    document.getElementById("closeProfileBtn")?.addEventListener("click", closeEditProfile);

    // ===== INITIAL LOAD =====
    loadProfile();
});