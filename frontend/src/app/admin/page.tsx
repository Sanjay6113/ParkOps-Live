"use client";

import { useEffect, useMemo, useState } from "react";
import io from "socket.io-client";

type Ride = {
  id: number;
  name: string;
  zone: string;
  status: string;
  currentWaitTime: number | null;
  capacity?: number;
  coordinates?: { x: number; y: number } | null;
  settings?: { isVisible?: boolean };
};

type Alert = {
  id: number;
  rideId: number;
  severity: "info" | "warning" | "critical";
  message: string;
  createdAt: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

export default function AdminDashboard() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const socket = useMemo(() => io(`${API_BASE}/admin-alerts`), []);

  useEffect(() => {
    fetch(`${API_BASE}/rides`)
      .then((res) => res.json())
      .then(setRides)
      .catch((err) => console.error("Failed to load rides", err));

    fetch(`${API_BASE}/alerts`)
      .then((res) => res.json())
      .then(setAlerts)
      .catch((err) => console.error("Failed to load alerts", err));
  }, []);

  useEffect(() => {
    socket.on("alert", (alert: Alert) => {
      setAlerts((prev) => [alert, ...prev]);
    });
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const updateRideStatus = async (id: number, status: string) => {
    await fetch(`${API_BASE}/rides/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setRides((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const updateRideMeta = async (ride: Ride) => {
    setSaving(true);
    try {
      await fetch(`${API_BASE}/rides/${ride.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: ride.name,
          zone: ride.zone,
          capacity: ride.capacity,
          coordinates: ride.coordinates,
          settings: ride.settings,
        }),
      });
    } finally {
      setSaving(false);
    }
  };

  const updateRideState = (id: number, patch: Partial<Ride>) => {
    setRides((prev) => prev.map((ride) => (ride.id === id ? { ...ride, ...patch } : ride)));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-indigo-600">Admin</p>
            <h1 className="text-3xl font-bold">Command Center</h1>
            <p className="text-sm text-slate-600">Live rides and alert stream</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={editMode}
                onChange={(e) => setEditMode(e.target.checked)}
              />
              Enable editing
            </label>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-lg font-semibold">Rides</h2>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="grid grid-cols-6 gap-2 text-xs font-semibold text-slate-500">
                <span>Name</span>
                <span>Zone</span>
                <span>Status</span>
                <span>Wait</span>
                <span>Edit</span>
                <span>Actions</span>
              </div>
              <div className="mt-2 divide-y divide-slate-100">
                {rides.map((ride) => (
                  <div key={ride.id} className="grid grid-cols-6 items-center gap-2 py-2 text-sm">
                    <span className="font-medium">{ride.name}</span>
                    <span className="text-slate-600">{ride.zone}</span>
                    <span className="text-slate-700">{ride.status}</span>
                    <span className="text-slate-600">{ride.currentWaitTime ?? "-"} min</span>

                    <div className="flex flex-col gap-1 text-[11px] text-slate-600">
                      <div className="flex items-center gap-1">
                        <span className="w-14 text-xs text-slate-500">Cap.</span>
                        <input
                          type="number"
                          defaultValue={ride.capacity ?? ""}
                          onBlur={(e) => {
                            const capacity = e.target.value ? Number(e.target.value) : undefined;
                            updateRideState(ride.id, { capacity });
                            updateRideMeta({ ...ride, capacity });
                          }}
                          className="w-20 rounded border border-slate-200 px-2 py-1 text-xs focus:border-indigo-400 focus:outline-none"
                          disabled={!editMode || saving}
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-14 text-xs text-slate-500">Visible</span>
                        <input
                          type="checkbox"
                          checked={ride.settings?.isVisible ?? true}
                          onChange={(e) => {
                            const updatedSettings = { ...ride.settings, isVisible: e.target.checked };
                            updateRideState(ride.id, { settings: updatedSettings });
                            updateRideMeta({ ...ride, settings: updatedSettings });
                          }}
                          disabled={!editMode || saving}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 text-xs">
                      {(["operational", "maintenance", "closed", "inspection"] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => updateRideStatus(ride.id, s)}
                          className={`rounded-full px-2 py-1 border text-slate-700 hover:border-slate-400 ${ride.status === s ? "bg-slate-100" : "bg-white"}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500">
              Map placeholder (edit mode lets you drag pins to update coordinates)
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Alerts</h2>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm h-[520px] overflow-auto space-y-3">
              {alerts.length === 0 && <p className="text-sm text-slate-500">No alerts</p>}
              {alerts.map((alert) => (
                <div key={alert.id} className="rounded-lg border border-slate-100 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase text-slate-500">{alert.severity}</span>
                    <span className="text-[11px] text-slate-400">{new Date(alert.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <div className="mt-2 flex gap-2 text-xs">
                    <button
                      className="rounded border border-slate-200 px-3 py-1 font-medium text-slate-700 hover:bg-slate-50"
                      onClick={() => {
                        fetch(`${API_BASE}/alerts/${alert.id}/resolve`, { method: "POST" }).then(() => {
                          setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
                        });
                      }}
                    >
                      Resolve
                    </button>
                    <button
                      className="rounded border border-indigo-200 bg-indigo-50 px-3 py-1 font-medium text-indigo-700 hover:bg-indigo-100"
                      onClick={() => {
                        fetch(`${API_BASE}/alerts/${alert.id}/confirm`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ status: "inspection" }),
                        }).then(() => {
                          updateRideStatus(alert.rideId, "inspection");
                          setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
                        });
                      }}
                    >
                      Confirm & set Inspection
                    </button>
                  </div>
                  <p className="text-sm font-medium text-slate-800">Ride #{alert.rideId}</p>
                  <p className="text-sm text-slate-600">{alert.message}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}