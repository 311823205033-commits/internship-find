import { useMemo, useState } from 'react';
import JobCard from '../components/JobCard.jsx';
import SearchBar from '../components/SearchBar.jsx';

// These are illustrative sample records for the mini project, not verified live vacancies.
const jobs = [
  { id: 1, title: 'Electronics Design Intern', company: 'CircuitWorks', location: 'Bengaluru', category: 'Electronics', type: 'Hybrid', applyUrl: 'https://example.com/apply/electronics-design' },
  { id: 2, title: 'Embedded Systems Intern', company: 'NexCore Labs', location: 'Pune', category: 'Embedded Systems', type: 'On-site', applyUrl: 'https://example.com/apply/embedded-systems' },
  { id: 3, title: 'IoT Product Intern', company: 'GreenGrid Tech', location: 'Remote', category: 'IoT', type: 'Remote', applyUrl: 'https://example.com/apply/iot-product' },
  { id: 4, title: 'Frontend Web Developer Intern', company: 'BrightPath Digital', location: 'Hyderabad', category: 'Web Development', type: 'Hybrid', applyUrl: 'https://example.com/apply/frontend-web' },
  { id: 5, title: 'Software Engineering Intern', company: 'Northstar Systems', location: 'Chennai', category: 'Software', type: 'On-site', applyUrl: 'https://example.com/apply/software-engineering' },
  { id: 6, title: 'Electronics Testing Intern', company: 'VoltEdge', location: 'Mumbai', category: 'Electronics', type: 'On-site', applyUrl: 'https://example.com/apply/electronics-testing' },
  { id: 7, title: 'IoT Firmware Intern', company: 'Connected Future', location: 'Remote', category: 'IoT', type: 'Remote', applyUrl: 'https://example.com/apply/iot-firmware' },
  { id: 8, title: 'Full-Stack Developer Intern', company: 'Oak & Byte', location: 'Delhi', category: 'Web Development', type: 'Hybrid', applyUrl: 'https://example.com/apply/full-stack' },
];

const categories = ['Electronics', 'Embedded Systems', 'IoT', 'Web Development', 'Software'];
const locations = [...new Set(jobs.map((job) => job.location))].sort();

export { jobs };

export default function Jobs({ onTrack }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [location, setLocation] = useState('All');

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();
    return jobs.filter((job) => {
      const matchesSearch = !query || job.title.toLowerCase().includes(query) || job.company.toLowerCase().includes(query);
      const matchesCategory = category === 'All' || job.category === category;
      const matchesLocation = location === 'All' || job.location === location;
      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [search, category, location]);

  return (
    <main className="container page-content">
      <section className="page-intro reveal">
        <span className="eyebrow"><span className="eyebrow-dot" /> OPPORTUNITY DIRECTORY</span>
        <h1>Find a place to <span>grow.</span></h1>
        <p>Explore sample internships picked to help you take your next career step.</p>
      </section>
      <div className="sample-notice"><span aria-hidden="true">ⓘ</span> These are sample records for this mini project, not verified live vacancies.</div>
      <SearchBar search={search} onSearch={setSearch} category={category} onCategory={setCategory} location={location} onLocation={setLocation} locations={locations} categories={categories} />
      <div className="results-heading"><p><strong>{filteredJobs.length}</strong> {filteredJobs.length === 1 ? 'opportunity' : 'opportunities'} to explore</p><span>Use filters to find your fit</span></div>
      {filteredJobs.length ? (
        <div className="jobs-grid">{filteredJobs.map((job) => <JobCard key={job.id} job={job} onTrack={onTrack} />)}</div>
      ) : (
        <div className="empty-state"><span className="empty-icon">⌕</span><h2>No results found</h2><p>Try another job title, company, category, or location.</p><button className="button button-outline" onClick={() => { setSearch(''); setCategory('All'); setLocation('All'); }}>Clear filters</button></div>
      )}
    </main>
  );
}
