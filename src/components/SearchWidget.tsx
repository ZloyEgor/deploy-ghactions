import React, { useState, useEffect } from 'react';

interface SearchResult {
  title: string;
  url: string;
  text: string;
}

interface SearchWidgetProps {
  searchData?: SearchResult[];
}

const SearchWidget: React.FC<SearchWidgetProps> = ({ searchData = [] }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simple client-side search
    const filteredResults = searchData.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.text.toLowerCase().includes(query.toLowerCase())
    );

    setTimeout(() => {
      setResults(filteredResults);
      setIsSearching(false);
    }, 300);
  }, [query, searchData]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search logic is handled by useEffect
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-warning">{part}</mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="search-widget">
      <form onSubmit={handleSearch} className="mb-3">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Поиск по сайту..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn btn-outline-secondary" type="submit">
            <i className="fas fa-search"></i>
          </button>
        </div>
      </form>

      {isSearching && (
        <div className="text-center py-3">
          <div className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">Поиск...</span>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="search-results">
          <h6 className="text-muted mb-3">
            Найдено результатов: {results.length}
          </h6>
          <div className="list-group">
            {results.map((result, index) => (
              <a
                key={index}
                href={result.url}
                className="list-group-item list-group-item-action"
              >
                <h6 className="mb-1">
                  {highlightText(result.title, query)}
                </h6>
                <p className="mb-1 text-muted small">
                  {highlightText(result.text.substring(0, 150) + '...', query)}
                </p>
                <small className="text-primary">{result.url}</small>
              </a>
            ))}
          </div>
        </div>
      )}

      {query && !isSearching && results.length === 0 && (
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>
          По запросу "{query}" ничего не найдено.
        </div>
      )}
    </div>
  );
};

export default SearchWidget;