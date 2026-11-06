/* ============================================================
   Virtual Dog Park - script.js
   Round 1: only the footer year. The pet features arrive later.
   ============================================================ */

const yearSpan = document.getElementById("year");

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}
