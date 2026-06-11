import Comments from "@/components/Comments/Comments";
import Rating from "@/components/Comments/Rating";
import ReviewBox from "@/components/Comments/ReviewBox";
import VideoPlayer from "@/components/watch/VideoPlayer";
// import ReviewBox from "@/components/ReviewBox";
import { notFound } from "next/navigation";

export default async function WatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // -------------------------
  // FETCH MOVIE
  // -------------------------
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/media/${id}`,
    { cache: "no-store" }
  );

  const result = await res.json();
  const movie = result.data;

  if (!movie) notFound();

  // -------------------------
  // FETCH REVIEW
  // -------------------------
  const reviewRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/review/media/${movie.id}`,
    { cache: "no-store" }
  );

  const reviewData = await reviewRes.json();
  const reviews = reviewData.data || [];

  return (
    <>
      {/* ================= VIDEO ================= */}
      <section className="w-full pt-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl bg-black">

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

            <VideoPlayer
              mediaId={movie.id}
              videoUrl={movie.videoUrl}
            />
          </div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="max-w-5xl mx-auto px-4 py-10 space-y-10 text-white">

        {/* TITLE */}
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold">
            {movie.title}
          </h1>

          {/* META */}
          <div className="flex flex-wrap gap-3 text-xs text-gray-300">
            <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800">
              {movie.views?.toLocaleString()} views
            </span>

            <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800">
              {movie.duration} min
            </span>

            <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800">
              {movie.releaseYear}
            </span>

            <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/30">
              {movie.videoQuality}
            </span>
          </div>
        </div>

        {/* ================= RATING ================= */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">
            Rate this movie
          </h2>

          <Rating
            mediaId={movie.id}
            initialRating={movie.averageRating || 0}
          />
        </div>

        {/* ================= STORY ================= */}
        <div>
          <h3 className="text-2xl font-semibold mb-2">Story</h3>
          <p className="text-gray-300">
            {movie.synopsis}
          </p>
        </div>

        {/* ================= DETAILS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300 bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6">

          <p><span className="text-white">Director:</span> {movie.director || "N/A"}</p>
          <p><span className="text-white">Cast:</span> {movie.cast || "N/A"}</p>
          <p><span className="text-white">Type:</span> {movie.pricingType}</p>
          <p><span className="text-white">Rating:</span> {movie.averageRating || 0}/5</p>

        </div>

        {/* ================= REVIEWS ================= */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-6">

          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Reviews & Discussions
            </h2>
            <span className="text-xs text-gray-400">
              Community powered
            </span>
          </div>

          {/* 🔥 REVIEW BOX (WORKING) */}
          <ReviewBox movieId={movie.id} />

          {/* COMMENTS */}
          {reviews.length > 0 ? (
            reviews.map((review: any) => (
              <Comments key={review.id} reviewId={review.id} />
            ))
          ) : (
            <div className="text-gray-400 text-sm">
              No reviews yet — be the first to start the discussion.
            </div>
          )}

        </div>

      </section>
    </>
  );
}