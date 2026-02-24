import '../styles/main.scss';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

class SiteManager {
  constructor() {
    this.init();
  }

  private init() {
    this.setupScrollSpy();
    this.setupSmoothScrolling();
    this.setupExternalLinks();
    this.setupCodeHighlighting();
  }

  private setupScrollSpy() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    if (navLinks.length > 0) {
      console.log('ScrollSpy initialized');
    }
  }

  private setupSmoothScrolling() {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A') {
        const href = target.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    });
  }

  private performSearch(query: string) {
    if (!query.trim()) return;
    
    console.log('Searching for:', query);
    
    window.dispatchEvent(new CustomEvent('search', { detail: { query } }));
  }

  private setupExternalLinks() {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A') {
        const link = target as HTMLAnchorElement;
        if (link.hostname !== window.location.hostname) {
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
        }
      }
    });
  }

  private setupCodeHighlighting() {
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach((block) => {
      const pre = block.parentElement;
      if (pre) {
        const button = document.createElement('button');
        button.className = 'btn btn-sm btn-outline-secondary copy-code-btn';
        button.innerHTML = 'Копировать';
        button.style.position = 'absolute';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.opacity = '0';
        
        pre.style.position = 'relative';
        pre.appendChild(button);
        
        button.addEventListener('click', () => {
          navigator.clipboard.writeText(block.textContent || '').then(() => {
            button.innerHTML = 'Скопировано!';
            setTimeout(() => {
              button.innerHTML = 'Копировать';
            }, 2000);
          });
        });
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new SiteManager();
});

(window as any).SiteManager = SiteManager;