"use client";

import { useEffect, useState } from "react";

type Ride = {
  id: number;
  name: string;
  zone: string;
  status: string;
  currentWaitTime: number | null;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

export default function GuestPage() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [reportType, setReportType] = useState("status_mismatch");
  const [message, setMessage] = useState("");
  const [deviceHash, setDeviceHash] = useState<string>("guest-device" + Math.random().toString(36).slice(2));
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/rides?visible=true`)
      .then((res) => res.json())
      .then((data) => setRides(data))
      .catch((err) => setError("Failed to load rides"))
      .finally(() => setLoading(false));
  }, []);

  const openModal = (ride: Ride) => {
    setSelectedRide(ride);
    setShowModal(true);
  };

  const submitReport = async () => {
    if (!selectedRide) return;
    setSubmitting(true);
    try {
      await fetch(`${API_BASE}/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rideId: selectedRide.id,
          reportType,
          message,
          guestDeviceHash: deviceHash,
        }),
      });
      setToast("Report received. Thank you!");
      setShowModal(false);
      setMessage("");
    } catch (e) {
      setToast("Failed to send report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10">
        <header>
          <p className="text-sm font-semibold text-indigo-600">Guest Companion</p>
          <h1 className="text-3xl font-bold">Find rides and share feedback</h1>
          <p className="text-sm text-slate-600">Live status, wait times, and quick reporting.</p>
        </header>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-lg font-semibold">Rides</h2>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              {loading && <p className="text-sm text-slate-500">Loading rides...</p>}
              {error && <p className="text-sm text-red-500">{error}</p>}
              {!loading && rides.length === 0 && <p className="text-sm text-slate-500">No rides available.</p>}
              <div className="divide-y divide-slate-100">
                {rides.map((ride) => (
                  <div key={ride.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-semibold">{ride.name}</p>
                      <p className="text-xs text-slate-500">Zone: {ride.zone}</p>
                      <p className="text-xs text-slate-500">Status: {ride.status} · Wait: {ride.currentWaitTime ?? "-"} min</p>
                    </div>
                    <button
                      onClick={() => openModal(ride)}
                      className="rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1 text-sm font-medium text-indigo-700 hover:border-indigo-300 hover:bg-indigo-100"
                    >
                      Report issue
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Map</h2>
            <div className="h-[360px] rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500">
              Map placeholder (tap a ride to view details)
            </div>
          </div>
        </section>
      </div>

      {showModal && selectedRide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-2">Report issue for {selectedRide.name}</h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <p className="text-sm font-medium">What’s wrong?</p>
                <div className="space-y-1 text-sm text-slate-700">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="reportType"
                      value="status_mismatch"
                      checked={reportType === "status_mismatch"}
                      onChange={(e) => setReportType(e.target.value)}
                    />
                    Ride is closed (status mismatch)
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="reportType"
                      value="wait_time_mismatch"
                      checked={reportType === "wait_time_mismatch"}
                      onChange={(e) => setReportType(e.target.value)}
                    />
                    Wait time is much longer
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="reportType"
                      value="safety"
                      checked={reportType === "safety"}
                      onChange={(e) => setReportType(e.target.value)}
                    />
                    Safety concern
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Details (optional)</p>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
                  rows={3}
                  placeholder="Add any notes you heard or saw"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  onClick={submitReport}
                  disabled={submitting}
                  className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                >
                  {submitting ? "Sending..." : "Send report"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}