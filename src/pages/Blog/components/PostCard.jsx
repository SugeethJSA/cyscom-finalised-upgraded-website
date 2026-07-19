import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  const { id, title, published, categories, content, author, thumbnail } = post;

  // Format Date
  const formattedDate = new Date(published).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Calculate Reading Time
  const calculateReadingTime = (htmlContent) => {
    const text = htmlContent.replace(/<[^>]*>/g, ""); // Strip HTML
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 225); // Average reading speed of 225 WPM
    return minutes;
  };

  const readingTime = calculateReadingTime(content);

  // Fallback image if thumbnail is missing
  const fallbackImage = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhdVW3RAmEz5mbBdQfUbYzTBfI4775Jcm9gVRFs0VkLV-s7E6pekpoEaJHNfJwjrLP_a2PzcoiH2QDOE3XnMiOzUrM99muxZ2wL06UdARc1pFxVImaA_GhmYRMCfGoaucMFxxDnRXtc0NItEpRh56XqVY4XgHA4PfX8Sbz20FRa2hLGQZRywin8uVvx08M9/w1200-h630-p-k-no-nu/image.png";

  return (
    <Link to={`/blog/post/${id}`} className="group block h-full">
      <div className="cyber-card flex flex-col h-full rounded-lg overflow-hidden border border-blue-900/30 hover:border-blue-400/50 bg-[#020205] transition-all duration-300">
        
        {/* Thumbnail Image */}
        <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
          <img
            src={thumbnail || fallbackImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = fallbackImage;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
          
          {/* Top Info overlay */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {categories.slice(0, 2).map((cat, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase bg-blue-950/80 border border-blue-500/40 text-blue-300"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col flex-grow p-5 justify-between">
          <div className="space-y-2.5">
            {/* Meta row */}
            <div className="flex items-center gap-3 text-[11px] font-mono text-blue-400/60">
              <span>{formattedDate}</span>
              <span className="w-1 h-1 rounded-full bg-blue-900/50"></span>
              <span>{readingTime} min read</span>
            </div>

            {/* Title */}
            <h3 className="text-base md:text-lg font-circular-web font-bold text-white leading-snug tracking-normal line-clamp-2 group-hover:text-blue-300 transition-colors">
              {title}
            </h3>

            {/* Excerpt */}
            <p className="text-xs text-blue-100/60 line-clamp-3 leading-relaxed font-light">
              {content.replace(/<[^>]*>/g, "").substring(0, 150)}...
            </p>
          </div>

          {/* Author info */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-blue-950/50">
            <div className="w-6 h-6 rounded-full bg-blue-950/60 border border-blue-800/40 flex items-center justify-center text-[10px] font-mono font-bold text-blue-300">
              {author[0]?.toUpperCase() || "C"}
            </div>
            <span className="text-[11px] font-mono text-blue-50/80">{author}</span>
          </div>

        </div>

      </div>
    </Link>
  );
};

export default PostCard;
