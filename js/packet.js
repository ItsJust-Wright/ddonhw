// Page navigation system
function showPage(pageId) {
  // Get current active page
  const currentPage = document.querySelector('.page-container.active');

  // Determine the new page
  const newPage = pageId === 'home'
    ? document.getElementById('home-page')
    : document.getElementById('page-' + pageId);

  // If there's a current page and it's different from the new page
  if (currentPage && currentPage !== newPage) {
    // First, make the new page active (it will be underneath)
    newPage.classList.add('active');

    // Then animate the current page sliding off
    currentPage.classList.add('page-exit');
    currentPage.classList.remove('active');

    // Wait for exit animation to complete, then clean up
    setTimeout(() => {
      currentPage.classList.remove('page-exit');
      window.scrollTo(0, 0);
    }, 600); // Match the exit animation duration
  } else if (!currentPage) {
    // If no current page, just show the requested page
    newPage.classList.add('active');
    window.scrollTo(0, 0);
  }
}

// Get the next page in sequence
function getNextPage() {
  const currentPage = document.querySelector('.page-container.active');
  const currentId = currentPage.id;

  // Define page order: home -> page-1 -> page-2 -> ... -> page-8 -> home
  const pageOrder = ['home-page', 'page-1', 'page-2', 'page-3', 'page-4', 'page-5', 'page-6', 'page-7', 'page-8'];
  const currentIndex = pageOrder.indexOf(currentId);
  const nextIndex = (currentIndex + 1) % pageOrder.length;

  return pageOrder[nextIndex];
}

// Navigate to next page
function nextPage() {
  const nextPageId = getNextPage();
  if (nextPageId === 'home-page') {
    showPage('home');
  } else {
    const pageNum = nextPageId.replace('page-', '');
    showPage(pageNum);
  }
}

// Add click event listeners to all bullet points
document.addEventListener('DOMContentLoaded', function() {
  // Get all list items with data-page attribute
  const bulletPoints = document.querySelectorAll('li[data-page]');

  bulletPoints.forEach(bullet => {
    bullet.addEventListener('click', function(e) {
      // Prevent default action
      e.preventDefault();

      // Get the page number from data-page attribute
      const pageNum = this.getAttribute('data-page');

      // Navigate to that page
      showPage(pageNum);
    });
  });

  // Add page curl to all pages
  const allPages = document.querySelectorAll('.page-container');
  allPages.forEach(page => {
    const curl = document.createElement('div');
    curl.className = 'page-curl';
    curl.addEventListener('click', nextPage);
    page.appendChild(curl);
  });

  // Initialize carousel
  initCarousel();

  // Add touch/swipe support for all carousels
  addSwipeSupport();
});

// Carousel functionality
let currentSlide = 0;
let currentProject = 'edge_mandrel';

