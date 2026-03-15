import React, { useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FiSearch, FiArrowRight } from 'react-icons/fi';
import Navbar from './components/Navbar';
import './Companies.css';

const Companies = () => {
	const location = useLocation();
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('');
	const categories = useMemo(() => (
		[
			{ name: 'MNCs', count: 186 },
			{ name: 'Product', count: 132 },
			{ name: 'Banking & Finance', count: 84 },
			{ name: 'Hospitality', count: 58 },
			{ name: 'Fintech', count: 73 }
		]
	), []);

	const categoryCatalogs = useMemo(() => ({
		'MNCs': [
			{ name: 'IBM', domain: 'ibm.com' },
			{ name: 'Capgemini', domain: 'capgemini.com' },
			{ name: 'Wipro', domain: 'wipro.com' },
			{ name: 'HCLTech', domain: 'hcltech.com' },
			{ name: 'Oracle', domain: 'oracle.com' },
			{ name: 'Microsoft', domain: 'microsoft.com' },
			{ name: 'Cognizant', domain: 'cognizant.com' },
			{ name: 'Tech Mahindra', domain: 'techmahindra.com' },
			{ name: 'LTI Mindtree', domain: 'ltimindtree.com' },
			{ name: 'Deloitte', domain: 'deloitte.com' },
			{ name: 'PwC', domain: 'pwc.com' },
			{ name: 'EY', domain: 'ey.com' },
			{ name: 'KPMG', domain: 'kpmg.com' },
			{ name: 'Infosys', domain: 'infosys.com' },
			{ name: 'TCS', domain: 'tcs.com' },
			{ name: 'Accenture', domain: 'accenture.com' },
			{ name: 'Amazon', domain: 'amazon.com' },
			{ name: 'Google', domain: 'google.com' },
			{ name: 'Meta', domain: 'meta.com' },
			{ name: 'Apple', domain: 'apple.com' }
		],
		'Product': [
			{ name: 'Flipkart', domain: 'flipkart.com' },
			{ name: 'Paytm', domain: 'paytm.com' },
			{ name: 'Swiggy', domain: 'swiggy.com' },
			{ name: 'Freshworks', domain: 'freshworks.com' },
			{ name: 'Zoho', domain: 'zoho.com' },
			{ name: 'BrowserStack', domain: 'browserstack.com' },
			{ name: 'Postman', domain: 'postman.com' },
			{ name: 'MPL', domain: 'mpl.live' },
			{ name: 'Meesho', domain: 'meesho.com' },
			{ name: 'CRED', domain: 'cred.club' },
			{ name: 'Gojek', domain: 'gojek.io' },
			{ name: 'Atlassian', domain: 'atlassian.com' },
			{ name: 'Salesforce', domain: 'salesforce.com' },
			{ name: 'ServiceNow', domain: 'servicenow.com' }
		],
		'Banking & Finance': [
			{ name: 'ICICI Bank', domain: 'icicibank.com' },
			{ name: 'SBI', domain: 'sbi.co.in' },
			{ name: 'Axis Bank', domain: 'axisbank.com' },
			{ name: 'Kotak Mahindra Bank', domain: 'kotak.com' },
			{ name: 'Yes Bank', domain: 'yesbank.in' },
			{ name: 'IDFC First Bank', domain: 'idfcfirstbank.com' },
			{ name: 'HSBC', domain: 'hsbc.com' },
			{ name: 'Standard Chartered', domain: 'sc.com' },
			{ name: 'Barclays', domain: 'barclays.com' }
		],
		'Hospitality': [
			{ name: 'OYO', domain: 'oyorooms.com' },
			{ name: 'MakeMyTrip', domain: 'makemytrip.com' },
			{ name: 'Yatra', domain: 'yatra.com' },
			{ name: 'IHCL Taj Hotels', domain: 'tajhotels.com' },
			{ name: 'ITC Hotels', domain: 'itchotels.com' }
		],
		'Fintech': [
			{ name: 'Razorpay', domain: 'razorpay.com' },
			{ name: 'Pine Labs', domain: 'pinelabs.com' },
			{ name: 'Cashfree', domain: 'cashfree.com' },
			{ name: 'Groww', domain: 'groww.in' },
			{ name: 'Zerodha', domain: 'zerodha.com' },
			{ name: 'PayU', domain: 'payu.in' },
			{ name: 'Policybazaar', domain: 'policybazaar.com' },
			{ name: 'CoinSwitch', domain: 'coinswitch.co' }
		]
	}), []);

	const companies = useMemo(() => (
		[
			{
				name: 'Infosys',
				logo: 'https://logo.clearbit.com/infosys.com',
				website: 'https://infosys.com',
				rating: 4.3,
				reviews: '12.4k',
				badges: ['Foreign MNC', 'IT Services', 'Engineering'],
				tags: ['Hybrid', '50k+ employees'],
				location: 'Bangalore',
				type: 'MNC',
				industry: 'IT Services'
			},
			{
				name: 'Accenture',
				logo: 'https://logo.clearbit.com/accenture.com',
				website: 'https://accenture.com',
				rating: 4.1,
				reviews: '18.9k',
				badges: ['Consulting', 'Digital', 'Product Engineering'],
				tags: ['Global', 'Fortune 500'],
				location: 'Mumbai',
				type: 'Corporate',
				industry: 'Consulting'
			},
			{
				name: 'Tata Consultancy Services',
				logo: 'https://logo.clearbit.com/tcs.com',
				website: 'https://tcs.com',
				rating: 4.0,
				reviews: '22.1k',
				badges: ['IT Services', 'Engineering', 'Cloud'],
				tags: ['India HQ', '400k+ employees'],
				location: 'Pune',
				type: 'Corporate',
				industry: 'IT Services'
			},
			{
				name: 'Zomato',
				logo: 'https://logo.clearbit.com/zomato.com',
				website: 'https://zomato.com',
				rating: 4.2,
				reviews: '6.4k',
				badges: ['Food Processing', 'Product', 'Logistics'],
				tags: ['Consumer', 'Tech-first'],
				location: 'Delhi NCR',
				type: 'Product',
				industry: 'Hospitality'
			},
			{
				name: 'Razorpay',
				logo: 'https://logo.clearbit.com/razorpay.com',
				website: 'https://razorpay.com',
				rating: 4.5,
				reviews: '3.8k',
				badges: ['Fintech', 'Product', 'Engineering'],
				tags: ['Unicorn', 'Developer-first'],
				location: 'Bangalore',
				type: 'Startup',
				industry: 'Fintech'
			},
			{
				name: 'HDFC Bank',
				logo: 'https://logo.clearbit.com/hdfcbank.com',
				website: 'https://hdfcbank.com',
				rating: 4.0,
				reviews: '9.1k',
				badges: ['Banking & Finance', 'Retail', 'Enterprise'],
				tags: ['PAN India', '50k+ employees'],
				location: 'Mumbai',
				type: 'Corporate',
				industry: 'Banking'
			},
			{
				name: 'Freshworks',
				logo: 'https://logo.clearbit.com/freshworks.com',
				website: 'https://freshworks.com',
				rating: 4.4,
				reviews: '2.7k',
				badges: ['Product', 'Customer Experience', 'SaaS'],
				tags: ['Hybrid', 'NASDAQ'],
				location: 'Hyderabad',
				type: 'Product',
				industry: 'Product'
			}
		]
	), []);
    
	// Sync from URL query params (e.g., /companies?category=MNC or ?collection=IT%20companies)
	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const urlCategory = params.get('category');
		const urlCollection = params.get('collection');

		const categoryMap = {
			'MNC': 'MNCs',
			'Product based': 'Product',
			'Fintech': 'Fintech',
			'Hospitality': 'Hospitality',
			'Banking & Finance': 'Banking & Finance'
		};

		if (urlCategory) {
			const mapped = categoryMap[urlCategory] || '';
			setSelectedCategory(mapped);
			// If not mapped to a known category, use it as a search term
			setSearchTerm(mapped ? '' : urlCategory);
			return;
		}
		if (urlCollection) {
			// Treat collections as search keywords (e.g., IT companies → IT)
			const normalized = urlCollection.replace(/\bcompanies\b/i, '').trim();
			setSelectedCategory('');
			setSearchTerm(normalized);
		}
	}, [location.search]);

	const filteredCompanies = useMemo(() => {
		const termRaw = searchTerm.trim();
		const term = termRaw.toLowerCase();

		const matchesTerm = (company, t) => {
			if (!t) return true;
			const fields = [
				company.name,
				company.industry,
				company.type,
				...(company.badges || []),
				...(company.tags || [])
			].map(v => String(v || '').toLowerCase());
			return fields.some(v => v.includes(t));
		};

		const normalizeCategoryMatch = (company, cat) => {
			if (!cat) return true;
			switch (cat) {
				case 'MNCs':
					return ['MNC', 'Corporate'].includes(company.type);
				case 'Product':
					return ['Product', 'Startup'].includes(company.type);
				case 'Banking & Finance':
					return ['Banking', 'Finance', 'Fintech'].includes(company.industry);
				case 'Hospitality':
					return company.industry === 'Hospitality';
				case 'Fintech':
					return company.industry === 'Fintech';
				default:
					return true;
			}
		};

		// Base set: filter by category first (if selected)
		let base = companies.filter(c => normalizeCategoryMatch(c, selectedCategory));

		// Apply name search within the category (if any)
		if (term) {
			base = base.filter(c => matchesTerm(c, term));
		}

		// If no category selected, retain previous fallback behavior
		if (!selectedCategory) {
			if (term && base.length === 0) {
				return [{
					name: termRaw,
					logo: 'https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg',
					website: `https://www.google.com/search?q=${encodeURIComponent(termRaw)}`,
					rating: 0,
					reviews: '0',
					badges: ['User search'],
					tags: ['Auto-generated'],
					location: '—',
					type: '—',
					industry: '—',
					isPlaceholder: true
				}];
			}
			return base.length ? base : companies;
		}

		// Bring in catalog companies not in base yet
		const catalog = categoryCatalogs[selectedCategory] || [];
		const baseNames = new Set(base.map(b => b.name.toLowerCase()));
		const catalogObjects = catalog
			.filter(item => !baseNames.has(item.name.toLowerCase()))
			.map(item => ({
				name: item.name,
				logo: `https://logo.clearbit.com/${item.domain}`,
				website: `https://${item.domain}`,
				rating: 4.0,
				reviews: '—',
				badges: [selectedCategory],
				tags: ['Featured'],
				location: '—',
				type: selectedCategory,
				industry: selectedCategory
			}));
		base = [...base, ...catalogObjects];

		// Pad results to declared category count, if needed
		const target = categories.find(c => c.name === selectedCategory)?.count || base.length;
		if (base.length === 0 && target > 0) {
			// Generate placeholder companies for selected category
			const placeholders = Array.from({ length: target }, (_, i) => ({
				name: `${selectedCategory} Company ${i + 1}`,
				logo: 'https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg',
				website: `https://www.google.com/search?q=${encodeURIComponent(selectedCategory)}+company+${i + 1}`,
				rating: 0,
				reviews: '0',
				badges: [selectedCategory],
				tags: ['Auto-generated'],
				location: '—',
				type: selectedCategory,
				industry: selectedCategory,
				isPlaceholder: true
			}));
			return placeholders;
		}

		if (base.length < target) {
			const padded = [...base];
			const existingNames = new Set(padded.map(c => c.name.toLowerCase()));
			let counter = 1;
			while (padded.length < target) {
				const placeholderName = `${selectedCategory} Company ${counter}`;
				const lower = placeholderName.toLowerCase();
				if (!existingNames.has(lower)) {
					padded.push({
						name: placeholderName,
						logo: 'https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg',
						website: `https://www.google.com/search?q=${encodeURIComponent(selectedCategory + ' company ' + counter)}`,
						rating: 0,
						reviews: '0',
						badges: [selectedCategory],
						tags: ['Auto-generated'],
						location: '—',
						type: selectedCategory,
						industry: selectedCategory,
						isPlaceholder: true
					});
					existingNames.add(lower);
				}
				counter++;
			}
			return padded;
		}

		return base;
	}, [companies, searchTerm, selectedCategory, categories, categoryCatalogs]);
	

	return (
		<>
			<Navbar />
			<div className="companies-page">
				<div className="companies-shell">
					<header className="companies-hero">
						<div className="hero-left">
							<p className="eyebrow">Discover top workplaces</p>
							<h1>Explore companies that match your ambitions</h1>
							<p className="hero-sub">
								Curated insights from reviews, ratings, and culture signals to help you choose better.
							</p>
							<div className="hero-search">
								<FiSearch size={18} />
								<input
									placeholder="Search companies, roles, tech, or location"
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
								/>
								<button type="button">Search</button>
							</div>
						</div>
						<div className="hero-stat">
							<div className="stat-number">28k+</div>
							<div className="stat-label">Verified companies</div>
						</div>
					</header>

					<section className="category-carousel">
						{categories.map((c) => (
							<div
								key={c.name}
								className="category-pill"
								onClick={() => setSelectedCategory(c.name)}
								role="button"
								aria-label={`Filter ${c.name}`}
							>
								<div className="pill-top">{c.name}</div>
								<div className="pill-bottom">{c.count} companies</div>
							</div>
						))}
					</section>

					<section className="companies-content">
						<div className="companies-main">
									<div className="results-header">
										<div>
											<div className="results-eyebrow">Featured Companies</div>
											<div className="results-title">Handpicked matches for you</div>
										</div>
										<div className="compact-meta">
											<div className="result-count">{filteredCompanies.length} results</div>
										</div>
									</div>
									<div className="company-grid">
										{filteredCompanies.map((company) => (
											<a
											key={company.name}
											href={company.website}
											target="_blank"
											rel="noopener noreferrer"
											className="company-card"
										>
											<div className="card-header">
												<div className="logo-wrap">
													<img src={company.logo} alt={company.name} />
												</div>
												<div className="card-meta">
													<h3>{company.name}</h3>
													<div className="rating">
														<span className="star">★</span>
														{company.rating}
														<span className="reviews">({company.reviews} reviews)</span>
													</div>
													<div className="badges">
														{company.badges.map((badge) => (
															<span key={badge} className="badge">{badge}</span>
														))}
															{company.isPlaceholder && (
																<span className="badge suggested">Suggested</span>
															)}
													</div>
												</div>
												<span className="open-btn" aria-label="Visit website">
													<FiArrowRight size={18} />
												</span>
											</div>
											<div className="card-footer">
												<div className="tags">
													{company.tags.map((tag) => (
														<span key={tag}>{tag}</span>
													))}
												</div>
											</div>
										</a>
									))}
								</div>
						</div>
					</section>
				</div>
			</div>
		</>
	);
};

export default Companies;
