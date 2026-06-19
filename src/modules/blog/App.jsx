import "./index.css";
import { useState, useRef, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Hero from "./components/Hero";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";


function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const exploreSectionRef = useRef(null);

  // Fetch posts dynamically
  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    fetch(`${API_URL}/blogs`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load blog logs");
        return res.json();
      })
      .then((data) => {
        const mappedPosts = data.blogs.map(b => ({
          id: b.slug,
          title: b.title,
          published: b.published_at || b.created_at,
          thumbnail: b.cover_image_url,
          content: b.content_markdown,
          categories: b.tags || [],
          author: b.author || "CySCOM"
        }));
        // Sort posts by date descending
        mappedPosts.sort((a, b) => new Date(b.published) - new Date(a.published));
        setPosts(mappedPosts);
      });
  }, []);

  const handleExplore = () => {
    exploreSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-black text-blue-50">
      {/* Router Content Area */}
      <div className="pt-24 min-h-screen">
        <Routes>
          
          {/* Home Feed Route */}
          <Route 
            path="/" 
            element={
              <>
                <Hero onExplore={handleExplore} />
                <Home posts={posts} exploreSectionRef={exploreSectionRef} />
              </>
            } 
          />

          {/* Single Post Reader Route */}
          <Route 
            path="post/:id" 
            element={<PostDetail posts={posts} />} 
          />

        </Routes>
      </div>
    </main>
  );
}

export default App;