// Project image data
const projectImages = {
  edge_mandrel: [
    { src: 'photos/aerocrafted/parts/edge_mandrel/2.jpg', alt: 'Edge Mandrel 2' },
    { src: 'photos/aerocrafted/parts/edge_mandrel/4.jpg', alt: 'Edge Mandrel 4' },
    { src: 'photos/aerocrafted/parts/edge_mandrel/6.jpg', alt: 'Edge Mandrel 6' },
    { src: 'photos/aerocrafted/parts/edge_mandrel/7.jpg', alt: 'Edge Mandrel 7' },
    { src: 'photos/aerocrafted/parts/edge_mandrel/8.jpg', alt: 'Edge Mandrel 8' },
    { src: 'photos/aerocrafted/parts/edge_mandrel/9.jpg', alt: 'Edge Mandrel 9' }
  ],
  wind_tunnel: [
    { src: 'photos/aerocrafted/parts/rusty_dagger_wind_tunnel_model/1.jpg', alt: 'Wind Tunnel Model 1' },
    { src: 'photos/aerocrafted/parts/rusty_dagger_wind_tunnel_model/2.jpg', alt: 'Wind Tunnel Model 2' },
    { src: 'photos/aerocrafted/parts/rusty_dagger_wind_tunnel_model/3.jpg', alt: 'Wind Tunnel Model 3' },
    { src: 'photos/aerocrafted/parts/rusty_dagger_wind_tunnel_model/4.jpg', alt: 'Wind Tunnel Model 4' },
    { src: 'photos/aerocrafted/parts/rusty_dagger_wind_tunnel_model/5.jpg', alt: 'Wind Tunnel Model 5' },
    { src: 'photos/aerocrafted/parts/rusty_dagger_wind_tunnel_model/6.jpg', alt: 'Wind Tunnel Model 6' },
    { src: 'photos/aerocrafted/parts/rusty_dagger_wind_tunnel_model/7.jpg', alt: 'Wind Tunnel Model 7' },
    { src: 'photos/aerocrafted/parts/rusty_dagger_wind_tunnel_model/8.jpg', alt: 'Wind Tunnel Model 8' },
    { src: 'photos/aerocrafted/parts/rusty_dagger_wind_tunnel_model/9.jpg', alt: 'Wind Tunnel Model 9' },
    { src: 'photos/aerocrafted/parts/rusty_dagger_wind_tunnel_model/10.JPG', alt: 'Wind Tunnel Model 10' },
    { src: 'photos/aerocrafted/parts/rusty_dagger_wind_tunnel_model/11.jpg', alt: 'Wind Tunnel Model 11' }
  ],
  misc_parts: [
    { src: 'photos/aerocrafted/parts/misc_parts/1.jpg', alt: 'Misc Parts 1' },
    { src: 'photos/aerocrafted/parts/misc_parts/2.jpg', alt: 'Misc Parts 2' },
    { src: 'photos/aerocrafted/parts/misc_parts/3.jpg', alt: 'Misc Parts 3' },
    { src: 'photos/aerocrafted/parts/misc_parts/4.jpg', alt: 'Misc Parts 4' },
    { src: 'photos/aerocrafted/parts/misc_parts/5.jpg', alt: 'Misc Parts 5' },
    { src: 'photos/aerocrafted/parts/misc_parts/6.jpg', alt: 'Misc Parts 6' },
    { src: 'photos/aerocrafted/parts/misc_parts/7.jpg', alt: 'Misc Parts 7' }
  ]
};

// Project description data
const projectDescriptions = {
  edge_mandrel: {
    title: 'Edge Mandrel',
    text: 'Description text for the Edge Mandrel project goes here.'
  },
  wind_tunnel: {
    title: 'Wind Tunnel Model',
    text: 'Description text for the Wind Tunnel Model project goes here.'
  },
  misc_parts: {
    title: 'Misc Parts',
    text: 'Description text for miscellaneous parts projects goes here.'
  }
};

function initCarousel() {
  updateCarousel();
}

function switchProject(project) {
  currentProject = project;
  currentSlide = 0;

  // Update tab active state
  document.querySelectorAll('#page-3 .project-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  event.target.classList.add('active');

  // Update carousel images
  const track = document.querySelector('#page-3 .carousel-track');
  const indicators = document.querySelector('#page-3 .carousel-indicators');
  const images = projectImages[project];

  // Clear and rebuild track
  track.innerHTML = '';

  // Add images
  images.forEach(img => {
    const imgElement = document.createElement('img');
    imgElement.src = img.src;
    imgElement.alt = img.alt;
    imgElement.className = 'carousel-image';
    track.appendChild(imgElement);
  });

  // Add text card as last slide
  const description = projectDescriptions[project];
  const textCard = document.createElement('div');
  textCard.className = 'carousel-text-card';
  textCard.innerHTML = `
    <h3 class="carousel-card-title">${description.title}</h3>
    <p class="carousel-card-text">${description.text}</p>
  `;
  track.appendChild(textCard);

  // Clear and rebuild indicators (images + 1 for text card)
  indicators.innerHTML = '';
  const totalSlides = images.length + 1;
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('span');
    dot.className = 'carousel-dot';
    if (i === 0) dot.classList.add('active');
    dot.onclick = () => goToSlide(i);
    indicators.appendChild(dot);
  }

  updateCarousel();
}

