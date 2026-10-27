import { useEffect, useState } from "react";

function TicketComments({ ticketId }) {
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const API_URL = `${import.meta.env.VITE_API_URL}/api/tickets/${ticketId}/comments`;

  // Fetch all comments for the selected ticket
  useEffect(() => {
    const controller = new AbortController();

    const fetchComments = async () => {
      setLoading(true);
      setError("");
      setComments([]);

      try {
        const token = sessionStorage.getItem("token");

        const response = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to load ticket comments");
        }

        const data = await response.json();

        if (!controller.signal.aborted) {
          setComments(data);
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

    fetchComments();

    return () => controller.abort();
  }, [API_URL]);

  // Submit a new comment
  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || submitting) return;

    setSubmitting(true);
    setError("");

    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: trimmedMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to post comment");
      }

      // Clear the input after successful submission
      setMessage("");

      // Reload comments to get author names and roles
      try {
        const updatedResponse = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!updatedResponse.ok) {
          throw new Error("Failed to refresh comments");
        }

        const updatedComments = await updatedResponse.json();
        setComments(updatedComments);
      } catch {
        setError(
          "Comment posted successfully, but the conversation could not be refreshed. Please reload the page.",
        );
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Format comment date and time
  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString("en-IE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Conversation Header */}
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Ticket Conversation
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Communicate with the employee and IT support team.
            </p>
          </div>

          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            {comments.length} {comments.length === 1 ? "Message" : "Messages"}
          </span>
        </div>
      </div>

      {/* Comments List */}
      <div className="max-h-96 overflow-y-auto bg-slate-50/50 p-5">
        {loading ? (
          <div
            role="status"
            className="py-10 text-center text-sm text-slate-500"
          >
            Loading conversation...
          </div>
        ) : comments.length === 0 ? (
          <div className="py-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-xl">
              💬
            </div>

            <p className="mt-3 text-sm font-semibold text-slate-800">
              No comments yet
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Be the first to start the conversation.
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {comments.map((comment) => {
              const authorName = comment.author?.name || "Unknown User";

              const isAdmin = comment.author?.role === "admin";

              return (
                <li
                  key={comment._id}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    {/* Author Avatar */}
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        isAdmin
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {authorName.charAt(0).toUpperCase()}
                    </div>

                    {/* Comment Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900">
                          {authorName}
                        </span>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                            isAdmin
                              ? "bg-indigo-50 text-indigo-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {isAdmin ? "IT Support" : "Employee"}
                        </span>
                      </div>

                      <p className="mt-2 whitespace-pre-wrap wrap-break-words text-sm leading-6 text-slate-700">
                        {comment.message}
                      </p>

                      <p className="mt-3 text-xs text-slate-400">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div
          role="alert"
          className="mx-5 mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {error}
        </div>
      )}

      {/* Add Comment Form */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-slate-200 bg-white p-5"
      >
        <label
          htmlFor={`comment-${ticketId}`}
          className="mb-2 block text-sm font-semibold text-slate-800"
        >
          Add a Comment
        </label>

        <textarea
          id={`comment-${ticketId}`}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Write your message here..."
          rows={3}
          required
          disabled={submitting}
          className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:opacity-60"
        />

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            Visible to the employee and IT support team.
          </p>

          <button
            type="submit"
            disabled={submitting || !message.trim()}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Posting..." : "Post Comment"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TicketComments;
