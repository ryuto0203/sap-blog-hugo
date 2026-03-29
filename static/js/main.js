// SAP Knowledge Site - Main JavaScript

// Load header and footer components
async function loadComponents() {
  try {
    // 常にルートからcomponents読み込み（全ページ共通）
    const componentPath = '/components/';
    
    // Header読み込み
    const headerResponse = await fetch(componentPath + 'header.html');
    document.querySelector('header').innerHTML = await headerResponse.text();
    updateActiveNav();
    
    // Footer読み込み
    document.querySelector('footer').innerHTML = await fetch(componentPath + 'footer.html').then(res => res.text());
    
  } catch (error) {
    console.error('ロード失敗:', error);
  }
}

// Update active navigation link
function updateActiveNav() {
  const currentPath = window.location.pathname;
  const currentFile = currentPath.split('/').pop() || 'index.html';
  
  document.querySelectorAll('nav a').forEach(link => {
    const href = link.getAttribute('href');
    const linkFile = href.split('/').pop();
    
    if (linkFile === currentFile || (currentFile === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Initialize page functionality
function init() {
  // Mobile menu toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && document.querySelector(href)) {
        e.preventDefault();
        document.querySelector(href).scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // Form submission handler
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(this);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
        timestamp: new Date().toISOString()
      };

      // Store in localStorage for demo purposes
      let submissions = JSON.parse(localStorage.getItem('contact_submissions') || '[]');
      submissions.push(data);
      localStorage.setItem('contact_submissions', JSON.stringify(submissions));

      // Show success message
      alert('お問い合わせありがとうございます。確認後、ご連絡させていただきます。');
      this.reset();
    });
  }

  // Blog post filtering
  const filterButtons = document.querySelectorAll('.filter-btn');
  const blogPosts = document.querySelectorAll('.blog-post');

  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');
      
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      blogPosts.forEach(post => {
        if (filter === 'all' || post.getAttribute('data-category') === filter) {
          post.style.display = 'block';
          setTimeout(() => post.classList.add('visible'), 10);
        } else {
          post.classList.remove('visible');
          setTimeout(() => post.style.display = 'none', 300);
        }
      });
    });
  });

  // Reading time calculation
  function calculateReadingTime(text) {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
  }

  document.querySelectorAll('[data-reading-time]').forEach(element => {
    const text = element.textContent;
    const time = calculateReadingTime(text);
    const readingTimeEl = element.querySelector('.reading-time');
    if (readingTimeEl) {
      readingTimeEl.textContent = `${time}分で読める`;
    }
  });

  // Table of contents generation
  const toc = document.getElementById('table-of-contents');
  if (toc) {
    const headings = document.querySelectorAll('h2, h3');
    const tocList = document.createElement('ul');

    headings.forEach((heading, index) => {
      if (!heading.id) {
        heading.id = `heading-${index}`;
      }

      const li = document.createElement('li');
      const level = heading.tagName === 'H2' ? 0 : 1;
      li.style.marginLeft = `${level * 1.5}rem`;

      const link = document.createElement('a');
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent;
      li.appendChild(link);
      tocList.appendChild(li);
    });

    toc.appendChild(tocList);
  }

  // Lazy loading for images
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img.lazy').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // Copy to clipboard for code blocks
  document.querySelectorAll('pre').forEach(pre => {
    const button = document.createElement('button');
    button.textContent = 'コピー';
    button.className = 'copy-btn';
    button.addEventListener('click', function() {
      const code = pre.textContent;
      navigator.clipboard.writeText(code).then(() => {
        button.textContent = 'コピーしました!';
        setTimeout(() => {
          button.textContent = 'コピー';
        }, 2000);
      });
    });
    pre.parentElement.insertBefore(button, pre);
  });

  console.log('SAP Knowledge Site initialized');
}

// Load components and initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    loadComponents().then(() => init());
  });
} else {
  loadComponents().then(() => init());
}

// Utility function to get URL parameters
function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  const results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Export for use in other scripts
window.SAP = {
  getUrlParameter: getUrlParameter,
  calculateReadingTime: function(text) {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }
};