function moveCarousel(direction) {
  const track = document.querySelector('#page-3 .carousel-track');
  const allSlides = track.children;
  const totalSlides = allSlides.length;

  currentSlide += direction;

  // Loop around
  if (currentSlide < 0) {
    currentSlide = totalSlides - 1;
  } else if (currentSlide >= totalSlides) {
    currentSlide = 0;
  }

  updateCarousel();
}

function goToSlide(index) {
  currentSlide = index;
  updateCarousel();
}

function updateCarousel() {
  const track = document.querySelector('#page-3 .carousel-track');
  const dots = document.querySelectorAll('#page-3 .carousel-indicators .carousel-dot');

  if (track) {
    const offset = -currentSlide * 100;
    track.style.transform = `translateX(${offset}%)`;
  }

  // Update dots
  dots.forEach((dot, index) => {
    if (index === currentSlide) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

// Wholesale Carousel functionality
let currentWholesaleSlide = 0;
let currentWholesaleProject = 'collaborations';

// Wholesale project image data
const wholesaleProjectImages = {
  collaborations: [
    { src: 'photos/aerocrafted/products/wholesale/Collaborations/1.JPEG', alt: 'Collaboration 1' },
    { src: 'photos/aerocrafted/products/wholesale/Collaborations/2.JPEG', alt: 'Collaboration 2' },
    { src: 'photos/aerocrafted/products/wholesale/Collaborations/3.JPG', alt: 'Collaboration 3' },
    { src: 'photos/aerocrafted/products/wholesale/Collaborations/4.jpg', alt: 'Collaboration 4' },
    { src: 'photos/aerocrafted/products/wholesale/Collaborations/5.jpg', alt: 'Collaboration 5' },
    { src: 'photos/aerocrafted/products/wholesale/Collaborations/6.jpg', alt: 'Collaboration 6' },
    { src: 'photos/aerocrafted/products/wholesale/Collaborations/7.JPG', alt: 'Collaboration 7' },
    { src: 'photos/aerocrafted/products/wholesale/Collaborations/8.JPG', alt: 'Collaboration 8' },
    { src: 'photos/aerocrafted/products/wholesale/Collaborations/9.JPG', alt: 'Collaboration 9' }
  ],
  online_retailers: [
    { src: 'photos/aerocrafted/products/wholesale/Online Retailers/1.png', alt: 'Online Retailer 1' },
    { src: 'photos/aerocrafted/products/wholesale/Online Retailers/2.png', alt: 'Online Retailer 2' },
    { src: 'photos/aerocrafted/products/wholesale/Online Retailers/3.png', alt: 'Online Retailer 3' }
  ]
};

// Wholesale project description data
const wholesaleProjectDescriptions = {
  collaborations: {
    title: 'Collaborations',
    text: 'Description text for Collaborations projects goes here.'
  },
  online_retailers: {
    title: 'Online Retailers',
    text: 'Description text for Online Retailers projects goes here.'
  }
};

function switchWholesaleProject(project) {
  currentWholesaleProject = project;
  currentWholesaleSlide = 0;

  // Update tab active state
  const wholesaleTabs = document.querySelectorAll('#page-2 .project-tab');
  wholesaleTabs.forEach(tab => {
    tab.classList.remove('active');
  });
  event.target.classList.add('active');

  // Update carousel images
  const track = document.querySelector('.wholesale-track');
  const indicators = document.querySelector('.wholesale-indicators');
  const images = wholesaleProjectImages[project];

  // Clear and rebuild track
  track.innerHTML = '';

  // Add images
  images.forEach(img => {
    const imgElement = document.createElement('img');
    imgElement.src = img.src;
    imgElement.alt = img.alt;
    imgElement.className = 'carousel-image';
    track.appendChild(imgElement);
  });

  // Add text card as last slide
  const description = wholesaleProjectDescriptions[project];
  const textCard = document.createElement('div');
  textCard.className = 'carousel-text-card';
  textCard.innerHTML = `
    <h3 class="carousel-card-title">${description.title}</h3>
    <p class="carousel-card-text">${description.text}</p>
  `;
  track.appendChild(textCard);

  // Clear and rebuild indicators (images + 1 for text card)
  indicators.innerHTML = '';
  const totalSlides = images.length + 1;
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('span');
    dot.className = 'carousel-dot';
    if (i === 0) dot.classList.add('active');
    dot.onclick = () => goToWholesaleSlide(i);
    indicators.appendChild(dot);
  }

  updateWholesaleCarousel();
}

function moveWholesaleCarousel(direction) {
  const track = document.querySelector('.wholesale-track');
  const allSlides = track.children;
  const totalSlides = allSlides.length;

  currentWholesaleSlide += direction;

  // Loop around
  if (currentWholesaleSlide < 0) {
    currentWholesaleSlide = totalSlides - 1;
  } else if (currentWholesaleSlide >= totalSlides) {
    currentWholesaleSlide = 0;
  }

  updateWholesaleCarousel();
}

function goToWholesaleSlide(index) {
  currentWholesaleSlide = index;
  updateWholesaleCarousel();
}

function updateWholesaleCarousel() {
  const track = document.querySelector('.wholesale-track');
  const dots = document.querySelectorAll('.wholesale-indicators .carousel-dot');

  if (track) {
    const offset = -currentWholesaleSlide * 100;
    track.style.transform = `translateX(${offset}%)`;
  }

  // Update dots
  dots.forEach((dot, index) => {
    if (index === currentWholesaleSlide) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

// Quoting Carousel functionality
let currentQuotingSlide = 0;

function moveQuotingCarousel(direction) {
  const track = document.querySelector('.quoting-track');
  const allSlides = track.children;
  const totalSlides = allSlides.length;

  currentQuotingSlide += direction;

  // Loop around
  if (currentQuotingSlide < 0) {
    currentQuotingSlide = totalSlides - 1;
  } else if (currentQuotingSlide >= totalSlides) {
    currentQuotingSlide = 0;
  }

  updateQuotingCarousel();
}

function goToQuotingSlide(index) {
  currentQuotingSlide = index;
  updateQuotingCarousel();
}

function updateQuotingCarousel() {
  const track = document.querySelector('.quoting-track');
  const dots = document.querySelectorAll('.quoting-indicators .carousel-dot');

  if (track) {
    const offset = -currentQuotingSlide * 100;
    track.style.transform = `translateX(${offset}%)`;
  }

  // Update dots
  dots.forEach((dot, index) => {
    if (index === currentQuotingSlide) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

// Touch/Swipe Support for Carousels
function addSwipeSupport() {
  // Add swipe to main carousel (page-3)
  const mainCarousel = document.querySelector('#page-3 .carousel-container');
  if (mainCarousel) {
    addSwipeListener(mainCarousel, moveCarousel);
  }

  // Add swipe to wholesale carousel (page-2)
  const wholesaleCarousel = document.querySelector('.wholesale-carousel');
  if (wholesaleCarousel) {
    addSwipeListener(wholesaleCarousel, moveWholesaleCarousel);
  }

  // Add swipe to quoting carousel (page-1)
  const quotingCarousel = document.querySelector('.quoting-carousel');
  if (quotingCarousel) {
    addSwipeListener(quotingCarousel, moveQuotingCarousel);
  }
}

function addSwipeListener(element, moveFunction) {
  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartY = 0;
  let touchEndY = 0;
  const minSwipeDistance = 50; // Minimum distance for a swipe

  element.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  element.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // Check if horizontal swipe is greater than vertical (to avoid interfering with scrolling)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX < 0) {
        // Swipe left - next slide
        moveFunction(1);
      } else {
        // Swipe right - previous slide
        moveFunction(-1);
      }
    }
  }
}

// Prevent horizontal scroll bounce on iOS
document.addEventListener('touchmove', function(e) {
  if (e.target.closest('.carousel-container')) {
    // Allow vertical scrolling but prevent horizontal bounce
    const touch = e.touches[0];
    const carousel = e.target.closest('.carousel-container');
    if (carousel) {
      // This helps prevent the page from bouncing when swiping on carousel
      e.preventDefault();
    }
  }
}, { passive: false });
