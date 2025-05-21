/**
 * Authentication System - Main JavaScript
 * 
 * Handles form switching, validation, API integration, and UI state management
 * for login, registration, password reset, and account management.
 */

document.addEventListener('DOMContentLoaded', function() {
  // Form Elements
  const loginForm = document.getElementById('login-form-element');
  const registerForm = document.getElementById('register-form-element');
  const forgotPasswordForm = document.getElementById('forgot-password-form-element');
  const resetPasswordForm = document.getElementById('reset-password-form-element');

  // Form Containers
  const loginContainer = document.getElementById('login-form');
  const registerContainer = document.getElementById('register-form');
  const forgotPasswordContainer = document.getElementById('forgot-password-form');
  const resetPasswordContainer = document.getElementById('reset-password-form');

  // Navigation Links
  const showRegisterLink = document.getElementById('show-register-link');
  const showLoginLink = document.getElementById('show-login-link');
  const showForgotPasswordLink = document.getElementById('show-forgot-password-link');
  const backToLoginLink = document.getElementById('back-to-login-link');
  const backToLoginFromResetLink = document.getElementById('back-to-login-from-reset-link');

  // Alert Elements
  const loginAlert = document.getElementById('login-alert');
  const registerAlert = document.getElementById('register-alert');
  const forgotPasswordAlert = document.getElementById('forgot-password-alert');
  const resetPasswordAlert = document.getElementById('reset-password-alert');

  // Submit Buttons
  const loginButton = document.getElementById('login-button');
  const registerButton = document.getElementById('register-button');
  const forgotPasswordButton = document.getElementById('forgot-password-button');
  const resetPasswordButton = document.getElementById('reset-password-button');

  // API Configuration
  const API_BASE_URL = '/api';
  const API_ENDPOINTS = {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    forgotPassword: `${API_BASE_URL}/auth/forgotpassword`,
    resetPassword: `${API_BASE_URL}/auth/resetpassword`,
  };

  // CSRF token (to be implemented)
  let csrfToken = '';

  /**
   * Form Navigation Functions
   */
  
  // Show Login Form
  function showLoginForm() {
    hideAllForms();
    loginContainer.style.display = 'block';
  }

  // Show Register Form
  function showRegisterForm() {
    hideAllForms();
    registerContainer.style.display = 'block';
  }

  // Show Forgot Password Form
  function showForgotPasswordForm() {
    hideAllForms();
    forgotPasswordContainer.style.display = 'block';
  }

  // Show Reset Password Form
  function showResetPasswordForm() {
    hideAllForms();
    resetPasswordContainer.style.display = 'block';
  }

  // Hide All Forms
  function hideAllForms() {
    loginContainer.style.display = 'none';
    registerContainer.style.display = 'none';
    forgotPasswordContainer.style.display = 'none';
    resetPasswordContainer.style.display = 'none';
  }

  /**
   * Form Validation Helpers
   */
  
  // Validate Email Format
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate Password Strength
  function isValidPassword(password) {
    // Minimum 8 characters, at least one letter and one number
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  }

  // Validate Name (no numbers or special characters)
  function isValidName(name) {
    const nameRegex = /^[A-Za-z\s'-]+$/;
    return nameRegex.test(name) && name.trim().length >= 2;
  }

  // Get Password Strength Message
  function getPasswordStrengthMessage(password) {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Za-z]/.test(password)) return 'Password must include at least one letter';
    if (!/\d/.test(password)) return 'Password must include at least one number';
    return '';
  }

  // Show Input Error
  function showInputError(inputGroup, errorElement, errorMessage) {
    inputGroup.classList.add('error');
    errorElement.textContent = errorMessage;
  }

  // Clear Input Error
  function clearInputError(inputGroup, errorElement) {
    inputGroup.classList.remove('error');
    errorElement.textContent = '';
  }

  // Show Alert Message
  function showAlert(alertElement, message, isSuccess = false) {
    alertElement.textContent = message;
    alertElement.classList.remove('alert-success', 'alert-danger');
    alertElement.classList.add(isSuccess ? 'alert-success' : 'alert-danger');
    alertElement.style.display = 'block';
  }

  // Hide Alert Message
  function hideAlert(alertElement) {
    alertElement.style.display = 'none';
  }

  /**
   * Button State Management
   */
  
  // Set Button Loading State
  function setButtonLoading(button, isLoading) {
    if (isLoading) {
      button.originalText = button.textContent;
      button.textContent = 'Please wait...';
      button.disabled = true;
    } else {
      button.textContent = button.originalText || button.textContent;
      button.disabled = false;
    }
  }

  /**
   * API Request Helpers
   */
  
  // Make API Request
  async function makeApiRequest(url, method, data) {
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify(data)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Something went wrong');
      }

      return responseData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Form Submission Handlers
   */
  
  // Handle Login Form Submission
  async function handleLoginSubmit(event) {
    event.preventDefault();
    
    // Get form inputs
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    
    // Get error elements
    const emailError = document.getElementById('login-email-error');
    const passwordError = document.getElementById('login-password-error');
    
    // Get input groups
    const emailGroup = emailInput.parentElement;
    const passwordGroup = passwordInput.parentElement;
    
    // Reset validation state
    clearInputError(emailGroup, emailError);
    clearInputError(passwordGroup, passwordError);
    hideAlert(loginAlert);
    
    // Validate email
    let isValid = true;
    
    if (!emailInput.value.trim()) {
      showInputError(emailGroup, emailError, 'Email is required');
      isValid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
      showInputError(emailGroup, emailError, 'Please enter a valid email address');
      isValid = false;
    }
    
    // Validate password
    if (!passwordInput.value) {
      showInputError(passwordGroup, passwordError, 'Password is required');
      isValid = false;
    }
    
    // If form is valid, submit
    if (isValid) {
      // Show loading state
      setButtonLoading(loginButton, true);
      
      try {
        // API request placeholder
        const data = {
          email: emailInput.value.trim(),
          password: passwordInput.value,
        };
        
        // Replace with actual API call
        // const response = await makeApiRequest(API_ENDPOINTS.login, 'POST', data);
        
        // For demonstration only - simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        showAlert(loginAlert, 'Login successful! Redirecting...', true);
        
        // Simulate redirect after successful login
        setTimeout(() => {
          window.location.href = '/dashboard.html';  // Replace with actual redirect
        }, 1500);
        
      } catch (error) {
        showAlert(loginAlert, error.message || 'Failed to log in. Please try again.');
      } finally {
        setButtonLoading(loginButton, false);
      }
    }
  }

  // Handle Register Form Submission
  async function handleRegisterSubmit(event) {
    event.preventDefault();
    
    // Get form inputs
    const nameInput = document.getElementById('register-name');
    const emailInput = document.getElementById('register-email');
    const passwordInput = document.getElementById('register-password');
    const confirmPasswordInput = document.getElementById('register-confirm-password');
    
    // Get error elements
    const nameError = document.getElementById('register-name-error');
    const emailError = document.getElementById('register-email-error');
    const passwordError = document.getElementById('register-password-error');
    const confirmPasswordError = document.getElementById('register-confirm-password-error');
    
    // Get input groups
    const nameGroup = nameInput.parentElement;
    const emailGroup = emailInput.parentElement;
    const passwordGroup = passwordInput.parentElement;
    const confirmPasswordGroup = confirmPasswordInput.parentElement;
    
    // Reset validation state
    clearInputError(nameGroup, nameError);
    clearInputError(emailGroup, emailError);
    clearInputError(passwordGroup, passwordError);
    clearInputError(confirmPasswordGroup, confirmPasswordError);
    hideAlert(registerAlert);
    
    // Validate name
    let isValid = true;
    
    if (!nameInput.value.trim()) {
      showInputError(nameGroup, nameError, 'Name is required');
      isValid = false;
    } else if (!isValidName(nameInput.value.trim())) {
      showInputError(nameGroup, nameError, 'Please enter a valid name');
      isValid = false;
    }
    
    // Validate email
    if (!emailInput.value.trim()) {
      showInputError(emailGroup, emailError, 'Email is required');
      isValid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
      showInputError(emailGroup, emailError, 'Please enter a valid email address');
      isValid = false;
    }
    
    // Validate password
    if (!passwordInput.value) {
      showInputError(passwordGroup, passwordError, 'Password is required');
      isValid = false;
    } else {
      const passwordErrorMessage = getPasswordStrengthMessage(passwordInput.value);
      if (passwordErrorMessage) {
        showInputError(passwordGroup, passwordError, passwordErrorMessage);
        isValid = false;
      }
    }
    
    // Validate password confirmation
    if (!confirmPasswordInput.value) {
      showInputError(confirmPasswordGroup, confirmPasswordError, 'Please confirm your password');
      isValid = false;
    } else if (passwordInput.value !== confirmPasswordInput.value) {
      showInputError(confirmPasswordGroup, confirmPasswordError, 'Passwords do not match');
      isValid = false;
    }
    
    // If form is valid, submit
    if (isValid) {
      // Show loading state
      setButtonLoading(registerButton, true);
      
      try {
        // API request placeholder
        const data = {
          name: nameInput.value.trim(),
          email: emailInput.value.trim(),
          password: passwordInput.value,
        };
        
        // Replace with actual API call
        // const response = await makeApiRequest(API_ENDPOINTS.register, 'POST', data);
        
        // For demonstration only - simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        showAlert(registerAlert, 'Registration successful! Please check your email to verify your account.', true);
        
        // Clear form fields after successful registration
        registerForm.reset();
        
        // Switch to login form after a delay
        setTimeout(() => {
          showLoginForm();
        }, 3000);
        
      } catch (error) {
        showAlert(registerAlert, error.message || 'Failed to register. Please try again.');
      } finally {
        setButtonLoading(registerButton, false);
      }
    }
  }

  // Handle Forgot Password Form Submission
  async function handleForgotPasswordSubmit(event) {
    event.preventDefault();
    
    // Get form inputs
    const emailInput = document.getElementById('forgot-password-email');
    
    // Get error elements
    const emailError = document.getElementById('forgot-password-email-error');
    
    // Get input groups
    const emailGroup = emailInput.parentElement;
    
    // Reset validation state
    clearInputError(emailGroup, emailError);
    hideAlert(forgotPasswordAlert);
    
    // Validate email
    let isValid = true;
    
    if (!emailInput.value.trim()) {
      showInputError(emailGroup, emailError, 'Email is required');
      isValid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
      showInputError(emailGroup, emailError, 'Please enter a valid email address');
      isValid = false;
    }
    
    // If form is valid, submit
    if (isValid) {
      // Show loading state
      setButtonLoading(forgotPasswordButton, true);
      
      try {
        // API request placeholder
        const data = {
          email: emailInput.value.trim(),
        };
        
        // Replace with actual API call
        // const response = await makeApiRequest(API_ENDPOINTS.forgotPassword, 'POST', data);
        
        // For demonstration only - simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        showAlert(forgotPasswordAlert, 'Password reset link sent! Please check your email.', true);
        
        // Clear form fields after successful submission
        forgotPasswordForm.reset();
        
      } catch (error) {
        showAlert(forgotPasswordAlert, error.message || 'Failed to send reset link. Please try again.');
      } finally {
        setButtonLoading(forgotPasswordButton, false);
      }
    }
  }

  // Handle Reset Password Form Submission
  async function handleResetPasswordSubmit(event) {
    event.preventDefault();
    
    // Get form inputs
    const newPasswordInput = document.getElementById('new-password');
    const confirmNewPasswordInput = document.getElementById('confirm-new-password');
    
    // Get error elements
    const newPasswordError = document.getElementById('new-password-error');
    const confirmNewPasswordError = document.getElementById('confirm-new-password-error');
    
    // Get input groups
    const newPasswordGroup = newPasswordInput.parentElement;
    const confirmNewPasswordGroup = confirmNewPasswordInput.parentElement;
    // Reset validation state
    clearInputError(newPasswordGroup, newPasswordError);
    clearInputError(confirmNewPasswordGroup, confirmNewPasswordError);
    hideAlert(resetPasswordAlert);
    
    // Validate password
    let isValid = true;
    
    if (!newPasswordInput.value) {
      showInputError(newPasswordGroup, newPasswordError, 'Password is required');
      isValid = false;
    } else {
      const passwordErrorMessage = getPasswordStrengthMessage(newPasswordInput.value);
      if (passwordErrorMessage) {
        showInputError(newPasswordGroup, newPasswordError, passwordErrorMessage);
        isValid = false;
      }
    }
    
    // Validate password confirmation
    if (!confirmNewPasswordInput.value) {
      showInputError(confirmNewPasswordGroup, confirmNewPasswordError, 'Please confirm your password');
      isValid = false;
    } else if (newPasswordInput.value !== confirmNewPasswordInput.value) {
      showInputError(confirmNewPasswordGroup, confirmNewPasswordError, 'Passwords do not match');
      isValid = false;
    }
    
    // If form is valid, submit
    if (isValid) {
      // Show loading state
      setButtonLoading(resetPasswordButton, true);
      
      try {
        // Get token from URL if present
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token') || 'demo-token';
        
        // API request placeholder
        const data = {
          password: newPasswordInput.value,
          token: token
        };
        
        // Replace with actual API call
        // const response = await makeApiRequest(`${API_ENDPOINTS.resetPassword}/${token}`, 'PUT', data);
        
        // For demonstration only - simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        showAlert(resetPasswordAlert, 'Password has been reset successfully! Redirecting to login...', true);
        
        // Redirect to login page after successful password reset
        setTimeout(() => {
          showLoginForm();
        }, 2000);
        
      } catch (error) {
        showAlert(resetPasswordAlert, error.message || 'Failed to reset password. Please try again.');
      } finally {
        setButtonLoading(resetPasswordButton, false);
      }
    }
  }

  // Set up event listeners for form navigation
  showRegisterLink.addEventListener('click', function(e) {
    e.preventDefault();
    showRegisterForm();
  });

  showLoginLink.addEventListener('click', function(e) {
    e.preventDefault();
    showLoginForm();
  });

  showForgotPasswordLink.addEventListener('click', function(e) {
    e.preventDefault();
    showForgotPasswordForm();
  });

  backToLoginLink.addEventListener('click', function(e) {
    e.preventDefault();
    showLoginForm();
  });

  if (backToLoginFromResetLink) {
    backToLoginFromResetLink.addEventListener('click', function(e) {
      e.preventDefault();
      showLoginForm();
    });
  }

  // Set up form submission event listeners
  loginForm.addEventListener('submit', handleLoginSubmit);
  registerForm.addEventListener('submit', handleRegisterSubmit);
  forgotPasswordForm.addEventListener('submit', handleForgotPasswordSubmit);
  resetPasswordForm.addEventListener('submit', handleResetPasswordSubmit);

  // Show login form by default
  showLoginForm();
});
