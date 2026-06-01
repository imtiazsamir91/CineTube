import Link from "next/link";

export default function AllMovies({ mediaList }: { mediaList: any[] }) {
  return (
    <div className="w-full px-6 md:px-12 py-10">
      <h2 className="text-2xl font-bold text-white mb-6">Latest Movies</h2>
      
     
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {mediaList.map((movie) => (
          <Link 
            href={`/watch/${movie.id}`} 
            key={movie.id}
            className="group block w-full"
          >
            <div className="aspect-[2/3] overflow-hidden rounded-lg border border-zinc-800 shadow-lg transition-transform group-hover:scale-105">
              <img 
                src={movie.posterUrl} 
                alt={movie.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="mt-3 text-white font-medium truncate">{movie.title}</h3>
            <p className="text-zinc-500 text-sm">{movie.releaseYear}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}