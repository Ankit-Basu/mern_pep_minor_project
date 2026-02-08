let complaints = [];
let nextId = 1;

export const getComplaints = (req, res) => {
  res.json(complaints);
};

export const getComplaintById = (req, res) => {
  const complaint = complaints.find((c) => c.id === parseInt(req.params.id));
  if (!complaint) {
    return res.status(404).json({ message: "Complaint not found" });
  }
  res.json(complaint);
};

export const createComplaint = (req, res) => {
  const { title, description, name, email, priority } = req.body;

  if (!title || !description || !name || !email) {
    return res.status(400).json({
      message: "All fields (Name, Email, Title, Description) are required",
    });
  }

  const newComplaint = {
    id: nextId++,
    name,
    email,
    title,
    description,
    priority: priority || "medium",
    status: "pending",
    createdAt: new Date(),
  };

  complaints.push(newComplaint);
  res.status(201).json(newComplaint);
};

export const updateComplaintStatus = (req, res) => {
  const { status } = req.body;
  const complaint = complaints.find((c) => c.id === parseInt(req.params.id));

  if (!complaint) {
    return res.status(404).json({ message: "Complaint not found" });
  }

  if (!["pending", "resolved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  complaint.status = status;
  res.json(complaint);
};

export const deleteComplaint = (req, res) => {
  const index = complaints.findIndex((c) => c.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: "Complaint not found" });
  }

  complaints.splice(index, 1);
  res.status(204).send();
};

export const exportComplaints = (req, res) => {
  const fields = [
    "id",
    "name",
    "email",
    "title",
    "description",
    "priority",
    "status",
    "createdAt",
  ];
  const csv = [
    fields.join(","),
    ...complaints.map((c) =>
      fields
        .map((field) => {
          const val = c[field] ? c[field].toString().replace(/"/g, '""') : "";
          return `"${val}"`;
        })
        .join(","),
    ),
  ].join("\n");

  res.header("Content-Type", "text/csv");
  res.header("Content-Disposition", 'attachment; filename="complaints.csv"');
  res.send(csv);
};
