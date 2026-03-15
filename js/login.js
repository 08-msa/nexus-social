/**
 * Nexus Social - Login Logic
 */

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const forgotLink = document.getElementById('forgotPassword');
    if (forgotLink) {
        forgotLink.addEventListener('click', handleForgotPassword);
    }
    
    // Clear errors on input
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            hideFieldError('email');
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            hideFieldError('password');
        });
    }
    
    // Password toggle
    const togglePassword = document.getElementById('togglePassword');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle eye icon
            const eyeSlash = this.querySelector('#eyeSlash');
            if (eyeSlash) {
                eyeSlash.style.display = type === 'password' ? 'none' : 'block';
            }
        });
    }
});

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember')?.checked || false;
    
    // Clear all errors
    hideFieldError('email');
    hideFieldError('password');
    
    let hasError = false;
    
    if (!email) {
        showFieldError('email', 'Email is required');
        hasError = true;
    } else if (!isValidEmail(email)) {
        showFieldError('email', 'Please enter a valid email address');
        hasError = true;
    }
    
    if (!password) {
        showFieldError('password', 'Password is required');
        hasError = true;
    }
    
    if (hasError) return;
    
    const user = Storage.validateUser(email, password);
    
    if (user) {
        Storage.setCurrentUser(user);
        window.location.href = 'feed.html';
    } else {
        showFieldError('password', 'Invalid email or password');
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFieldError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
        
        // Add error styling to input
        const input = document.getElementById(fieldId);
        if (input) {
            input.style.borderColor = 'var(--error-red)';
        }
    }
}

function hideFieldError(fieldId) {
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
        errorElement.classList.add('hidden');
        
        // Remove error styling from input
        const input = document.getElementById(fieldId);
        if (input) {
            input.style.borderColor = '';
        }
    }
}

function handleForgotPassword(e) {
    e.preventDefault();
    
    const email = prompt('Enter your email address:');
    if (!email) return;
    
    const user = Storage.findUserByEmail(email);
    
    if (user) {
        alert(`Your password is: ${atob(user.password)}`);
    } else {
        alert('No account found with that email');
    }
}