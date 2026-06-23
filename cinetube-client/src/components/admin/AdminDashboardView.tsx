"use client";

import React, { useEffect, useState } from "react";
import { getAdminDashboardMeta, getTrendingAnalytics } from "@/service/dashboardService";
import { Users, Film, Eye, MessageSquare, TrendingUp, Star } from "lucide-react";

export default function AdminDashboardView() {
  const [stats, setStats] = useState<any>(null);
  const [trending, setTrending] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, trendingData] = await Promise.all([
          getAdminDashboardMeta(),
          getTrendingAnalytics(5),
        ]);
        setStats(statsData);
        setTrending(trendingData);
      } catch (err: any) {
        setError(err.message || "Something went wrong while fetching data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div className="p-8 text-center text-lg font-semibold">Loading Dashboard...</div>;
  if (error) return <div className="p-8 text-center text-red-500 font-semibold">Error: {error}</div>;

  const { summary, graphData } = stats || {};
  const { mostViewed, mostReviewed } = trending || {};

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>

     
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Users size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Users</p>
            <h3 className="text-2xl font-bold text-gray-800">{summary?.totalUsers ?? 0}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg"><Film size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Media Items</p>
            <h3 className="text-2xl font-bold text-gray-800">{summary?.totalMedia ?? 0}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><Eye size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Platform Views</p>
            <h3 className="text-2xl font-bold text-gray-800">{summary?.totalPlatformViews ?? 0}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg"><MessageSquare size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Reviews</p>
            <h3 className="text-2xl font-bold text-gray-800">{summary?.totalReviews ?? 0}</h3>
          </div>
        </div>
      </div>

      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">User Registrations (Last 7 Days)</h2>
        <div className="overflow-x-auto">
          <div className="flex space-x-4 pb-2">
            {!graphData || graphData.length === 0 ? (
              <p className="text-gray-500 text-sm p-2">No new registrations in the last 7 days.</p>
            ) : (
              graphData.map((item: any, idx: number) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-lg text-center min-w-[120px] border border-gray-100">
                  <p className="text-xs text-gray-500">{item.date}</p>
                  <p className="text-xl font-bold text-indigo-600 mt-1">
                    {item.count} <span className="text-xs font-normal text-gray-400">new</span>
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

     
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Most Viewed */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 mb-4 text-orange-600">
            <TrendingUp size={20} />
            <h2 className="text-lg font-semibold text-gray-800">Most Viewed Media</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {!mostViewed || mostViewed.length === 0 ? (
              <p className="text-gray-500 text-sm py-4">No data available</p>
            ) : (
              mostViewed.map((media: any) => (
                <div key={media.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center space-x-3">
                    <img src={media.posterUrl || "/placeholder.jpg"} alt={media.title} className="w-10 h-14 object-cover rounded-md bg-gray-100" />
                    <div>
                      <h4 className="font-medium text-gray-800 text-sm">{media.title}</h4>
                      <p className="text-xs text-gray-400">{media.releaseYear}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-600">{(media.views ?? 0).toLocaleString()} views</span>
                </div>
              ))
            )}
          </div>
        </div>

  
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 mb-4 text-indigo-600">
            <Star size={20} />
            <h2 className="text-lg font-semibold text-gray-800">Most Reviewed Media</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {!mostReviewed || mostReviewed.length === 0 ? (
              <p className="text-gray-500 text-sm py-4">No data available</p>
            ) : (
              mostReviewed.map((media: any) => (
                <div key={media.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center space-x-3">
                    <img src={media.posterUrl || "/placeholder.jpg"} alt={media.title} className="w-10 h-14 object-cover rounded-md bg-gray-100" />
                    <div>
                      <h4 className="font-medium text-gray-800 text-sm">{media.title}</h4>
                      <div className="flex items-center space-x-2 mt-0.5">
                        <span className="text-xs text-gray-400">{media.releaseYear}</span>
                        {media.pricingType && (
                          <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 uppercase font-bold">{media.pricingType}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">{media.reviewCount ?? 0} Reviews</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}