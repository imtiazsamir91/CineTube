
import MediaUploadForm from "@/components/admin/MediaUploadForm"; 
import { Film } from "lucide-react";

export default function ManageContentPage() {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          <Film size={24} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Upload New Media</h1>
      </div>

      
      <MediaUploadForm />
    </div>
  );
}