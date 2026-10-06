import { useEffect, useState, type FormEvent } from 'react';
import { Search, ArrowUpRight, MapPin } from 'lucide-react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import type { PropertyType } from '../types';

interface PropertySearchProps {
  compact?: boolean;
  className?: string;
}

const propertyTypes: PropertyType[] = ['Apartment', 'Villa', 'Penthouse', 'Townhouse', 'Land'];

export function PropertySearch({ compact = false, className = '' }: PropertySearchProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [area, setArea] = useState(searchParams.get('location') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [bedrooms, setBedrooms] = useState(searchParams.get('beds') || '');
  const [budget, setBudget] = useState(searchParams.get('maxPrice') || '');

  useEffect(() => {
    setArea(searchParams.get('location') || '');
    setType(searchParams.get('type') || '');
    setStatus(searchParams.get('status') || '');
    setBedrooms(searchParams.get('beds') || '');
    setBudget(searchParams.get('maxPrice') || '');
  }, [searchParams]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (area.trim()) params.set('location', area.trim());
    if (type) params.set('type', type);
    if (!compact && status) params.set('status', status);
    if (bedrooms) params.set('beds', bedrooms);
    if (!compact && budget) params.set('maxPrice', budget);
    const query = params.toString();
    navigate(`/properties${query ? `?${query}` : ''}`);
    if (location.pathname === '/properties') window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function clear() {
    setArea(''); setType(''); setStatus(''); setBedrooms(''); setBudget('');
    navigate('/properties');
  }

  return (
    <form className={`property-search ${compact ? 'property-search--compact' : ''} ${className}`} onSubmit={handleSubmit} aria-label="Search ENKOP properties">
      <label className="search-field search-field--location">
        <span className="search-field__label"><MapPin size={13} strokeWidth={1.45} /> Location</span>
        <input value={area} onChange={(event) => setArea(event.target.value)} placeholder="Neighbourhood or area" list="enkop-areas" aria-label="Search by location" />
        <datalist id="enkop-areas">
          <option value="Kilimani" /><option value="Westlands" /><option value="Karen" /><option value="Lavington" /><option value="Runda" /><option value="Kileleshwa" /><option value="Riverside" /><option value="Parklands" /><option value="Gigiri" />
        </datalist>
      </label>
      <label className="search-field">
        <span className="search-field__label">Property type</span>
        <select value={type} onChange={(event) => setType(event.target.value)} aria-label="Choose a property type">
          <option value="">Any type</option>
          {propertyTypes.map((option) => <option key={option} value={option.toLowerCase()}>{option}</option>)}
        </select>
      </label>
      {!compact && <label className="search-field">
        <span className="search-field__label">Availability</span>
        <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Choose listing status">
          <option value="">Any status</option>
          <option value="For Sale">For sale</option>
          <option value="For Rent">For rent</option>
          <option value="Coming Soon">Coming soon</option>
          <option value="Sold">Sold</option>
          <option value="Let">Let</option>
        </select>
      </label>}
      <label className="search-field search-field--small">
        <span className="search-field__label">Bedrooms</span>
        <select value={bedrooms} onChange={(event) => setBedrooms(event.target.value)} aria-label="Choose number of bedrooms">
          <option value="">Any</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option><option value="5">5+</option>
        </select>
      </label>
      {!compact && <label className="search-field search-field--small">
        <span className="search-field__label">Maximum budget</span>
        <select value={budget} onChange={(event) => setBudget(event.target.value)} aria-label="Choose maximum price">
          <option value="">No limit</option>
          <option value="20000000">KES 20M</option>
          <option value="40000000">KES 40M</option>
          <option value="70000000">KES 70M</option>
          <option value="100000000">KES 100M</option>
        </select>
      </label>}
      <button className="property-search__submit" type="submit">
        {compact ? <><span>Explore properties</span><ArrowUpRight size={16} /></> : <><Search size={15} /><span>Search</span></>}
      </button>
      {!compact && <button className="property-search__clear" type="button" onClick={clear}>Clear filters</button>}
    </form>
  );
}
