import { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaLinkedinIn, FaWhatsapp, FaTwitter, FaCopy, FaArrowLeft } from "react-icons/fa";
import { BiTimeFive, BiCalendar, BiUser } from "react-icons/bi";

const PostDetail = ({ posts = [] }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);

  // Find the current post
  const post = useMemo(() => {
    return posts.find((p) => p.id === id);
  }, [posts, id]);

  // Scroll to top on load/change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Track scroll progress for the top loading bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight === 0) return;
      const progress = (window.pageYOffset / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [id]);

  // Find related posts (exclude current, match categories, limit to 3)
  const relatedPosts = useMemo(() => {
    if (!post) return [];
    return posts
      .filter((p) => {
        if (p.id === post.id) return false;
        return p.categories.some((cat) => post.categories.includes(cat));
      })
      .slice(0, 3);
  }, [posts, post]);

  if (!post) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center text-center p-4">
        <div className="border border-red-500/30 bg-red-950/20 px-6 py-4 rounded-lg font-mono mb-6 max-w-md">
          <div className="text-red-500 font-bold text-sm uppercase tracking-widest mb-2">ERROR // RECORD NULL</div>
          <p className="text-xs text-red-200/70 leading-relaxed">
            The requested database log ID [{id}] could not be retrieved from the main mainframe. The document may have been purged or relocated.
          </p>
        </div>
        <Link
          to="/"
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-mono uppercase cursor-target transition-all"
        >
          Return to Terminal
        </Link>
      </div>
    );
  }

  // Format date
  const formattedDate = new Date(post.published).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Calculate Reading Time
  const calculateReadingTime = (htmlContent) => {
    const text = htmlContent.replace(/<[^>]*>/g, "");
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / 225);
  };

  const readingTime = calculateReadingTime(post.content);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  const shareText = encodeURIComponent(`Check out this article from CYSCOM: ${post.title}`);
  const shareUrl = encodeURIComponent(window.location.href);

  return (
    <div className="relative w-full pb-20 pt-10">
      {/* Top Scrolling Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 z-[99]"
        style={{ width: `${scrollProgress}%`, filter: "drop-shadow(0 0 4px #22d3ee)" }}
      />

      <div className="max-w-4xl mx-auto px-4 md:px-8">
        
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-xs font-mono text-blue-400/80 hover:text-white mb-8 transition-colors cursor-target group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> BACK TO ARCHIVES
        </button>

        {/* Article Header */}
        <header className="mb-10 space-y-6">
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {post.categories.map((cat, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase bg-blue-950/60 border border-blue-500/30 text-blue-300"
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-circular-web font-black text-white leading-tight">
            {post.title}
          </h1>

          {/* Meta Info Row */}
          <div className="flex flex-wrap items-center gap-4 py-4 border-y border-blue-950/50 font-mono text-xs text-blue-400/60">
            <div className="flex items-center gap-1.5">
              <BiUser className="text-base text-blue-400" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BiCalendar className="text-base text-blue-400" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BiTimeFive className="text-base text-blue-400" />
              <span>{readingTime} min read</span>
            </div>
          </div>

        </header>

        {/* Main Cover Image */}
        {post.thumbnail && (
          <div className="w-full aspect-[21/9] rounded-lg overflow-hidden border border-blue-900/30 bg-slate-950 mb-10 shadow-2xl">
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        )}

        {/* distraction-free article reader */}
        <article className="blog-html-content" dangerouslySetInnerHTML={{ __html: post.content }} />

        {/* Share Panel */}
        <div className="mt-16 pt-8 border-t border-blue-950/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h4 className="text-sm font-mono font-bold text-blue-400 uppercase tracking-widest mb-1">TRANSCEIVER LINK</h4>
            <p className="text-xs text-blue-50/50 font-mono">Broadcast this article with other agents.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
              target="_blank"
              rel="noreferrer"
              className="p-3 bg-blue-950/40 border border-blue-900/40 rounded-full text-blue-300 hover:text-white hover:border-blue-500 transition-all cursor-target text-sm"
              title="Share on LinkedIn"
            >
              <FaLinkedinIn />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
              target="_blank"
              rel="noreferrer"
              className="p-3 bg-blue-950/40 border border-blue-900/40 rounded-full text-blue-300 hover:text-white hover:border-blue-500 transition-all cursor-target text-sm"
              title="Share on Twitter"
            >
              <FaTwitter />
            </a>
            <a
              href={`https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`}
              target="_blank"
              rel="noreferrer"
              className="p-3 bg-blue-950/40 border border-blue-900/40 rounded-full text-blue-300 hover:text-white hover:border-blue-500 transition-all cursor-target text-sm"
              title="Share on WhatsApp"
            >
              <FaWhatsapp />
            </a>
            <button
              onClick={handleCopyLink}
              className={`p-3 rounded-full border transition-all cursor-target text-sm font-mono flex items-center gap-1.5 ${
                copySuccess 
                  ? "bg-green-950/20 border-green-500 text-green-400" 
                  : "bg-blue-950/40 border-blue-900/40 text-blue-300 hover:text-white hover:border-blue-500"
              }`}
              title="Copy link"
            >
              <FaCopy />
              {copySuccess && <span className="text-[10px]">COPIED</span>}
            </button>
          </div>
        </div>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <div className="mt-20 space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <h3 className="font-zentry text-xl tracking-wider uppercase text-white">Related Chronologies</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rPost) => {
                const rFormattedDate = new Date(rPost.published).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
                return (
                  <Link
                    key={rPost.id}
                    to={`/post/${rPost.id}`}
                    className="cyber-card group p-4 rounded-lg border border-blue-900/20 bg-[#020205] hover:border-blue-500/50 flex flex-col justify-between h-full cursor-target"
                  >
                    <div className="space-y-2">
                      <span className="text-[9px] font-mono text-blue-400">{rFormattedDate}</span>
                      <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-2 leading-snug">
                        {rPost.title}
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-blue-400/50 group-hover:text-blue-300 transition-all mt-4 inline-block">
                      READ ARCHIVE →
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PostDetail;
