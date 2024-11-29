document.addEventListener('DOMContentLoaded', function() {
        
    function showAlert(type, message) {
        const alert = document.getElementById(type + 'Alert');
        const messageSpan = document.getElementById(type + 'Message');
        messageSpan.textContent = message;
        alert.style.display = 'block';
        
        // Hide alert after 3 seconds
        setTimeout(() => {
            alert.style.display = 'none';
            // redirect to /dashboard.html
            window.location.href = './dashboard.html';
        }, 3000);
    }

    function validateForm(event) {
        event.preventDefault();
        const form = event.target;

        if (!form.checkValidity()) {
            showAlert('warning', 'Please check your input and try again.');
            form.classList.add('was-validated');
            return false;
        }

        // If form is valid
        form.classList.add('was-validated');

        const emailLoginValue = document.getElementById('loginEmail').value;
        const emailRegisteredValue = document.getElementById('loginEmail').value;
        const nameValue = document.getElementById('registerName').value;
        // Check which form was submitted
        if (form.id === 'loginForm') {
            showAlert('success', 'Login successful! Welcome to Toyota PPIC MC steel.');
            console.log('Login Data:', {
                email: emailLoginValue,
                password: document.getElementById('loginPassword').value
            });
            localStorage.setItem('emailLogin', emailLoginValue);
            sessionStorage.setItem('isLoggedIn', true);
        } else if (form.id === 'registerForm') {
            showAlert('success', 'Registration successful! Please login with your new account.');
            console.log('Register Data:', {
                name: nameValue,
                email: emailRegisteredValue,
                password: document.getElementById('registerPassword').value
            });
            const objectFormData = {
                name: nameValue,
                email: emailRegisteredValue,
            }
            localStorage.setItem('emailLogin', emailRegisteredValue);
            localStorage.setItem('formData', JSON.stringify(objectFormData));
            sessionStorage.setItem('isLoggedIn', true);
            form.reset();
        }
        
        form.classList.remove('was-validated');
        return true;
    }

    function validatePasswordMatch() {
        const password = document.getElementById('registerPassword');
        const confirm = document.getElementById('registerConfirmPassword');
        
        if (confirm.value !== password.value) {
            confirm.setCustomValidity('Password not match');
        } else {
            confirm.setCustomValidity('');
        }
    }

    // Event listeners
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const confirmPassword = document.getElementById('registerConfirmPassword');
    const password = document.getElementById('registerPassword');

    loginForm.addEventListener('submit', validateForm);
    registerForm.addEventListener('submit', validateForm);
    confirmPassword.addEventListener('input', validatePasswordMatch);
    password.addEventListener('input', validatePasswordMatch);
});