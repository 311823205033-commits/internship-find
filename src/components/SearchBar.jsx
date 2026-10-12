export default function SearchBar({ search, onSearch, category, onCategory, location, onLocation, locations, categories }) {
  return (
    <div className="filter-panel" aria-label="Filter internship opportunities">
      <label className="search-field">
        <span className="sr-only">Search by job title or company</span>
        <span className="search-icon" aria-hidden="true">⌕</span>
        <input type="search" placeholder="Search job title or company..." value={search} onChange={(event) => onSearch(event.target.value)} />
      </label>
      <label className="select-field">
        <span className="sr-only">Filter by category</span>
        <select value={category} onChange={(event) => onCategory(event.target.value)}>
          <option value="All">All categories</option>
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
      <label className="select-field">
        <span className="sr-only">Filter by location</span>
        <select value={location} onChange={(event) => onLocation(event.target.value)}>
          <option value="All">All locations</option>
          {locations.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
    </div>
  );
}
