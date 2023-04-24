
const logoutBtn = document.getElementById("log-out");

logoutBtn.addEventListener("click", function () {
  // Clear the JWT token from local storage
  localStorage.removeItem("jwt");

  // Redirect the user to the login/signup page
  window.location.href = '/home.html';

});


const toggles = document.querySelectorAll('.faq-toggle');

toggles.forEach(toggle => {
	toggle.addEventListener('click', () => {
		toggle.parentNode.classList.toggle('active');
	});
});

