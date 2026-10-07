const STORAGE_KEY = "cottonUniversityInternshipCertificate";

const fields = [
  "certificateNo",
  "issueDate",
  "place",
  "studentName",
  "rollNo",
  "registrationNo",
  "semester",
  "program",
  "institute",
  "startDate",
  "endDate",
  "topic",
  "facultyName",
  "hodName",
  "showRegistration",
  "showCertificateNo"
];

const $ = (id) => document.getElementById(id);

function formatDate(value) {
  if (!value) return "__________";

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "__________";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

function valueOr(value, fallback) {
  const cleaned = String(value ?? "").trim();
  return cleaned || fallback;
}

function updatePreview() {
  $("previewCertificateNo").textContent =
    `Certificate No.: ${valueOr($("certificateNo").value, "—")}`;

  $("previewStudentName").textContent =
    valueOr($("studentName").value, "STUDENT NAME").toUpperCase();

  $("previewRollNo").textContent =
    valueOr($("rollNo").value, "—");

  $("previewRegistrationNo").textContent =
    valueOr($("registrationNo").value, "—");

  $("previewSemester").textContent =
    valueOr($("semester").value, "________ Semester");

  $("previewProgram").textContent =
    valueOr($("program").value, "__________");

  $("previewInstitute").textContent =
    valueOr($("institute").value, "__________");

  $("previewStartDate").textContent =
    formatDate($("startDate").value);

  $("previewEndDate").textContent =
    formatDate($("endDate").value);

  $("previewTopic").textContent =
    valueOr($("topic").value, "__________");

  $("previewFacultyName").textContent =
    valueOr($("facultyName").value, "Faculty In Charge");

  $("previewHodName").textContent =
    valueOr($("hodName").value, "Head of the Department");

  $("previewIssueDate").textContent =
    formatDate($("issueDate").value);

  $("previewPlace").textContent =
    valueOr($("place").value, "Guwahati");

  $("registrationBlock").style.display =
    $("showRegistration").checked ? "" : "none";

  $("previewCertificateNo").style.display =
    $("showCertificateNo").checked ? "" : "none";

  const rawName = String($("studentName").value ?? "").trim().replace(/\s+/g, " ");
  const safeName = rawName.replace(/[\\/:*?"<>|]/g, "").slice(0, 80);
  document.title = safeName
    ? `Internship Certificate - ${safeName}`
    : "Cotton University \u2014 Internship Certificate";
}

function saveState() {
  const state = {};

  fields.forEach((id) => {
    const element = $(id);

    if (element.type === "checkbox") {
      state[id] = element.checked;
    } else {
      state[id] = element.value;
    }
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

  $("saveStatus").textContent =
    "Saved locally • " +
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    const today = new Date().toISOString().slice(0, 10);
    $("issueDate").value = today;
    return;
  }

  try {
    const state = JSON.parse(raw);

    fields.forEach((id) => {
      if (!(id in state)) return;

      const element = $(id);

      if (element.type === "checkbox") {
        element.checked = Boolean(state[id]);
      } else {
        element.value = state[id];
      }
    });
  } catch (error) {
    console.warn("Could not restore saved certificate data.", error);
  }
}

function resetForm() {
  const confirmed = confirm(
    "Reset all certificate fields and remove the locally saved data?"
  );

  if (!confirmed) return;

  localStorage.removeItem(STORAGE_KEY);
  $("certificateForm").reset();

  $("place").value = "Guwahati";
  $("showRegistration").checked = true;
  $("showCertificateNo").checked = true;

  const today = new Date().toISOString().slice(0, 10);
  $("issueDate").value = today;

  updatePreview();

  $("saveStatus").textContent = "Certificate data has been reset.";
}

function printCertificate() {
  updatePreview();
  window.print();
}

document.addEventListener("DOMContentLoaded", () => {
  loadState();

  fields.forEach((id) => {
    const element = $(id);

    element.addEventListener("input", () => {
      updatePreview();
      saveState();
    });

    element.addEventListener("change", () => {
      updatePreview();
      saveState();
    });
  });

  $("printBtn").addEventListener("click", printCertificate);
  $("resetBtn").addEventListener("click", resetForm);

  updatePreview();
});