import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaDownload } from 'react-icons/fa';
import debounce from 'lodash.debounce';
import '../styles/SearchPage.css';

function SearchPage({ setSelectedImage }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const API_KEY = '49732560-13fb1a0ff3eb98739b824598e';
  const PER_PAGE = 12;

  const searchImages = debounce(async (newPage = 1) => {
    if (!searchTerm.trim()) {
      setImages([]);
      return;
    }

    setLoading(true);

    try {
      const encodedSearchTerm = encodeURIComponent(searchTerm);
      const response = await fetch(
        `https://pixabay.com/api/?key=${API_KEY}&q=${encodedSearchTerm}&image_type=photo&per_page=${PER_PAGE}&page=${newPage}`
      );

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      setImages(data.hits || []);
      setPage(newPage);
      setTotalPages(Math.ceil((data.totalHits || 0) / PER_PAGE));
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  }, 500);

  useEffect(() => {
    searchImages(1);
  }, [searchTerm]);

  const handleImageSelect = (image) => {
    setSelectedImage(image.largeImageURL);
    navigate('/editor');
  };

  const downloadImage = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `premium-image-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="search-page">
      <header className="search-header">
        <h1>Image Search & Editor</h1>
      </header>

      <div className="search-container">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search professional images..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="loading-dots">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i}
                className="loading-dot" 
                style={{ animationDelay: `${i * 0.16}s` }}
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          {images.length > 0 ? (
            <>
              <div className="image-grid">
                {images.map((image) => (
                  <div key={image.id} className="image-card">
                    <img 
                      src={image.webformatURL} 
                      alt={image.tags} 
                      className="card-image"
                    />
                    <div className="card-content">
                      <h3 className="image-title">
                        {image.tags.split(',')[0]}
                      </h3>
                      <div className="image-actions">
                        <button 
                          className="action-btn"
                          onClick={() => handleImageSelect(image)}
                        >
                          Add Caption
                        </button>
                        {/* <button
                          className="action-btn"
                          onClick={() => downloadImage(image.largeImageURL)}
                        >
                          <FaDownload /> Download HD
                        </button> */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pagination">
                <button
                  className="page-btn"
                  onClick={() => searchImages(page - 1)}
                  disabled={page === 1 || loading}
                >
                  Previous
                </button>
                <span>
                  Page {page} of {totalPages}
                </span>
                <button
                  className="page-btn"
                  onClick={() => searchImages(page + 1)}
                  disabled={page === totalPages || loading}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="no-results">
              <h3>Start Your Creative Journey</h3>
              <p>Search for professional-grade images to edit or download</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SearchPage;