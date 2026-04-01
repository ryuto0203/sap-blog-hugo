// SAP Knowledge Site - Hugo版

document.addEventListener('DOMContentLoaded', function() {

  // テーブルをスクロール可能なラッパーで包む
  document.querySelectorAll('article table').forEach(function(table) {
    const wrapper = document.createElement('div');
    wrapper.className = 'table-wrapper';
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);
  });


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

  // ========================================
  // Fuse.js 検索
  // ========================================
  let fuseInstance = null;

  async function initSearch() {
    try {
      const resp = await fetch('/index.json');
      if (!resp.ok) return;
      const data = await resp.json();
      fuseInstance = new Fuse(data, {
        keys: [
          { name: 'title', weight: 0.5 },
          { name: 'summary', weight: 0.3 },
          { name: 'tags', weight: 0.15 },
          { name: 'categories', weight: 0.05 }
        ],
        threshold: 0.4,
        includeScore: true,
        minMatchCharLength: 2,
      });
    } catch (e) {
      console.warn('Search index load failed:', e);
    }
  }

  function renderSearchResults(results, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (!results || results.length === 0) {
      container.innerHTML = '';
      return;
    }
    container.innerHTML = results.slice(0, 5).map(r => `
      <a href="${r.item.url}" class="search-result-item">
        <div class="search-result-title">${r.item.title}</div>
        <div class="search-result-date">${r.item.date || ''}</div>
      </a>
    `).join('');
  }

  function bindSearchInput(inputId, resultsId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    let timer;
    input.addEventListener('input', function () {
      clearTimeout(timer);
      const q = this.value.trim();
      if (!q || !fuseInstance) {
        document.getElementById(resultsId).innerHTML = '';
        return;
      }
      timer = setTimeout(() => {
        const results = fuseInstance.search(q);
        renderSearchResults(results, resultsId);
      }, 200);
    });
    // 外側クリックで結果を閉じる
    document.addEventListener('click', function (e) {
      if (!input.contains(e.target)) {
        document.getElementById(resultsId).innerHTML = '';
      }
    });
  }

  initSearch().then(() => {
    bindSearchInput('search-input', 'search-results');
    bindSearchInput('mobile-search-input', 'mobile-search-results');
  });

  // ========================================
  // ブログフィルター（ドロップダウン + URLハッシュ）
  // ========================================
  function getSelectedValues(selId) {
    const sel = document.getElementById(selId);
    if (!sel) return [];
    return Array.from(sel.selectedOptions).map(o => o.value).filter(v => v !== 'all');
  }

  function filterBlogPosts(selected) {
    const posts = document.querySelectorAll('.blog-post');
    const filterBar = document.getElementById('active-filter-bar');
    const filterLabel = document.getElementById('active-filter-label');
    let visibleCount = 0;

    posts.forEach(post => {
      const category = post.getAttribute('data-category') || '';
      const tags = (post.getAttribute('data-tags') || '').split(',').map(t => t.trim());
      const matches = selected.length === 0
        || selected.every(v =>
            category === v || tags.some(t => t.toLowerCase() === v.toLowerCase())
          );

      post.style.display = matches ? 'block' : 'none';
      if (matches) visibleCount++;
    });

    const noResults = document.getElementById('no-results');
    if (noResults) noResults.style.display = visibleCount === 0 ? 'block' : 'none';

    if (filterBar) {
      filterBar.style.display = selected.length === 0 ? 'none' : 'flex';
      if (filterLabel) filterLabel.textContent = selected.map(v => `「${v}」`).join(' + ') + ' の記事を表示中';
    }
  }

  function syncFilterSelects(selected) {
    ['blog-filter-select', 'mobile-blog-filter-select'].forEach(id => {
      const sel = document.getElementById(id);
      if (!sel) return;
      Array.from(sel.options).forEach(o => {
        o.selected = selected.includes(o.value);
      });
    });
  }

  // 両方のセレクトにイベントを登録
  ['blog-filter-select', 'mobile-blog-filter-select'].forEach(id => {
    const sel = document.getElementById(id);
    if (!sel) return;
    sel.addEventListener('change', function () {
      const selected = getSelectedValues(id);
      syncFilterSelects(selected);
      filterBlogPosts(selected);
    });
  });

  // クリアボタン
  const clearBtn = document.getElementById('clear-filter');
  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      syncFilterSelects([]);
      filterBlogPosts([]);
      history.replaceState(null, '', location.pathname);
    });
  }

});
