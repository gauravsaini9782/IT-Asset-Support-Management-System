import { useEffect, useState } from "react";
import TicketPriority from "../components/TicketPriority";
import TicketAssignment from "../components/TicketAssignment";
import TicketStatus from "../components/TicketStatus";
import EmployeeEditForm from "../components/EmployeeEditForm";
import CreateAssetForm from "../components/CreateAssetForm";
import AssetEditForm from "../components/AssetEditForm";
import AssetAssignment from "../components/AssetAssignment";
import AssetUnassignment from "../components/AssetUnassignment";
import AssetArchive from "../components/AssetArchive";
import AssetRestore from "../components/AssetRestore";
import DeleteAsset from "../components/DeleteAsset";
import TicketComments from "../components/TicketComments";

const icons = {
  overview: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
  employees:
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  assets: "M4 4h16v12H4z M2 20h20 M9 16v4 M15 16v4",
  tickets:
    "M4 3h16a2 2 0 0 1 2 2v4a3 3 0 0 0 0 6v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a3 3 0 0 0 0-6V5a2 2 0 0 1 2-2z M13 5v2 M13 11v2 M13 17v2",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
  search: "m21 21-4.35-4.35 M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  menu: "M4 6h16 M4 12h16 M4 18h16",
  close: "M18 6 6 18 M6 6l12 12",
  arrow: "M5 12h14 M13 6l6 6-6 6",
};

function Icon({ name, size = 20, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={icons[name]} />
    </svg>
  );
}

const navigation = [
  { id: "overview", label: "Overview", icon: "overview" },
  { id: "employees", label: "Employees", icon: "employees" },
  { id: "assets", label: "IT Assets", icon: "assets" },
  { id: "tickets", label: "Support Tickets", icon: "tickets" },
];

