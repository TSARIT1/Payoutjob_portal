import React, { useState } from 'react';
import Navbar from '../../pages/components/Navbar';
import Footer from '../../pages/components/Footer';
import UserProfileSidebar from './UserProfileSidebar';
import { useAuth } from '../../contexts/AuthContext';
import { formatTimeAgo } from '../../utils/timeAgo';
import './Blogs.css';

const samplePosts = [
  {
    id: 1,
    title: 'How I prepared for Frontend interviews',
    excerpt: 'My 4-week prep plan covering CSS grids, React hooks, and performance tips…',
    author: 'You',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hrs ago
    tags: ['Interview', 'Frontend', 'React'],
    readTime: '6 min',
    content:
      'Week 1: Fundamentals — I focused on HTML semantics, accessibility, and CSS layout systems (Flexbox + Grid). Week 2: JavaScript — revisited event loop, closures, async, and DOM APIs. Week 3: React — hooks, context, memoization, and testing. Week 4: Systems — performance, bundling, caching, Lighthouse. Practice with small, real apps and daily coding drills.',
  },
  {
    id: 2,
    title: 'Building a responsive UI with modern CSS',
    excerpt: 'Practical patterns with Flexbox and Grid that scale across breakpoints…',
    author: 'You',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    tags: ['CSS', 'Responsive Design'],
    readTime: '4 min',
    content:
      'Start mobile-first: define typographic scale and spacing tokens. Use Grid for macro layouts and Flexbox for micro alignment. Prefer minmax(), auto-fit, and clamp() for fluidity. Test on real devices and simulate slow networks. Ship small CSS and defer non-critical styles.',
  },
  {
    id: 3,
    title: 'Optimizing React renders like a pro',
    excerpt: 'Memoization, keying, and avoiding unnecessary reconciliation in real apps…',
    author: 'You',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(), // 20 days ago
    tags: ['React', 'Performance'],
    readTime: '7 min',
    content:
      'Measure before optimizing: use React DevTools Profiler to find hot paths. Memoize pure components with React.memo, memoize expensive derivations with useMemo, and event handlers with useCallback. Keep keys stable, avoid prop churn, and batch state updates. Profile after changes to confirm wins.',
  },
  {
    id: 4,
    title: 'From zero to job-ready: My portfolio journey',
    excerpt: 'Projects that helped recruiters notice me, and how I presented them…',
    author: 'You',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // ~1 month ago
    tags: ['Career', 'Portfolio'],
    readTime: '5 min',
    content:
      'Pick 3 projects with clear business value. Show problem, approach, code highlights, and outcomes. Add live demos, tests, and concise READMEs. Refine the narrative and tailor for roles. Keep iterating with feedback from peers and recruiters.',
  },
];

