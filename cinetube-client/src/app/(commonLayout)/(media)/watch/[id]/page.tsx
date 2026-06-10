import Comments from "@/components/Comments/Comments";
import Rating from "@/components/Comments/Rating";
import VideoPlayer from "@/components/watch/VideoPlayer";


export default async function WatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/media/${id}`,
    {
      cache: "no-store",
    }
  );

  const result = await res.json();
  const movie = result.data;

  if (!movie) return <div>Movie not found!</div>;

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      {/* VIDEO PLAYER */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 bg-zinc-950">
        <VideoPlayer mediaId={movie.id} videoUrl={movie.videoLink} />
      </div>

      {/* DETAILS */}
      <div className="mt-10 space-y-6">
        <h1 className="text-5xl font-extrabold tracking-tight text-white">
          {movie.title}
        </h1>

        {/* RATING SECTION */}
        <Rating
          mediaId={movie.id}
          initialRating={movie.averageRating || 0}
        />

        <div className="flex flex-wrap gap-3">
          {movie.categories?.map((cat: string) => (
            <span
              key={cat}
              className="bg-red-900/30 text-red-400 px-3 py-1 rounded-full text-xs font-bold uppercase border border-red-900/50"
            >
              {cat}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 text-sm font-medium text-zinc-400">
          <span className="bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
            {movie.releaseYear}
          </span>
          <span className="bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
            {movie.videoQuality}
          </span>
          <span className="text-zinc-500">
            {movie.views} views
          </span>
          <span className="text-zinc-500">
            {movie.duration} mins
          </span>
        </div>

        <p className="text-zinc-300 text-lg leading-relaxed max-w-3xl">
          {movie.synopsis}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-zinc-800">
          <p className="text-zinc-400">
            Director:{" "}
            <span className="text-white font-semibold">
              {movie.director || "N/A"}
            </span>
          </p>

          <p className="text-zinc-400">
            Cast:{" "}
            <span className="text-white font-semibold">
              {movie.cast || "N/A"}
            </span>
          </p>

          <p className="text-zinc-400">
            Pricing:{" "}
            <span className="text-white font-semibold">
              {movie.pricingType}
            </span>
          </p>

          <p className="text-zinc-400">
            Rating:{" "}
            <span className="text-white font-semibold">
              {movie.averageRating || 0} / 5
            </span>
          </p>
        </div>

        {/* COMMENTS SECTION */}
        <div className="mt-12">
          <Comments reviewId={movie.id} />
        </div>
      </div>
    </main>
  );
}