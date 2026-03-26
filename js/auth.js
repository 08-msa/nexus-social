/**
 * Nexus Social - Shared Auth Functions
 */

function showError(message) {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = 'alert alert-error';
        messageDiv.classList.remove('hidden');
        
        setTimeout(() => {
            messageDiv.classList.add('hidden');
        }, 5000);
    }
}
// auth.js
//added by memeber 4
// auth.js
function logout() {
    localStorage.removeItem('loggedInUser'); // clear auth
    window.location.href = 'index.html';     // redirect to login
}

// expose globally
window.logout = logout;
// make it globally accessible
window.logout = logout;
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = Storage.isAuthenticated();
    
    // Redirect if trying to access protected pages
    const currentPage = window.location.pathname.split('/').pop();
    const protectedPages = ['feed.html', 'profile.html', 'post.html'];
    
    if (protectedPages.includes(currentPage) && !isLoggedIn) {
        window.location.href = 'index.html';
    }
    // Logout button //added by memeber 4
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            Storage.logout();
            window.location.href = 'index.html';
        });
    }
});