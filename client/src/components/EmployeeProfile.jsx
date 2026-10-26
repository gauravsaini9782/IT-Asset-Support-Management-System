import { useEffect, useState } from "react";

function EmployeeProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load employee profile");
        }

        const data = await response.json();

        if (!controller.signal.aborted) {
          setProfile(data.user);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Loading your profile...
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700"
      >
        {error || "Profile information is unavailable."}
      </div>
    );
  }

  const initials = (profile.name || "Employee")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-white p-6">
        <h2 className="text-xl font-bold text-slate-900">My Profile</h2>
        <p className="mt-1 text-sm text-slate-500">
          Your employee account information
        </p>
      </div>

      <div className="p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-bold text-white">
            {initials}
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {profile.name || "Employee"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {profile.email || "No email available"}
            </p>
          </div>

          <span className="ml-auto rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
            {profile.accountStatus || "Unknown"}
          </span>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            ["Full Name", profile.name],
            ["Email Address", profile.email],
            ["Department", profile.department],
            ["Account Role", profile.role],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <p className="text-xs font-medium text-slate-500">{label}</p>
              <p className="mt-2 break-words text-sm font-semibold capitalize text-slate-900">
                {value || "Not provided"}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs text-slate-500">
          Profile details are securely retrieved from your employee account.
        </p>
      </div>
    </section>
  );
}

export default EmployeeProfile;
