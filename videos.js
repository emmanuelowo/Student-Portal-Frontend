const logoutBtn = document.getElementById('log-out');

logoutBtn.addEventListener('click', function() {
  // Clear the JWT token from local storage
  localStorage.removeItem('jwt');

  // Redirect the user to the login/signup page
  window.location.href = '/home.html';
});

const token = localStorage.getItem("jwt");
const videosWrapper = document.querySelector(".videos-wrapper");

document.getElementById("flexSwitchCheckChecked").addEventListener("change", function (e) {
    const isChecked = e.target.checked;

    if (isChecked) {
        loadMyVideos();
    } else {
        loadAllVideos();
    }
});

function loadAllVideos() {
    axios
        .get("http://localhost:3000/video/get-videos", {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
        .then((data) => {
            console.log("data", data);
            updateVideoList(data);
        })
        .catch((error) => console.error(error));
}

function loadMyVideos() {
    axios
        .get("http://localhost:3000/video/get-my-videos", {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
        .then((data) => {
            console.log("data", data);
            updateVideoList(data);
        })
        .catch((error) => console.error(error));
}

function updateVideoList(videos) {
    // Remove existing videos
    const existingVideos = videosWrapper.querySelectorAll(".videos-wrapper");
    existingVideos.forEach(video => video.remove());
  
  
    // Create video elements based on the provided data
    videos.data.data.videos.forEach(video => {
        const videoDiv = document.createElement("div");
        videoDiv.classList.add("video");
  
        videoDiv.innerHTML = `
            <video class="video-top" width="100%" height="80%" controls="">
                <source src="http://localhost:3000/${video.videoUrl}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        `;
  
        videosWrapper.appendChild(videoDiv);
    });
  }

// Get the upload button element
const uploadBtn = document.querySelector('.upload-btn');

// Attach an event listener to the button
uploadBtn.addEventListener('click', async () => {
  // Create an input element of type file
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'video/mp4,video/mpeg,video/quicktime';

  // Trigger the file selection dialog
  fileInput.click();

  // Wait for the user to select a file
  await new Promise(resolve => {
    fileInput.addEventListener('change', resolve, { once: true });
  });

  // Create a FormData object and append the file data to it
  const formData = new FormData();
  formData.append('video', fileInput.files[0]);

  // Get the JWT token from localStorage
  const token = localStorage.getItem('jwt');

  // Make an Axios POST request to the backend to upload the video
  axios.post('http://localhost:3000/video/post-video', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`,
    },
  })
  .then(response => {
    console.log(response.data);
    loadMyVideos();

  })
  .catch(error => {
    console.log(error);
  });
});

// Load all videos by default
loadAllVideos();

