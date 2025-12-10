"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AdminPage() {
  const router = useRouter();

  /* ─────────────── AUTH GUARD ─────────────── */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  const logout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  /* ─────────────── FORM STATE ─────────────── */
  const [formData, setFormData] = useState({
    name_of_event: "",
    event_domain: "",
    date_of_event: "",
    description_insights: "",
    time_of_event: "",
    faculty_coordinators: "",
    student_coordinators: "",
    venue: "",
    mode_of_event: "Offline",
    registration_fee: "0",
    speakers: "",
    perks: "",
    collaboration: "",
  });

  const [status, setStatus] = useState<{ type: "success" | "error" | ""; msg: string }>({
    type: "",
    msg: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ─────────────── SUBMIT ─────────────── */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", msg: "" });

    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/add-event`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setStatus({
        type: "success",
        msg: `Success! "${formData.name_of_event}" added.`,
      });
    } catch (error: any) {
      const errMsg =
        error.response?.data?.detail || "Submission failed";
      setStatus({ type: "error", msg: errMsg });
    } finally {
      setLoading(false);
    }
  };

  /* ─────────────── UI ─────────────── */
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Add New Event</h1>
          <div className="flex gap-4">
            <a href="/" className="text-blue-600 hover:underline">
              Back to Chat
            </a>
            <button
              onClick={logout}
              className="text-red-500 hover:underline text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {status.msg && (
          <div
            className={`p-4 mb-6 rounded ${
              status.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {status.msg}
          </div>
        )}

        {/* FORM (unchanged UI) */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Core Details */}
          <div className="col-span-2 border-b pb-2 mb-2 text-lg font-semibold">
            Core Details
          </div>

          <input name="name_of_event" required placeholder="Event Name" onChange={handleChange} className="input" />
          <input name="event_domain" required placeholder="Domain (AI/ML)" onChange={handleChange} className="input" />
          <input name="date_of_event" type="date" required onChange={handleChange} className="input" />
          <input name="time_of_event" placeholder="Time" onChange={handleChange} className="input" />

          {/* Logistics */}
          <div className="col-span-2 border-b pb-2 mt-4 text-lg font-semibold">
            Logistics
          </div>

          <input name="venue" placeholder="Venue" onChange={handleChange} className="input" />
          <select name="mode_of_event" onChange={handleChange} className="input">
            <option>Offline</option>
            <option>Online</option>
            <option>Hybrid</option>
          </select>
          <input name="registration_fee" type="number" defaultValue="0" onChange={handleChange} className="input" />
          <input name="collaboration" placeholder="Collaboration" onChange={handleChange} className="input" />

          {/* People */}
          <div className="col-span-2 border-b pb-2 mt-4 text-lg font-semibold">
            People
          </div>

          <input name="faculty_coordinators" placeholder="Faculty Coordinators" onChange={handleChange} className="input" />
          <input name="student_coordinators" placeholder="Student Coordinators" onChange={handleChange} className="input" />
          <input name="speakers" placeholder="Speakers" className="col-span-2 input" onChange={handleChange} />

          {/* Content */}
          <div className="col-span-2 border-b pb-2 mt-4 text-lg font-semibold">
            Content (For AI)
          </div>

          <textarea name="description_insights" required placeholder="Description & insights" onChange={handleChange} className="col-span-2 input h-32" />
          <textarea name="perks" placeholder="Perks" onChange={handleChange} className="col-span-2 input h-20" />

          <button
            type="submit"
            disabled={loading}
            className="col-span-2 bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving…" : "Submit Event"}
          </button>
        </form>
      </div>
    </div>
  );
}
