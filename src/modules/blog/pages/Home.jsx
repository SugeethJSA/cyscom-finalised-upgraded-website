import { useState, useMemo, useEffect } from "react";
import PostCard from "../components/PostCard";
import { BiSearch } from "react-icons/bi";
import { FaTag, FaEnvelope } from "react-icons/fa";

const Home = ({ posts = [], exploreSectionRef }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [email, setEmail] = useState("");
  const [subSuccess, setSubSuccess] = useState(false);
  const postsPerPage = 6;

  // Reset page on search or tag change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedTag]);

  // Extract all categories/tags and compute counts
  const tagStats = useMemo(() => {
    const counts = {};
    posts.forEach((post) => {
      post.categories.forEach((cat) => {
        const cleaned = cat.trim();
        if (cleaned) {
          counts[cleaned] = (counts[cleaned] || 0) + 1;
        }
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12); // Display top 12 tags
  }, [posts]);

  // Filter posts based on search query and selected tag
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = selectedTag
        ? post.categories.map((c) => c.trim().toLowerCase()).includes(selectedTag.trim().toLowerCase())
        : true;
      return matchesSearch && matchesTag;
    });
  }, [posts, searchQuery, selectedTag]);

  // Featured Posts (top 3 from the full list)
  const featuredPosts = useMemo(() => {
    return posts.slice(0, 3);
  }, [posts]);

  // Paginated Posts
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    return filteredPosts.slice(startIndex, startIndex + postsPerPage);
  }, [filteredPosts, currentPage]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubSuccess(true);
    setEmail("");
    setTimeout(() => setSubSuccess(false), 5000);
  };

  return (
    <div className="w-full pb-20">
      
      {/* Featured Bento Section */}
      {searchQuery === "" && !selectedTag && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 mt-10">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <h2 className="font-zentry text-2xl tracking-wider uppercase text-white">Featured Broadcasts</h2>
          </div>
          
          {/* Bento Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Primary Large Card */}
            {featuredPosts[0] && (
              <div className="lg:col-span-2 h-full">
                <PostCard post={featuredPosts[0]} />
              </div>
            )}
            
            {/* Sidebar list of two smaller featured cards */}
            <div className="flex flex-col gap-6">
              {featuredPosts.slice(1, 3).map((post) => (
                <div key={post.id} className="flex-grow">
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          </div>
          
          <div className="section-divider my-12 opacity-30" />
        </section>
      )}

      {/* Main Content Grid & Filter Section */}
      <section ref={exploreSectionRef} className="max-w-7xl mx-auto px-4 md:px-8 scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Side: Filter Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Search Box */}
            <div className="relative border border-blue-900/30 rounded-lg p-4 bg-slate-950/20 backdrop-blur-sm">
              <h3 className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <BiSearch className="text-base" /> Query Database
              </h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search cipher logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-black border border-blue-900/40 rounded text-sm text-blue-100 placeholder-blue-600/50 focus:border-blue-500/80 outline-none transition-colors font-mono cursor-target"
                />
              </div>
            </div>

            {/* Tag List Box */}
            <div className="border border-blue-900/30 rounded-lg p-4 bg-slate-950/20 backdrop-blur-sm">
              <h3 className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <FaTag /> Hot Tags
              </h3>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => setSelectedTag("")}
                  className={`text-left text-xs font-mono py-1.5 px-3 rounded transition-all flex justify-between items-center cursor-target ${
                    !selectedTag 
                      ? "bg-blue-600 text-white font-semibold shadow-lg" 
                      : "text-blue-50 hover:bg-blue-950/30 hover:text-white"
                  }`}
                >
                  <span>ALL BROADCASTS</span>
                  <span>{posts.length}</span>
                </button>
                {tagStats.map(([tag, count]) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`text-left text-xs font-mono py-1.5 px-3 rounded transition-all flex justify-between items-center cursor-target ${
                      selectedTag.toLowerCase() === tag.toLowerCase()
                        ? "bg-blue-600 text-white font-semibold shadow-lg"
                        : "text-blue-50/80 hover:bg-blue-950/30 hover:text-white"
                    }`}
                  >
                    <span className="truncate mr-2"># {tag.toUpperCase()}</span>
                    <span className="text-[10px] text-blue-400/80 bg-blue-950/40 px-1.5 py-0.5 rounded border border-blue-900/20">{count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="border border-blue-900/30 rounded-lg p-4 bg-slate-950/20 backdrop-blur-sm relative overflow-hidden">
              <h3 className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <FaEnvelope /> Uplink Intel
              </h3>
              <p className="text-[11px] font-mono text-blue-50/60 leading-relaxed mb-4">
                Subscribe to receive bi-weekly cybersecurity reports and challenge writeups directly to your inbox.
              </p>
              
              {subSuccess ? (
                <div className="p-2 border border-green-500/30 bg-green-950/20 rounded text-center text-green-400 font-mono text-[10px] animate-pulse">
                  SECURE UPLINK ESTABLISHED
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                  <input
                    type="email"
                    placeholder="agent@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-black border border-blue-900/40 rounded text-xs text-blue-100 placeholder-blue-600/50 focus:border-blue-500/80 outline-none transition-colors font-mono cursor-target"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] uppercase font-mono tracking-wider font-semibold cursor-target transition-all"
                  >
                    Subscribe Uplink
                  </button>
                </form>
              )}
            </div>

          </div>

          {/* Right Side: Posts Grid & Feed */}
          <div className="lg:col-span-3 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-blue-950/50 pb-4">
              <div>
                <h2 className="text-xl font-bold font-circular-web text-white uppercase tracking-wider">
                  {selectedTag ? `Topic: ${selectedTag}` : "Archived Chronicles"}
                </h2>
                <p className="text-[11px] font-mono text-blue-400/60">
                  Showing {filteredPosts.length} matches of {posts.length} records
                </p>
              </div>

              {/* Reset filter helper */}
              {(searchQuery || selectedTag) && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedTag("");
                  }}
                  className="px-3 py-1 text-[10px] font-mono border border-blue-500/30 rounded text-blue-300 hover:bg-blue-950/30 cursor-target"
                >
                  RESET FILTERS
                </button>
              )}
            </div>

            {/* Post Feed Grid */}
            {paginatedPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paginatedPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center border border-dashed border-blue-900/20 rounded-lg bg-black/40">
                <p className="text-sm font-mono text-blue-400/50">NO SIGNALS DETECTED IN THIS FREQUENCY</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedTag("");
                  }}
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-mono uppercase cursor-target"
                >
                  Scan General Feed
                </button>
              </div>
            )}

            {/* Custom Cybernetic Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-blue-950/50 pt-6 font-mono text-xs">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-blue-900/40 rounded text-blue-300 hover:border-blue-500 hover:bg-blue-950/20 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-blue-900/40 cursor-target transition-all"
                >
                  &lt; PREV UPLINK
                </button>
                
                <span className="text-blue-400/60">
                  PAGE {currentPage} OF {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-blue-900/40 rounded text-blue-300 hover:border-blue-500 hover:bg-blue-950/20 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-blue-900/40 cursor-target transition-all"
                >
                  NEXT UPLINK &gt;
                </button>
              </div>
            )}

          </div>

        </div>
      </section>
      
    </div>
  );
};

export default Home;
