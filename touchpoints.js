(function () {
  // Which common touchpoints come into play at each timeline stage (index 0-6)
  const stageTouchpoints = [
    ["Website", "Call Center", "Patient Portal"],
    ["Appointment Scheduling", "Patient Portal", "Text/Email Reminders", "Pre-Visit Instructions"],
    ["Front Desk/Registration", "Kiosk Check-In"],
    ["Nurse Triage", "Physician Consult"],
    ["Medication Administration", "Care Planning"],
    ["Discharge Instructions", "Medication Education"],
    ["Follow-Up Calls", "Billing", "Patient Surveys", "Portal Messaging"],
  ];

  function updateTouchpoints() {
    const active = stageTouchpoints[sIndex] || [];
    const cards = document.querySelectorAll(".touchpoint-card");
    cards.forEach((card) => {
      let hasActive = false;
      card.querySelectorAll("li").forEach((li) => {
        const on = active.includes(li.textContent.trim());
        li.classList.remove("tp-active", "tp-dim");
        // restart animation
        void li.offsetWidth;
        li.classList.add(on ? "tp-active" : "tp-dim");
        if (on) hasActive = true;
      });
      card.classList.toggle("phase-active", hasActive);
      card.classList.toggle("phase-idle", !hasActive);
    });
  }

  const originalRender = render;
  render = function () {
    originalRender();
    updateTouchpoints();
  };

  updateTouchpoints();
})();
