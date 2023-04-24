const logoutBtn = document.getElementById('log-out');

logoutBtn.addEventListener('click', function () {
  // Clear the JWT token from local storage

  const token = localStorage.getItem('jwt');
  if (token) {
    localStorage.removeItem('jwt');
    window.location.href = '/home.html';
  }
  else {
    window.location.href = '/login-signup.html';

  }
  // Redirect the user to the login/signup page
});


window.onload = function () {
  const logoutButton = document.getElementById('log-out');
  const token = localStorage.getItem('jwt');

  if (token) {
    logoutButton.innerText = 'Log out';
  }
  else {
    logoutButton.innerText = 'Log in';
  }
}