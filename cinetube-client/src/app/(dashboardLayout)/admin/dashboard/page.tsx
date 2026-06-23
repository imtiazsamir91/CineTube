import React from "react";
import AdminDashboardView from "@/components/admin/AdminDashboardView"; // আপনার সঠিক ইমপোর্ট পাথ ব্যবহার করুন

export const metadata = {
  title: "Admin Dashboard - Platform Stats",
  description: "Overview of user engagement, media stats, and metrics.",
};

export default function AdminDashboardPage() {
  return <AdminDashboardView />;
}