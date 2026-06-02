"use client";

import { getMedias } from "@/service/mediaService";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function MoviesPage() {

  console.log("MoviesPage: Component initialized");
  
  const searchParams = useSearchParams();
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    
    console.log("MoviesPage: useEffect triggered");

    const fetchMovies = async () => {
      setLoading(true);
      try {
        const params = {
          search: searchParams.get("search") || "",
          categories: searchParams.get("categories") || "",
          page: searchParams.get("page") || "1"
        };
        
       
        
        const data = await getMedias(params);
        
        console.log("MoviesPage: Received data:", data); 
        
        setMovies(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("MoviesPage: Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovies();
  }, [searchParams]);

  return (
    <div className="p-4 bg-white min-h-screen">
      <h1 className="text-xl font-bold mb-4">Movies List</h1>
      
      {loading ? (
        <p>Loading movies...</p>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {movies.length > 0 ? (
            movies.map((movie: any) => (
              <div key={movie.id || Math.random()} className="p-4 border border-gray-300 rounded shadow-md">
                <h2 className="font-bold text-lg">{movie.title || "No Title"}</h2>
                <p className="text-sm text-gray-500">{movie.category || "No Category"}</p>
                <pre className="text-[10px] bg-gray-100 p-1 mt-2">ID: {movie.id}</pre>
              </div>
            ))
          ) : (
            <p>No movies found. Make sure API is returning data in the expected format.</p>
          )}
        </div>
      )}
    </div>
  );
}