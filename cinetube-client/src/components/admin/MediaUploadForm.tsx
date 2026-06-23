"use client";

import React, { useState } from "react";
import { createMedia } from "@/service/mediaService";
import { Upload, AlertCircle, CheckCircle2 } from "lucide-react";

export default function MediaUploadForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const form = e.currentTarget;
    

    const rawFormData = new FormData(form);
    const formData = new FormData();

   
    formData.append("title", rawFormData.get("title") as string);
    formData.append("synopsis", rawFormData.get("synopsis") as string);
    formData.append("releaseYear", rawFormData.get("releaseYear") as string);
    formData.append("duration", (rawFormData.get("duration") as string) || "0");
    
    const director = rawFormData.get("director") as string;
    if (director) formData.append("director", director);

    const cast = rawFormData.get("cast") as string;
    if (cast) formData.append("cast", cast);

    formData.append("pricingType", rawFormData.get("pricingType") as string);
    formData.append("videoQuality", rawFormData.get("videoQuality") as string);
    
    
    const categoriesValue = rawFormData.get("categories") as string;
    if (categoriesValue) {
      const categoriesArray = categoriesValue.split(",").map(c => c.trim()).filter(Boolean);
      formData.append("categories", JSON.stringify(categoriesArray));
    } else {
      formData.append("categories", JSON.stringify([]));
    }

   
    const coverImageFile = (form.elements.namedItem("coverImage") as HTMLInputElement).files?.[0];
    const videoFile = (form.elements.namedItem("videoFile") as HTMLInputElement).files?.[0];

    if (coverImageFile) formData.append("coverImage", coverImageFile);
    if (videoFile) formData.append("videoFile", videoFile);

    try {
      await createMedia(formData);
      setMessage({ type: "success", text: "Media created successfully with Cloudinary links!" });
      form.reset();
    } catch (err: any) {
    
      const serverError = err?.response?.data?.message || err.message || "Failed to upload media.";
      setMessage({ type: "error", text: serverError });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-xl flex items-center space-x-3 ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {message.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title & Release Year */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Movie/Series Title *</label>
            <input type="text" name="title" required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm" placeholder="e.g., Inception" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Release Year *</label>
            <input type="number" name="releaseYear" required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm" placeholder="2026" />
          </div>
        </div>

        {/* Synopsis */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Synopsis / Description *</label>
          <textarea name="synopsis" required rows={4} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm" placeholder="Write a short summary..."></textarea>
        </div>

        {/* Director, Cast & Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Director</label>
            <input type="text" name="director" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm" placeholder="Christopher Nolan" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Cast (Comma separated)</label>
            <input type="text" name="cast" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm" placeholder="Leonardo, Cillian Murphy" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Categories / Genres</label>
            <input type="text" name="categories" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm" placeholder="Sci-Fi, Action, Thriller" />
          </div>
        </div>

        {/* Pricing, Quality & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Pricing Type</label>
            <select name="pricingType" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm bg-white">
              <option value="FREE">Free</option>
              <option value="PREMIUM">Premium</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Video Quality</label>
            <select name="videoQuality" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm bg-white">
              <option value="SD">SD</option>
              <option value="HD">HD</option>
              <option value="FHD">Full HD (1080p)</option>
              <option value="4K">4K Ultra HD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Duration (Minutes)</label>
            <input type="number" name="duration" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm" placeholder="148" />
          </div>
        </div>

        {/* File Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 hover:border-indigo-500/50 transition-colors bg-gray-50/50">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Poster Image *</label>
            <input type="file" name="coverImage" accept="image/*" required className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 cursor-pointer" />
          </div>
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 hover:border-indigo-500/50 transition-colors bg-gray-50/50">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Video File (Movie/Trailer) *</label>
            <input type="file" name="videoFile" accept="video/*" required className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 cursor-pointer" />
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 disabled:bg-indigo-400 disabled:cursor-not-allowed">
          <Upload size={18} />
          <span>{loading ? "Uploading to Cloudinary & Saving..." : "Publish Media"}</span>
        </button>
      </form>
    </div>
  );
}