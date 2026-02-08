const API_URL = "http://localhost:3000/complaints";

const showNotification = (message, type = "success") => {
  const notif = document.getElementById("notification");
  notif.textContent = message;
  notif.className = `notification show`;
  if (type === "error") notif.style.borderLeftColor = "var(--danger)";
  else notif.style.borderLeftColor = "var(--primary)";
};

const initTheme = () => {
  const savedTheme = localStorage.getItem("theme") || "dark";
  const toggleBtn = document.getElementById("themeToggle");

  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
    if (toggleBtn) toggleBtn.textContent = "☀️";
  } else {
    document.body.classList.remove("light-mode");
    if (toggleBtn) toggleBtn.textContent = "🌙";
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("light-mode");
      const isLight = document.body.classList.contains("light-mode");

      toggleBtn.textContent = isLight ? "☀️" : "🌙";
      localStorage.setItem("theme", isLight ? "light" : "dark");

      toggleBtn.style.transform = "scale(0.8)";
      setTimeout(() => (toggleBtn.style.transform = ""), 200);
    });
  }
};

document.addEventListener("DOMContentLoaded", initTheme);

const complaintForm = document.getElementById("complaintForm");
if (complaintForm) {
  complaintForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const priority = document.getElementById("priority").value;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, title, description, priority }),
      });

      if (res.ok) {
        showNotification("Complaint submitted successfully!");
        complaintForm.reset();
      } else {
        showNotification("Failed to submit complaint.", "error");
      }
    } catch (err) {
      console.error(err);
      showNotification("Error connecting to server.", "error");
    }
  });
}

let allComplaints = [];
let currentFilter = "all";
let searchQuery = "";

const loadComplaints = async () => {
  const loading = document.getElementById("loading");

  try {
    const res = await fetch(API_URL);
    allComplaints = await res.json();

    if (loading) loading.style.display = "none";
    updateStats(allComplaints);
    renderComplaints();
  } catch (err) {
    console.error(err);
    if (loading) loading.textContent = "Failed to load complaints.";
    showNotification("Failed to load complaints.", "error");
  }
};

const renderComplaints = () => {
  const list = document.getElementById("complaintsList");
  if (!list) return;

  list.innerHTML = "";

  const filtered = allComplaints.filter((c) => {
    const matchesSearch =
      c.title?.toLowerCase().includes(searchQuery) ||
      c.name?.toLowerCase().includes(searchQuery);
    const matchesFilter =
      currentFilter === "all"
        ? true
        : currentFilter === "pending"
          ? c.status === "pending"
          : currentFilter === "high"
            ? c.priority === "high"
            : true;

    return matchesSearch && matchesFilter;
  });

  if (filtered.length === 0) {
    list.innerHTML =
      '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No complaints found.</p>';
    return;
  }

  filtered.forEach((c) => {
    const card = document.createElement("div");
    card.className = "complaint-card animate-fade-in";
    card.innerHTML = `
                <div class="complaint-header">
                    <div style="display: flex; gap: 0.5rem; align-items: center;">
                        <span class="complaint-id">#${c.id}</span>
                        <span class="priority-badge priority-${c.priority || "medium"}">${c.priority || "medium"}</span>
                    </div>
                    <span class="status-badge status-${c.status}">${c.status}</span>
                </div>
                <h3 class="complaint-title">${c.title}</h3>
                 <div style="margin-bottom: 0.5rem; font-size: 0.85rem; color: var(--text-muted);">
                    <span style="color: var(--primary);">By:</span> ${c.name || "Anonymous"} <br>
                    <span style="color: var(--primary);">Email:</span> ${c.email || "N/A"} <br>
                    <span style="font-size: 0.8rem; opacity: 0.7;">${timeAgo(c.createdAt)}</span>
                </div>
                <p class="complaint-desc">${c.description}</p>
                <div class="complaint-actions">
                    <select onchange="updateStatus(${c.id}, this.value)" class="status-select">
                        <option value="" disabled selected>Update Status</option>
                        <option value="pending" ${c.status === "pending" ? "selected" : ""}>Pending</option>
                        <option value="resolved" ${c.status === "resolved" ? "selected" : ""}>Resolved</option>
                        <option value="rejected" ${c.status === "rejected" ? "selected" : ""}>Rejected</option>
                    </select>
                    <button onclick="deleteComplaint(${c.id})" class="btn btn-danger" style="padding: 0.5rem 1rem;">Delete</button>
                </div>
            `;
    list.appendChild(card);
  });
};

const handleSearch = (query) => {
  searchQuery = query.toLowerCase();
  renderComplaints();
};

const filterComplaints = (filter) => {
  currentFilter = filter;

  document
    .querySelectorAll(".btn-filter")
    .forEach((btn) => btn.classList.remove("active"));
  const activeBtn = document.getElementById(`filter-${filter}`);
  if (activeBtn) activeBtn.classList.add("active");

  renderComplaints();
};

const timeAgo = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
};

const updateStatus = async (id, status) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      showNotification("Status updated!");
      loadComplaints();
    } else {
      showNotification("Failed to update status.", "error");
    }
  } catch (err) {
    showNotification("Error updating status.", "error");
  }
};

const deleteComplaint = async (id) => {
  if (!confirm("Are you sure you want to delete this complaint?")) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      showNotification("Complaint deleted.");
      loadComplaints();
    } else {
      showNotification("Failed to delete complaint.", "error");
    }
  } catch (err) {
    showNotification("Error deleting complaint.", "error");
  }
};

const updateStats = (complaints) => {
  const total = complaints ? complaints.length : 0;
  const pending = complaints
    ? complaints.filter((c) => c.status === "pending").length
    : 0;
  const resolved = complaints
    ? complaints.filter((c) => c.status === "resolved").length
    : 0;
  const rejected = complaints
    ? complaints.filter((c) => c.status === "rejected").length
    : 0;

  const safeSetText = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  safeSetText("stat-total", total);
  safeSetText("stat-pending", pending);
  safeSetText("stat-resolved", resolved);
  safeSetText("stat-rejected", rejected);
};

const exportComplaints = () => {
  window.location.href = `${API_URL}/export`;
};

window.updateStatus = updateStatus;
window.deleteComplaint = deleteComplaint;
window.exportComplaints = exportComplaints;

window.updateStatus = updateStatus;
window.deleteComplaint = deleteComplaint;
window.loadComplaints = loadComplaints;
window.filterComplaints = filterComplaints;
window.handleSearch = handleSearch;
