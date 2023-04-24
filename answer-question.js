const logoutBtn = document.getElementById("log-out");

logoutBtn.addEventListener("click", function () {
  // Clear the JWT token from local storage
  localStorage.removeItem("jwt");

  // Redirect the user to the login/signup page
  window.location.href = '/home.html';
});

window.onload = function () {
  const token = localStorage.getItem("jwt");
  const currentRoute = window.location.pathname.split('/').pop();


  let authenticatedRoutes =
  [
      "my-question.html",
      "videos.html",
      "answer-question.html",
      "faqs.html"

  ];

let unAuthenticatedRoutes =
  [
      "home.html",
      "login-signup.html",

  ];
if (token) {
  // If the user is authenticated and on an unauthenticated route, redirect to the home page
  if (unAuthenticatedRoutes.includes(currentRoute)) {
      window.location.href = '/home.html';
  }
} else {

  // If the user is not authenticated and on an authenticated route, redirect to the login page
  if (authenticatedRoutes.includes(currentRoute)) {
      window.location.href = '/login-signup.html';
  }
}

  fetchQuestions(token);

};


function showAnswers(answers) {
  const answerContainer = document.getElementById("answer-container");
  answerContainer.innerHTML = "";
  if (answers.length === 0) {
    const noAnswerMessage = document.createElement("p");
    noAnswerMessage.textContent = "No answer yet";
    answerContainer.appendChild(noAnswerMessage);
  } else {
    answers.forEach((answer) => {
      const answerCard = document.createElement("div");
      answerCard.className = "answer-card";
      answerCard.innerHTML = `
      <div class="answer-avatar">${answer.creator.username.charAt(0).toUpperCase()}</div>
      <div class="answer-card-content">
        <div class="answer-card-upper">
          <h6 class="mb-1">${answer.creator.username}</h6>
          <p class="subtle-text mb-1">
          ${new Date(answer.createdAt).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
          })}
          </p>
        </div>
        <div class="answer-card-desc">
          <p>${answer.text}</p>
        </div>
      </div>
    `;
      answerContainer.appendChild(answerCard);
    });
  }
}

function saveAnswers() {
  const textarea = document.getElementById("answer-textarea");
  const answerText = textarea.value;
  const questionId = textarea.getAttribute("data-question-id");
  const token = localStorage.getItem("jwt");

  axios
  .post(`http://localhost:3000/qna/post-answer/${questionId}`, {
    text: answerText
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then((response) => {
    // Handle the response as needed

    // Clear the textarea
    textarea.value = "";
    fetchQuestions(token);

    // Close the modal
    const modalElement = document.getElementById('answerModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();

  })
  .catch((error) => {
    console.error(error);
  });
}


function fetchQuestions(token) {
  const container = document.querySelector("#question-container");

  fetch("http://localhost:3000/qna/get-questions", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // Clear the current content of the container
      container.innerHTML = "";

      // Loop through the questions and create a new card for each one
      data.data.questions.forEach((data) => {
        const card = document.createElement("div");
        card.className = "col-xs-12 col-sm-6 col-md-4 pd-b-10";
        card.innerHTML = `
            <div class="question-card">
              <div class="qc-upper-part">
                <div class="qc-avatar">${data.creator.username.charAt(0).toUpperCase()}</div>
                <div>
                  <h6 class="mb-1">${data.title}</h6>
                  <p class="subtle-text mb-0">
                   ${new Date(data.createdAt).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                  })}
                  </p>
                </div>
              </div>
              <div class="qc-content-part">
                <p class="q-text">${data.description}</p>
                <div class="answer-button">
                <button class="btn btn-outline-primary btn-sm "  data-bs-toggle="modal"
                data-bs-target="#viewAnswersModal">View Answers</button>
                <button class="btn btn-outline-primary btn-sm " data-bs-toggle="modal"
                data-bs-target="#answerModal" data-question-id="${data._id}" id="answer-button-${data._id}">Answer</button>
                <div>
              </div>
            </div>
          `;

        // Add the new card to the container
        container.appendChild(card);

        const answerButton = card.querySelector(`#answer-button-${data._id}`);
        answerButton.addEventListener("click", () => {
          const textarea = document.getElementById("answer-textarea");
          textarea.setAttribute("data-question-id", data._id);
        });
      

        const viewAnswersButton  = card.querySelector(".answer-button");
        viewAnswersButton .addEventListener("click", () => showAnswers(data.answers));
      });
    })
    .catch((error) => console.error(error));

}