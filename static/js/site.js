// SAP Knowledge Site - Hugo版

document.addEventListener('DOMContentLoaded', function() {

  // モバイルメニュートグル（ハンバーガー）
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function() {
      const isOpen = navMenu.classList.toggle('open');
      menuToggle.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen);
    });
    // メニュー外タップで閉じる
    document.addEventListener('click', function(e) {
      if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('open');
        menuToggle.classList.remove('open');
      }
    });
  }

  // スムーススクロール
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && document.querySelector(href)) {
        e.preventDefault();
        document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ブログカテゴリフィルター
  const filterBtns = document.querySelectorAll('.filter-btn');
  const blogPosts = document.querySelectorAll('.blog-post');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      blogPosts.forEach(post => {
        if (filter === 'all' || post.getAttribute('data-category') === filter) {
          post.style.display = 'block';
        } else {
          post.style.display = 'none';
        }
      });
    });
  });

  // 目次の自動生成
  const toc = document.getElementById('table-of-contents');
  if (toc) {
    const headings = document.querySelectorAll('article h2, article h3');
    if (headings.length === 0) {
      toc.style.display = 'none';
    } else {
      const tocList = document.createElement('ul');
      headings.forEach((heading, index) => {
        if (!heading.id) heading.id = `heading-${index}`;
        const li = document.createElement('li');
        li.style.marginLeft = heading.tagName === 'H3' ? '1.5rem' : '0';
        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent;
        li.appendChild(link);
        tocList.appendChild(li);
      });
      toc.appendChild(tocList);
    }
  }

  // コードブロックのコピーボタン
  document.querySelectorAll('pre').forEach(pre => {
    const btn = document.createElement('button');
    btn.textContent = 'コピー';
    btn.className = 'copy-btn';
    btn.addEventListener('click', function() {
      navigator.clipboard.writeText(pre.textContent).then(() => {
        btn.textContent = 'コピーしました!';
        setTimeout(() => { btn.textContent = 'コピー'; }, 2000);
      });
    });
    pre.parentElement.insertBefore(btn, pre);
  });

});