export default function Blogs() {
  const { user } = useAuth();
  const [posts, setPosts] = useState(samplePosts);
  const [readPostIds, setReadPostIds] = useState(new Set());
  const [expandedPostIds, setExpandedPostIds] = useState(new Set());

  const toggleReadAndExpand = (id) => {
    setReadPostIds((prev) => {
      const next = new Set(prev);
      next.add(id); // mark as read on first click
      return next;
    });
    setExpandedPostIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const [newPost, setNewPost] = useState({
    title: '',
    excerpt: '',
    content: '',
    tags: '',
    readTime: '3 min',
    image: null,
  });

  const handleNewPostChange = (e) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewPostImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewPost((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSubmitPost = (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.excerpt || !newPost.content) return;
    const nextId = (posts[posts.length - 1]?.id || 0) + 1;
    const tagsArray = newPost.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const post = {
      id: nextId,
      title: newPost.title,
      excerpt: newPost.excerpt,
      content: newPost.content,
      author: 'You',
      publishedAt: new Date().toISOString(),
      tags: tagsArray,
      readTime: newPost.readTime || '3 min',
      image: newPost.image,
    };
    setPosts((prev) => [post, ...prev]);
    setNewPost({ title: '', excerpt: '', content: '', tags: '', readTime: '3 min', image: null });
  };

  const deletePost = (id) => {
    const ok = window.confirm('Delete this blog post?');
    if (!ok) return;
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setReadPostIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setExpandedPostIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };
  const personalInfo = {
    name: user?.name || 'John Doe',
    headline: user?.headline || 'Software Developer',
    location: user?.location || 'Bangalore, India',
    email: user?.email || '',
    phone: user?.phone || '',
    image: user?.avatar,
  };
  const socialLinks = user?.socialLinks || {};
  const completionPercentage = user?.profileCompletion || 0;

  return (
    <>
      <Navbar />
      <div className="user-profile-container">
        <div className="profile-layout">
          <UserProfileSidebar
            personalInfo={personalInfo}
            socialLinks={socialLinks}
            completionPercentage={completionPercentage}
          />

          <main className="profile-main">
            <div className="profile-main-header">
              <div>
                <h2>Your Blogs</h2>
                <p className="profile-main-subtitle">Share learnings, projects, and experiences</p>
              </div>
              <div className="profile-main-header-actions">
                <button className="profile-tab active">All</button>
                <button className="profile-tab">Drafts</button>
                <button className="profile-tab">Published</button>
              </div>
            </div>

            {/* Hero section */}
            <section className="blogs-hero">
              <div className="blogs-hero-content">
                <h1 className="blogs-hero-title">Craft, Share, and Grow</h1>
                <p className="blogs-hero-subtitle">
                  Document your journey—interviews, projects, and lessons learned. Your voice helps others and
                  showcases your skills.
                </p>
              </div>
              <div className="blogs-hero-stats">
                <div className="stat">
                  <span className="stat-value">{posts.length}</span>
                  <span className="stat-label">Posts</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{[...new Set(posts.flatMap(p => p.tags))].length}</span>
                  <span className="stat-label">Tags</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{[...readPostIds].length}</span>
                  <span className="stat-label">Read</span>
                </div>
              </div>
            </section>

            <div className="profile-sections">
              {/* Upload Blog Section */}
              <div className="profile-section">
                <h3>Upload Blog</h3>
                <form onSubmit={handleSubmitPost} className="blog-upload-form">
                  <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={newPost.title}
                    onChange={handleNewPostChange}
                  />
                  <input
                    type="text"
                    name="excerpt"
                    placeholder="Short summary (excerpt)"
                    value={newPost.excerpt}
                    onChange={handleNewPostChange}
                  />
                  <textarea
                    name="content"
                    placeholder="Write your blog content"
                    rows={5}
                    value={newPost.content}
                    onChange={handleNewPostChange}
                  />
                  <input
                    type="text"
                    name="tags"
                    placeholder="Tags (comma separated)"
                    value={newPost.tags}
                    onChange={handleNewPostChange}
                  />
                  <div className="blog-actions blog-upload-actions">
                    <label className="file-input-label">
                      <input type="file" accept="image/*" onChange={handleNewPostImage} />
                      <span>Upload cover image</span>
                    </label>
                    {newPost.image && (
                      <div className="upload-preview">
                        <img src={newPost.image} alt="Preview" />
                      </div>
                    )}
                  </div>
                  <div className="blog-actions">
                    <button type="submit" className="search-buttons card-buttons">Publish</button>
                    <button
                      type="button"
                      className="search-buttons card-buttons-outline"
                      onClick={() => setNewPost({ title: '', excerpt: '', content: '', tags: '', readTime: '3 min', image: null })}
                    >
                      Clear
                    </button>
                  </div>
                </form>
              </div>
              <div className="profile-section">
                <div className="blog-list">
                  {posts.map((post) => (
                    <article key={post.id} className="blog-card">
                      {post.image && (
                        <div className="blog-cover">
                          <img src={post.image} alt={post.title} />
                        </div>
                      )}
                      <div className="blog-card-body">
                        <div className="blog-card-header">
                          <h3 className="blog-title">{post.title}</h3>
                          <span className="blog-meta">
                            {formatTimeAgo(post.publishedAt)} · {post.readTime}
                          </span>
                        </div>
                        <p className="blog-excerpt">{post.excerpt}</p>
                        {expandedPostIds.has(post.id) && (
                          <div className="blog-content">
                            {post.content}
                          </div>
                        )}
                        <div className="blog-tags">
                          {post.tags.map((t) => (
                            <span key={t} className="blog-tag">{t}</span>
                          ))}
                        </div>
                        <div className="blog-actions">
                          <button
                            className={`search-buttons card-buttons ${expandedPostIds.has(post.id) ? 'applied' : ''}`}
                            onClick={() => toggleReadAndExpand(post.id)}
                          >
                            {expandedPostIds.has(post.id) ? 'Hide' : 'Read'}
                          </button>
                          {readPostIds.has(post.id) && (
                            <span className="blog-badge">Read</span>
                          )}
                          <button className="search-buttons card-buttons-outline">Edit</button>
                          <button
                            className="search-buttons card-buttons-outline danger"
                            onClick={() => deletePost(post.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