function StatusBadge({ value }) {
  const status = String(value || "unknown").toLowerCase();
  const colors = {
    available: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    resolved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    assigned: "bg-blue-50 text-blue-700 ring-blue-200",
    "in-progress": "bg-blue-50 text-blue-700 ring-blue-200",
    open: "bg-amber-50 text-amber-700 ring-amber-200",
    high: "bg-rose-50 text-rose-700 ring-rose-200",
    archived: "bg-slate-100 text-slate-600 ring-slate-200",
    closed: "bg-slate-100 text-slate-600 ring-slate-200",
    inactive: "bg-slate-100 text-slate-600 ring-slate-200",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${colors[status] || "bg-slate-100 text-slate-600 ring-slate-200"}`}
    >
      {String(value || "Unknown").replaceAll("-", " ")}
    </span>
  );
}

function SectionHeading({ eyebrow, title, description, children }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">
          {eyebrow}
        </p>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      {children}
    </div>
  );
}

function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [assetStatusFilter, setAssetStatusFilter] = useState("all");

  // Employee states
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Administrator states
  const [admins, setAdmins] = useState([]);

  // Asset states
  const [assets, setAssets] = useState([]);
  const [assetsLoading, setAssetsLoading] = useState(true);
  const [assetsError, setAssetsError] = useState("");

  // Ticket states
  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [ticketsError, setTicketsError] = useState("");

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch employees");
        }

        const data = await response.json();
        setEmployees(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Fetch active administrators
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/admins`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch administrators");
        }

        const data = await response.json();
        setAdmins(data);
      } catch (err) {
        console.error("Administrator fetch error:", err.message);
      }
    };

    fetchAdmins();
  }, []);

  // Fetch all IT assets
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/assets`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch IT assets");
        }

        const data = await response.json();
        setAssets(data);
      } catch (err) {
        setAssetsError(err.message);
      } finally {
        setAssetsLoading(false);
      }
    };

    fetchAssets();
  }, []);

  // Fetch all support tickets
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/tickets`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch support tickets");
        }

        const data = await response.json();
        setTickets(data);
      } catch (err) {
        setTicketsError(err.message);
      } finally {
        setTicketsLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Update ticket priority in React state
  const handlePriorityUpdated = (ticketId, newPriority) => {
    setTickets((previousTickets) =>
      previousTickets.map((ticket) =>
        ticket._id === ticketId ? { ...ticket, priority: newPriority } : ticket,
      ),
    );
  };

  // Update ticket status in React state
  const handleStatusUpdated = (ticketId, newStatus) => {
    setTickets((previousTickets) =>
      previousTickets.map((ticket) =>
        ticket._id === ticketId ? { ...ticket, status: newStatus } : ticket,
      ),
    );
  };

  // Update assigned administrator in React state
  const handleAssignmentUpdated = (ticketId, selectedAdmin) => {
    setTickets((previousTickets) =>
      previousTickets.map((ticket) =>
        ticket._id === ticketId
          ? { ...ticket, assignedTo: selectedAdmin }
          : ticket,
      ),
    );
  };

  const handleEmployeeUpdated = (updatedEmployee) => {
    setEmployees((previousEmployees) =>
      previousEmployees.map((employee) =>
        employee._id === updatedEmployee._id ? updatedEmployee : employee,
      ),
    );
  };

  const handleAssetCreated = (newAsset) => {
    setAssets((previousAssets) => [newAsset, ...previousAssets]);
  };

  const handleAssetUpdated = (updatedAsset) => {
    setAssets((previousAssets) =>
      previousAssets.map((asset) =>
        asset._id === updatedAsset._id ? updatedAsset : asset,
      ),
    );
  };

  // Remove permanently deleted asset from the dashboard
  const handleAssetDeleted = (deletedAssetId) => {
    setAssets((previousAssets) =>
      previousAssets.filter((asset) => asset._id !== deletedAssetId),
    );
  };

  // Dashboard statistics
  const totalEmployees = employees.length;

  const totalAssets = assets.length;

  const assignedAssets = assets.filter(
    (asset) => asset.status === "assigned",
  ).length;

  const availableAssets = assets.filter(
    (asset) => asset.status === "available",
  ).length;

  const totalTickets = tickets.length;

  const openTickets = tickets.filter(
    (ticket) => ticket.status === "open",
  ).length;
  const archivedAssets = assets.filter(
    (asset) => asset.status === "archived",
  ).length;

  const normalizedSearch = search.trim().toLowerCase();
  const filteredEmployees = employees.filter((employee) =>
    [employee.name, employee.email, employee.department].some((value) =>
      String(value || "")
        .toLowerCase()
        .includes(normalizedSearch),
    ),
  );
  const filteredAssets = assets.filter(
    (asset) =>
      (assetStatusFilter === "all" || asset.status === assetStatusFilter) &&
      [
        asset.assetName,
        asset.assetTag,
        asset.category,
        asset.brand,
        asset.model,
      ].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(normalizedSearch),
      ),
  );
  const filteredTickets = tickets.filter((ticket) =>
    [
      ticket.title,
      ticket.description,
      ticket.category,
      ticket.createdBy?.name,
    ].some((value) =>
      String(value || "")
        .toLowerCase()
        .includes(normalizedSearch),
    ),
  );

  const navigate = (tab) => {
    setActiveTab(tab);
    setSearch("");
    setMobileMenuOpen(false);
  };

  const stats = [
    {
      label: "Total Employees",
      value: totalEmployees,
      icon: "employees",
      tone: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Total Assets",
      value: totalAssets,
      icon: "assets",
      tone: "bg-sky-50 text-sky-600",
    },
    {
      label: "Assigned Assets",
      value: assignedAssets,
      icon: "assets",
      tone: "bg-violet-50 text-violet-600",
    },
    {
      label: "Available Assets",
      value: availableAssets,
      icon: "assets",
      tone: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Archived Assets",
      value: archivedAssets,
      icon: "assets",
      tone: "bg-slate-100 text-slate-600",
    },
    {
      label: "Total Tickets",
      value: totalTickets,
      icon: "tickets",
      tone: "bg-orange-50 text-orange-600",
    },
    {
      label: "Open Tickets",
      value: openTickets,
      icon: "tickets",
      tone: "bg-rose-50 text-rose-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fb] font-sans text-slate-800">
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-[#101a32] text-white shadow-xl transition-transform duration-200 lg:translate-x-0 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-lg font-extrabold">
            IT
          </div>
          <div>
            <p className="text-base font-bold tracking-tight">AssetFlow</p>
            <p className="text-[11px] text-slate-400">IT Management System</p>
          </div>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileMenuOpen(false)}
            className="ml-auto text-slate-300 lg:hidden"
          >
            <Icon name="close" />
          </button>
        </div>
        <div className="px-4 pt-8">
          <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Workspace
          </p>
          <nav aria-label="Main navigation" className="space-y-1">
            {navigation.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.id)}
                aria-current={activeTab === item.id ? "page" : undefined}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${activeTab === item.id ? "bg-indigo-500 text-white shadow-lg shadow-indigo-950/20" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}
              >
                <Icon name={item.icon} size={19} />
                {item.label}
                {item.id === "tickets" && openTickets > 0 && (
                  <span className="ml-auto rounded-full bg-white/15 px-2 py-0.5 text-xs">
                    {openTickets}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto border-t border-white/10 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-400/20 font-bold text-indigo-200">
              AD
            </div>
            <div>
              <p className="text-sm font-semibold">Administrator</p>
              <p className="text-xs text-slate-400">Admin workspace</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <Icon name="logout" size={18} /> Sign out
          </button>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Open navigation"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <Icon name="menu" />
            </button>
            <div>
              <p className="text-xs font-medium text-slate-400">
                Workspace / Admin
              </p>
              <h1 className="text-lg font-bold text-slate-900">
                {navigation.find((item) => item.id === activeTab)?.label}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:inline-flex">
              ● Admin access
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
              AD
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-375 px-4 py-8 sm:px-8">
          {activeTab === "overview" && (
            <>
              <div className="mb-8 overflow-hidden rounded-2xl bg-linear-to-r from-[#1b2b54] via-[#283e7c] to-[#4f46a5] px-7 py-9 text-white shadow-lg sm:px-10">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-200">
                  Admin workspace
                </p>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Welcome back, Administrator
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-indigo-100">
                  Monitor your organization's IT assets, manage employee
                  accounts, and keep support requests on track.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("tickets")}
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-indigo-800 shadow-sm transition hover:bg-indigo-50"
                >
                  Manage tickets <Icon name="arrow" size={17} />
                </button>
              </div>

              <SectionHeading
                eyebrow="At a glance"
                title="Dashboard overview"
                description="A real-time snapshot of your IT operations."
              />
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-medium text-slate-500">
                        {stat.label}
                      </p>
                      <span className={`rounded-xl p-2.5 ${stat.tone}`}>
                        <Icon name={stat.icon} size={20} />
                      </span>
                    </div>
                    <p className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Current records
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-7 grid gap-6 xl:grid-cols-2">
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-lg font-bold">Recent IT Assets</h3>
                    <button
                      type="button"
                      onClick={() => navigate("assets")}
                      className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      View all →
                    </button>
                  </div>
                  {assetsLoading ? (
                    <p className="text-sm text-slate-500">Loading assets...</p>
                  ) : assetsError ? (
                    <p role="alert" className="text-sm text-rose-600">
                      {assetsError}
                    </p>
                  ) : assets.length === 0 ? (
                    <p className="text-sm text-slate-500">No assets yet.</p>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {assets.slice(0, 5).map((asset) => (
                        <div
                          key={asset._id}
                          className="flex items-center justify-between gap-3 py-3"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-800">
                              {asset.assetName}
                            </p>
                            <p className="text-xs text-slate-500">
                              {asset.assetTag}
                            </p>
                          </div>
                          <StatusBadge value={asset.status} />
                        </div>
                      ))}
                    </div>
                  )}
                </section>
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-lg font-bold">
                      Recent Support Tickets
                    </h3>
                    <button
                      type="button"
                      onClick={() => navigate("tickets")}
                      className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      View all →
                    </button>
                  </div>
                  {ticketsLoading ? (
                    <p className="text-sm text-slate-500">Loading tickets...</p>
                  ) : ticketsError ? (
                    <p role="alert" className="text-sm text-rose-600">
                      {ticketsError}
                    </p>
                  ) : tickets.length === 0 ? (
                    <p className="text-sm text-slate-500">No tickets yet.</p>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {tickets.slice(0, 5).map((ticket) => (
                        <div
                          key={ticket._id}
                          className="flex items-center justify-between gap-3 py-3"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-800">
                              {ticket.title}
                            </p>
                            <p className="text-xs text-slate-500">
                              {ticket.createdBy?.name || "Unknown employee"}
                            </p>
                          </div>
                          <StatusBadge value={ticket.status} />
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            </>
          )}

          {activeTab === "employees" && (
            <section>
              <SectionHeading
                eyebrow="People"
                title="Employee management"
                description="View employee records and manage account information."
              />
              <div className="mb-5 flex max-w-md items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <Icon name="search" size={18} className="text-slate-400" />
                <input
                  aria-label="Search employees"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search employees by name or email..."
                  className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
              </div>
              {loading ? (
                <p className="text-sm text-slate-500">Loading employees...</p>
              ) : error ? (
                <p role="alert" className="text-sm text-rose-600">
                  {error}
                </p>
              ) : filteredEmployees.length === 0 ? (
                <p className="rounded-xl bg-white p-6 text-sm text-slate-500">
                  No matching employees found.
                </p>
              ) : (
                <div className="grid gap-5 xl:grid-cols-2">
                  {filteredEmployees.map((employee) => (
                    <article
                      key={employee._id}
                      className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                      <div className="mb-5 flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 font-bold text-indigo-700">
                          {employee.name?.slice(0, 2).toUpperCase() || "EM"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-bold text-slate-900">
                            {employee.name}
                          </h3>
                          <p className="break-all text-sm text-slate-500">
                            {employee.email}
                          </p>
                        </div>
                        <StatusBadge
                          value={employee.accountStatus || "active"}
                        />
                      </div>
                      <div className="border-t border-slate-100 pt-4">
                        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                          Edit employee
                        </p>
                        <EmployeeEditForm
                          employee={employee}
                          onEmployeeUpdated={handleEmployeeUpdated}
                        />
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === "assets" && (
            <section>
              <SectionHeading
                eyebrow="Inventory"
                title="IT asset management"
                description="Create, update, assign, archive and restore company equipment."
              />
              <details className="group mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <summary className="cursor-pointer list-none text-sm font-bold text-indigo-700 marker:hidden">
                  ＋ Add new IT asset{" "}
                  <span className="float-right text-slate-400 group-open:rotate-180">
                    ⌄
                  </span>
                </summary>
                <div className="mt-5 border-t border-slate-100 pt-5">
                  <CreateAssetForm onAssetCreated={handleAssetCreated} />
                </div>
              </details>
              <div className="mb-5 flex flex-col gap-3 sm:flex-row">
                <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <Icon name="search" size={18} className="text-slate-400" />
                  <input
                    aria-label="Search assets"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by asset name, tag, brand..."
                    className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
                  />
                </div>
                <select
                  aria-label="Filter assets by status"
                  value={assetStatusFilter}
                  onChange={(event) => setAssetStatusFilter(event.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm"
                >
                  <option value="all">All statuses</option>
                  <option value="available">Available</option>
                  <option value="assigned">Assigned</option>
                  <option value="under repair">Under repair</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              {assetsLoading ? (
                <p className="text-sm text-slate-500">Loading assets...</p>
              ) : assetsError ? (
                <p role="alert" className="text-sm text-rose-600">
                  {assetsError}
                </p>
              ) : filteredAssets.length === 0 ? (
                <p className="rounded-xl bg-white p-6 text-sm text-slate-500">
                  No matching assets found.
                </p>
              ) : (
                <div className="grid gap-5 xl:grid-cols-2">
                  {filteredAssets.map((asset) => (
                    <article
                      key={asset._id}
                      className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="text-lg font-bold text-slate-900">
                            {asset.assetName}
                          </h3>
                          <p className="mt-1 text-xs font-medium text-slate-500">
                            {asset.assetTag}
                          </p>
                        </div>
                        <StatusBadge value={asset.status} />
                      </div>
                      <div className="mb-5 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4 text-sm">
                        <div>
                          <p className="text-xs text-slate-400">Category</p>
                          <p className="mt-1 font-medium">
                            {asset.category || "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Brand</p>
                          <p className="mt-1 font-medium">
                            {asset.brand || "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Model</p>
                          <p className="mt-1 font-medium">
                            {asset.model || "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Status</p>
                          <p className="mt-1 font-medium capitalize">
                            {asset.status}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4 border-t border-slate-100 pt-4">
                        <details className="rounded-xl bg-slate-50 p-3">
                          <summary className="cursor-pointer text-sm font-semibold text-indigo-700">
                            Edit asset details
                          </summary>
                          <div className="mt-4">
                            <AssetEditForm
                              asset={asset}
                              onAssetUpdated={handleAssetUpdated}
                            />
                          </div>
                        </details>
                        <AssetAssignment
                          asset={asset}
                          employees={employees}
                          onAssetUpdated={handleAssetUpdated}
                        />
                        <AssetUnassignment
                          asset={asset}
                          onAssetUpdated={handleAssetUpdated}
                        />
                        <AssetArchive
                          asset={asset}
                          onAssetUpdated={handleAssetUpdated}
                        />
                        <AssetRestore
                          asset={asset}
                          onAssetUpdated={handleAssetUpdated}
                        />
                        <DeleteAsset
                          asset={asset}
                          onAssetDeleted={handleAssetDeleted}
                        />
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === "tickets" && (
            <section>
              <SectionHeading
                eyebrow="Help desk"
                title="Support ticket management"
                description="Track issues, update priorities and assign support staff."
              />
              <div className="mb-5 flex max-w-md items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <Icon name="search" size={18} className="text-slate-400" />
                <input
                  aria-label="Search support tickets"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search tickets or employees..."
                  className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
              </div>
              {ticketsLoading ? (
                <p className="text-sm text-slate-500">Loading tickets...</p>
              ) : ticketsError ? (
                <p role="alert" className="text-sm text-rose-600">
                  {ticketsError}
                </p>
              ) : filteredTickets.length === 0 ? (
                <p className="rounded-xl bg-white p-6 text-sm text-slate-500">
                  No matching support tickets found.
                </p>
              ) : (
                <div className="grid gap-5 xl:grid-cols-2">
                  {filteredTickets.map((ticket) => (
                    <article
                      key={ticket._id}
                      className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg font-bold text-slate-900">
                            {ticket.title}
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-slate-500">
                            {ticket.description}
                          </p>
                        </div>
                        <StatusBadge value={ticket.status} />
                      </div>
                      <div className="mb-5 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4 text-sm">
                        <div>
                          <p className="text-xs text-slate-400">Reported by</p>
                          <p className="mt-1 font-medium">
                            {ticket.createdBy?.name || "Unknown"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">
                            Related asset
                          </p>
                          <p className="mt-1 font-medium">
                            {ticket.relatedAsset?.assetName || "Unknown"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Category</p>
                          <p className="mt-1 font-medium">
                            {ticket.category || "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Priority</p>
                          <div className="mt-1">
                            <StatusBadge value={ticket.priority} />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-5 border-t border-slate-100 pt-5">
                        <TicketPriority
                          ticket={ticket}
                          onPriorityUpdated={handlePriorityUpdated}
                        />
                        <TicketStatus
                          ticket={ticket}
                          onStatusUpdated={handleStatusUpdated}
                        />
                        <TicketAssignment
                          ticket={ticket}
                          admins={admins}
                          onAssignmentUpdated={handleAssignmentUpdated}
                        />
                        <div className="border-t border-slate-200 pt-5">
                          <TicketComments ticketId={ticket._id} />
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}
          <footer className="mt-10 border-t border-slate-200 pt-5 text-center text-xs text-slate-400">
            AssetFlow · IT Asset & Support Management System
          </footer>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
