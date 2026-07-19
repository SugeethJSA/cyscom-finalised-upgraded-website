import { useState, useEffect } from "react";

export const useBlogs = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load blogs:", err);
        setIsLoading(false);
      });
  }, []);

  return { posts, isLoading };
};
