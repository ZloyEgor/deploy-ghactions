import React, { useState, useEffect } from 'react';

interface TocItem {
  id: string;
  title: string;
  level: number;
  children?: TocItem[];
}

interface TableOfContentsProps {
  headings?: TocItem[];
  className?: string;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ 
  headings = [], 
  className = '' 
}) => {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0% -80% 0%',
        threshold: 0
      }
    );

    // Observe all headings
    const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headingElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderTocItem = (item: TocItem) => (
    <li key={item.id} className="nav-item">
      <a
        className={`nav-link ${activeId === item.id ? 'active' : ''} ${
          item.level > 1 ? `ms-${(item.level - 1) * 2}` : ''
        }`}
        href={`#${item.id}`}
        onClick={(e) => {
          e.preventDefault();
          scrollToHeading(item.id);
        }}
        style={{
          fontSize: item.level > 1 ? '0.875rem' : '1rem',
          paddingLeft: `${item.level * 0.5}rem`
        }}
      >
        {item.title}
      </a>
      {item.children && item.children.length > 0 && (
        <ul className="nav flex-column">
          {item.children.map(renderTocItem)}
        </ul>
      )}
    </li>
  );

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className={`table-of-contents ${className}`}>
      <h6 className="text-muted mb-3">
        <i className="fas fa-list me-2"></i>
        Содержание
      </h6>
      <ul className="nav flex-column">
        {headings.map(renderTocItem)}
      </ul>
    </nav>
  );
};

export default TableOfContents;