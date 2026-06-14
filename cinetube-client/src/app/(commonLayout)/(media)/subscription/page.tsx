// import SubscriptionFlow from "@/components/subscription/SubscriptionFlow";

import SubscriptionFlow from "@/components/Subscription/SubscriptionFlow";

export default function SubscriptionPage() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Upgrade to Premium
        </h1>
        <p className="text-zinc-400 text-center mb-8">
          Unlock unlimited access to all movies and ad-free streaming.
        </p>
        
        {/* আপনার সাবস্ক্রিপশন কম্পোনেন্ট */}
        <SubscriptionFlow />
      </div>
    </main>
  );
}