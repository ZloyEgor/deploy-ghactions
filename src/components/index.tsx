import React from 'react';
import { createRoot } from 'react-dom/client';
import SearchWidget from './SearchWidget';
import TableOfContents from './TableOfContents';
import ThemeToggle from './ThemeToggle';
import BackToTop from './BackToTop';

const components = {
  SearchWidget,
  TableOfContents,
  ThemeToggle,
  BackToTop
};
declare global {
  interface Window {
    mountReactComponent: (
      componentName: string, 
      containerId: string, 
      props?: any
    ) => void;
    unmountReactComponent: (containerId: string) => void;
  }
}

window.mountReactComponent = (componentName: string, containerId: string, props = {}) => {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Container with id "${containerId}" not found`);
    return;
  }

  const Component = components[componentName as keyof typeof components];
  if (!Component) {
    console.warn(`Component "${componentName}" not found`);
    return;
  }

  const root = createRoot(container);
  root.render(React.createElement(Component, props));
  
  (container as any)._reactRoot = root;
};
window.unmountReactComponent = (containerId: string) => {
  const container = document.getElementById(containerId);
  if (container && (container as any)._reactRoot) {
    (container as any)._reactRoot.unmount();
    delete (container as any)._reactRoot;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const backToTopContainer = document.getElementById('back-to-top');
  if (backToTopContainer) {
    window.mountReactComponent('BackToTop', 'back-to-top');
  }

  const themeToggleContainer = document.getElementById('theme-toggle-react');
  if (themeToggleContainer) {
    window.mountReactComponent('ThemeToggle', 'theme-toggle-react');
  }

  const searchContainer = document.getElementById('search-widget');
  if (searchContainer) {
    const searchData = (window as any).searchData || [];
    window.mountReactComponent('SearchWidget', 'search-widget', { searchData });
  }

  const tocContainer = document.getElementById('toc-widget');
  if (tocContainer) {
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
      .map((heading, index) => {
        if (!heading.id) {
          heading.id = `heading-${index}`;
        }
        
        return {
          id: heading.id,
          title: heading.textContent || '',
          level: parseInt(heading.tagName.charAt(1))
        };
      });
    
    window.mountReactComponent('TableOfContents', 'toc-widget', { headings });
  }
});

export { SearchWidget, TableOfContents, ThemeToggle, BackToTop };