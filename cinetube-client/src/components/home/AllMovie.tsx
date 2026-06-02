import Link from "next/link";
import { Play, Film } from "lucide-react"; // Film আইকন যোগ করেছি

export default function AllMovies({ mediaList }: { mediaList?: any[] }) {
  const list = Array.isArray(mediaList) ? mediaList : [];

  return (
    <div className="w-full px-6 md:px-12 py-10">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        Latest Movies 🎬
      </h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {list.map((movie) => (
          <Link 
            href={`/watch/${movie.id}`} 
            key={movie.id}
            className="group relative block transition-all duration-300 hover:-translate-y-2"
          >
           
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800 shadow-xl">
              <img 
                src={movie.posterUrl} 
                alt={movie.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                 <div className="bg-[#B9090B] p-2.5 rounded-full shadow-lg">
                  <Play className="fill-white text-white w-4 h-4" />
                </div>
              </div>
            </div>

           
            <div className="mt-3">
              <h3 className="text-[14px] text-white font-semibold tracking-wide truncate group-hover:text-[#B9090B] transition-colors flex items-center gap-1.5">
             
                <Film className="w-3 h-3 text-[#B9090B]" />
                {movie.title}
              </h3>
              <p className="text-[11px] text-zinc-500 uppercase tracking-widest mt-0.5 ml-4.5">
                {movie.releaseYear || "2026"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}