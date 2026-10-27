import { useEffect, useState } from "react";
import CreateTicketForm from "../components/CreateTicketForm";
import TicketComments from "../components/TicketComments";
import EmployeeProfile from "../components/EmployeeProfile";

function EmployeeDashboard({ onLogout }) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [ticketsError, setTicketsError] = useState("");

  const [expandedTicket, setExpandedTicket] = useState(null);

  const API_BASE = "const API_BASE = import.meta.env.VITE_API_URL;";

  // Fetch assigned assets
  useEffect(() => {
    const controller = new AbortController();

    const fetchAssets = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const response = await fetch(`${API_BASE}/api/assets/my-assets`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch assigned assets");
        }

        const data = await response.json();

        if (!controller.signal.aborted) {
          setAssets(data);
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

    fetchAssets();

    return () => controller.abort();
  }, []);

  // Fetch employee tickets
  useEffect(() => {
    const controller = new AbortController();

    const fetchTickets = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const response = await fetch(`${API_BASE}/api/tickets/my-tickets`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch support tickets");
        }

        const data = await response.json();

        if (!controller.signal.aborted) {
          setTickets(data);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setTicketsError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setTicketsLoading(false);
        }
      }
    };

    fetchTickets();

    return () => controller.abort();
  }, []);

  // Add a newly created ticket
  const handleTicketCreated = (newTicket) => {
    setTickets((previousTickets) => [
      {
        ...newTicket,
        relatedAsset:
          assets.find(
            (asset) =>
              asset._id ===
              (typeof newTicket.relatedAsset === "object"
                ? newTicket.relatedAsset?._id
                : newTicket.relatedAsset),
          ) || newTicket.relatedAsset,
      },
      ...previousTickets,
    ]);
  };

  // Dashboard statistics
  const totalAssets = assets.length;
  const totalTickets = tickets.length;

  const openTickets = tickets.filter(
    (ticket) => ticket.status === "open",
  ).length;

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "in progress",
  ).length;

  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === "resolved",
  ).length;

  const getStatusStyle = (status) => {
    switch (status) {
      case "open":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "in progress":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "resolved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "high":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "low":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const formatLabel = (value) => {
    if (!value) return "Not available";

    return value
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-indigo-700">
              AssetFlow
            </h1>

            <p className="mt-1 text-xs font-medium text-slate-500">
              Employee Workspace
            </p>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-8 px-5 py-8 sm:px-8">
        {/* Welcome */}
        <section>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Employee Dashboard
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Manage your assigned IT assets, create support requests, and track
            ticket progress.
          </p>
        </section>

        {/* Employee Profile */}
        <EmployeeProfile />

        {/* Statistics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            {
              label: "My Assets",
              value: loading ? "..." : totalAssets,
              color: "text-indigo-700",
            },
            {
              label: "Total Tickets",
              value: ticketsLoading ? "..." : totalTickets,
              color: "text-slate-900",
            },
            {
              label: "Open",
              value: ticketsLoading ? "..." : openTickets,
              color: "text-blue-700",
            },
            {
              label: "In Progress",
              value: ticketsLoading ? "..." : inProgressTickets,
              color: "text-amber-700",
            },
            {
              label: "Resolved",
              value: ticketsLoading ? "..." : resolvedTickets,
              color: "text-emerald-700",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {stat.label}
              </p>

              <p className={`mt-3 text-3xl font-extrabold ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </section>

        {/* Assigned Assets */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                My Assigned Assets
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                IT equipment currently assigned to you.
              </p>
            </div>

            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              {assets.length} Assets
            </span>
          </div>

          {loading ? (
            <p className="py-8 text-center text-sm text-slate-500">
              Loading assigned assets...
            </p>
          ) : error ? (
            <p
              role="alert"
              className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700"
            >
              {error}
            </p>
          ) : assets.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
              <p className="font-semibold text-slate-700">
                No assets assigned yet
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Your assigned IT equipment will appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {assets.map((asset) => (
                <article
                  key={asset._id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-5 transition hover:border-indigo-200 hover:shadow-sm"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-xl">
                      💻
                    </div>

                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {formatLabel(asset.status)}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    {asset.assetName}
                  </h3>

                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-500">Asset Tag</span>
                      <span className="font-medium text-slate-800">
                        {asset.assetTag}
                      </span>
                    </div>

                    <div className="flex justify-between gap-3">
                      <span className="text-slate-500">Category</span>
                      <span className="font-medium text-slate-800">
                        {formatLabel(asset.category)}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Create Ticket */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-900">
              Create Support Ticket
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Report an issue with your assigned IT equipment.
            </p>
          </div>

          <CreateTicketForm
            assets={assets}
            onTicketCreated={handleTicketCreated}
          />
        </section>

        {/* My Support Tickets */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                My Support Tickets
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Track the progress of your support requests.
              </p>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {tickets.length} Tickets
            </span>
          </div>

          {ticketsLoading ? (
            <p className="py-8 text-center text-sm text-slate-500">
              Loading support tickets...
            </p>
          ) : ticketsError ? (
            <p
              role="alert"
              className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700"
            >
              {ticketsError}
            </p>
          ) : tickets.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
              <p className="font-semibold text-slate-700">
                No support tickets yet
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Create your first support ticket using the form above.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <article
                  key={ticket._id}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                >
                  <div className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          {ticket.title}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          Created {formatDate(ticket.createdAt)}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${getPriorityStyle(
                            ticket.priority,
                          )}`}
                        >
                          {formatLabel(ticket.priority)} Priority
                        </span>

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(
                            ticket.status,
                          )}`}
                        >
                          {formatLabel(ticket.status)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
                      <div>
                        <p className="text-xs text-slate-500">Related Asset</p>

                        <p className="mt-1 font-semibold text-slate-800">
                          {ticket.relatedAsset?.assetName || "Unknown Asset"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">Category</p>

                        <p className="mt-1 font-semibold text-slate-800">
                          {formatLabel(ticket.category)}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setExpandedTicket(
                          expandedTicket === ticket._id ? null : ticket._id,
                        )
                      }
                      aria-expanded={expandedTicket === ticket._id}
                      className="mt-4 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
                    >
                      {expandedTicket === ticket._id
                        ? "Hide Conversation"
                        : "View Conversation"}
                    </button>
                  </div>

                  {expandedTicket === ticket._id && (
                    <div className="border-t border-slate-200 bg-slate-50 p-4">
                      <TicketComments ticketId={ticket._id} />
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default EmployeeDashboard;
