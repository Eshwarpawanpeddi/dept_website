const nextButton = document.querySelector('.next-btn');
const video = document.querySelector('.hero-video');

// Add the new video to the beginning of the list
const movieList = ['videos/mainvid.mp4', 'videos/hero-1.mp4', 'videos/hero-2.mp4', 'videos/hero-3.mp4', 'videos/hero-4.mp4'];

let index = 0;
nextButton.addEventListener('click', function() {
    index = (index + 1) % movieList.length;
    video.src = movieList[index];
});