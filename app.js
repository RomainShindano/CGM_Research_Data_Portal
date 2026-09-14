const countries = [
  { slug: "india", name: "India", children: "~30,000", device: "Huawei P30 Pro", sensor: "Time of Flight", region: "South Asia" },
  { slug: "uganda", name: "Uganda", children: "~4,370", device: "Huawei P30 Pro", sensor: "Time of Flight", region: "East Africa" },
  { slug: "namibia", name: "Namibia", children: "~200", device: "Huawei P30 Pro", sensor: "Time of Flight", region: "Southern Africa" },
  { slug: "sierra-leone", name: "Sierra Leone", children: "~578", device: "Huawei P30 Pro", sensor: "Time of Flight", region: "West Africa" },
  { slug: "malawi", name: "Malawi", children: "~517", device: "Huawei P30 Pro", sensor: "Time of Flight", region: "Southern Africa" },
  { slug: "nepal", name: "Nepal", children: "~1,300", device: "Huawei P30 Pro", sensor: "Time of Flight", region: "South Asia" },
  { slug: "ethiopia", name: "Ethiopia", children: "~400", device: "Huawei P30 Pro", sensor: "Time of Flight", region: "East Africa" },
  { slug: "syria", name: "Syria", children: "~3,500", device: "Intel RealSense D435i", sensor: "Stereo Vision", region: "Middle East" }
];

const selected = new Set();
const grid = document.querySelector("#country-grid");
const modalRoot = document.querySelector("#modal-root");

function updateCatalogue() {
  document.querySelector("#selected-count").textContent = selected.size;
  document.querySelector("#selected-label").textContent = selected.size === 1 ? "country" : "countries";
  document.querySelector("#request-selected").disabled = selected.size === 0;
  document.querySelectorAll(".country-card").forEach(card => {
    const isSelected = selected.has(card.dataset.slug);
    card.classList.toggle("selected", isSelected);
    card.querySelector("input").checked = isSelected;
  });
}

function renderCountries() {
  grid.innerHTML = countries.map(country => `
    <article class="country-card" data-slug="${country.slug}">
      <div class="country-card-top">
        <label aria-label="Select ${country.name}"><input type="checkbox"><span></span></label>
        <small>${country.region}</small>
      </div>
      <h3>${country.name}</h3>
      <strong>${country.children}<small> children</small></strong>
      <dl>
        <div><dt>Capture device</dt><dd>${country.device}</dd></div>
        <div><dt>3D sensor</dt><dd>${country.sensor}</dd></div>
        <div><dt>Package</dt><dd>RGB-D + relational export</dd></div>
      </dl>
      <button class="request-country">Request this country <span>→</span></button>
    </article>`).join("");

  grid.querySelectorAll(".country-card").forEach(card => {
    card.querySelector("input").addEventListener("change", () => {
      selected.has(card.dataset.slug) ? selected.delete(card.dataset.slug) : selected.add(card.dataset.slug);
      updateCatalogue();
    });
    card.querySelector(".request-country").addEventListener("click", () => {
      selected.add(card.dataset.slug);
      updateCatalogue();
      openRequest();
    });
  });
}

function openRequest() {
  if (selected.size === 0) selected.add("india");
  updateCatalogue();
  renderApplication(1);
  document.body.style.overflow = "hidden";
}

function closeRequest() {
  modalRoot.innerHTML = "";
  document.body.style.overflow = "";
}

function steps(step) {
  return ["Eligibility", "Researcher", "Study & data", "Security"].map((label, index) => `
    <div class="step ${step >= index + 1 ? "active" : ""}">
      <span>${step > index + 1 ? "✓" : index + 1}</span><small>${label}</small>
    </div>`).join("");
}

function renderApplication(step) {
  let body = "";
  if (step === 1) {
    body = `<div class="agreement-list eligibility-list"><p>Confirm that you meet the initial requirements:</p>
      <label><input required type="checkbox"> I am affiliated with a research, academic, public-health or humanitarian institution.</label>
      <label><input required type="checkbox"> The intended use is a defined research project.</label>
      <label><input required type="checkbox"> I can provide ethics approval or an exemption if CGM requires it.</label>
      <label><input required type="checkbox"> My institution can securely store and control access to the data.</label>
      <label><input required type="checkbox"> I am willing to sign the CGM Data Use Agreement.</label></div>`;
  } else if (step === 2) {
    body = `<div class="form-grid"><label>Full name<input required placeholder="Dr. Amara Okafor"></label><label>Institution<input required placeholder="University or research institute"></label><label>Institutional email<input required type="email" placeholder="name@university.edu"></label><label>Applicant country<input required placeholder="Country"></label><label class="full">Role or position<input required placeholder="Principal investigator, doctoral researcher..."></label></div>`;
  } else if (step === 3) {
    body = `<div class="form-grid"><label class="full">Study title<input required placeholder="Proposed research title"></label><label class="full">Research purpose<textarea required rows="3" placeholder="Describe the research question, methodology and expected public benefit."></textarea></label>
      <fieldset class="country-fieldset full"><legend>Country datasets requested</legend><div class="country-options">${countries.map(country => `<label class="country-option ${selected.has(country.slug) ? "selected" : ""}"><input type="checkbox" data-country="${country.slug}" ${selected.has(country.slug) ? "checked" : ""}><span><b>${country.name}</b><small>${country.children} children · ${country.device}</small></span></label>`).join("")}</div><p class="field-error" ${selected.size ? "hidden" : ""}>Select at least one country before continuing.</p></fieldset>
      <label class="full">Requested data<select><option>RGB-D + relational data export + metadata</option><option>RGB-D + metadata</option><option>Relational data export only</option></select></label></div>`;
  } else {
    body = `<div class="form-grid"><label>Project duration<select><option>Up to 6 months</option><option>6–12 months</option><option>12–24 months</option></select></label><label>Ethics status<select><option>Approved</option><option>Exempt</option><option>Pending</option><option>Not yet assessed</option></select></label><label class="full">Secure storage plan<textarea required rows="3" placeholder="Describe where the dataset will be stored, who will have access and how it will be deleted."></textarea></label><label class="full">Expected outputs<input required placeholder="Paper, model benchmark, public-health analysis..."></label><p class="form-note full">In the operational MVP, supporting ethics and security documents can be exchanged manually during CGM review.</p></div>`;
  }

  modalRoot.innerHTML = `<div class="modal-backdrop"><section class="request-modal mvp-modal" role="dialog" aria-modal="true" aria-labelledby="request-title">
    <button class="modal-close" aria-label="Close access portal">×</button>
    <div class="modal-head"><p class="eyebrow green">MVP ACCESS APPLICATION</p><h2 id="request-title">Request country-level CGM data</h2><p>Complete the eligibility check and tell CGM how the selected data will be used.</p></div>
    <div class="steps four" aria-label="Step ${step} of 4">${steps(step)}</div>
    <form id="application-form">${body}<div class="form-actions">${step > 1 ? '<button type="button" class="button button-quiet" id="back-step">Back</button>' : "<span></span>"}<button class="button button-primary" type="submit">${step === 4 ? "Submit application" : "Continue"} <b>→</b></button></div></form>
  </section></div>`;
  bindModalClose();
  if (step > 1) document.querySelector("#back-step").onclick = () => renderApplication(step - 1);
  if (step === 3) {
    document.querySelectorAll("[data-country]").forEach(input => input.onchange = () => {
      input.checked ? selected.add(input.dataset.country) : selected.delete(input.dataset.country);
      input.closest(".country-option").classList.toggle("selected", input.checked);
      document.querySelector(".field-error").hidden = selected.size > 0;
      updateCatalogue();
    });
  }
  document.querySelector("#application-form").onsubmit = event => {
    event.preventDefault();
    if (step === 3 && selected.size === 0) return;
    step < 4 ? renderApplication(step + 1) : renderStatus("submitted");
  };
}

function journey(active) {
  return ["Application", "CGM review", "Agreement", "Download"].map((label, index) => `
    <div class="journey-node ${index + 1 <= active ? "active" : ""}"><span>${index + 1 < active ? "✓" : index + 1}</span><small>${label}</small></div>`).join("");
}

function renderStatus(status) {
  const active = status === "submitted" ? 2 : status === "approved" ? 3 : 4;
  const chosen = countries.filter(country => selected.has(country.slug));
  let card = "";
  if (status === "submitted") {
    card = `<div class="review-card"><span class="status-badge pending">UNDER CGM REVIEW</span><h3>Application received</h3><p>In the live MVP, CGM staff would now verify the institution, research purpose, ethics position and security plan manually. Clarifications would be handled by email.</p><div class="demo-callout"><b>Prototype control</b><span>Use the button below to simulate CGM approving this request.</span></div><button class="button button-primary" id="approve-demo">Simulate CGM approval <b>→</b></button></div>`;
  } else if (status === "approved") {
    card = `<div class="review-card"><span class="status-badge approved">APPROVED WITH CONDITIONS</span><h3>Sign the Data Use Agreement</h3><p>CGM has approved access only to the selected country packages for this research purpose.</p><div class="dua-box"><h4>CGM Data Use Agreement · Demo</h4><ul><li>Use data only for the approved project.</li><li>Do not attempt to re-identify children.</li><li>Do not redistribute files or credentials.</li><li>Delete the data when the approved period ends.</li></ul><label><input type="checkbox" id="dua-check"> I accept these conditions on behalf of the research team.</label></div><button class="button button-primary" id="activate-access" disabled>Sign and activate access <b>→</b></button></div>`;
  } else {
    card = `<div class="review-card"><span class="status-badge approved">ACCESS ACTIVE</span><h3>Your country packages are ready</h3><p>These prototype ZIP files represent the country folders that CGM would prepare in Azure Blob Storage. Each contains dummy RGB, depth, relational-export and documentation files.</p><div class="download-list">${chosen.map(country => `<div class="download-row"><div class="folder-mark">ZIP</div><div><b>${country.name} dataset</b><small>${country.device} · ${country.sensor}</small></div><a href="downloads/cgm-${country.slug}-dummy.zip" download>Download <span>↓</span></a></div>`).join("")}</div><p class="demo-disclaimer">Demo packages contain no real child data and do not expire. Production links should be time limited and audit logged.</p></div>`;
  }
  modalRoot.innerHTML = `<div class="modal-backdrop"><section class="request-modal mvp-modal" role="dialog" aria-modal="true" aria-labelledby="request-title"><button class="modal-close" aria-label="Close access portal">×</button><div class="portal-state"><p class="eyebrow green">APPLICATION CGM-DATA-DEMO-001</p><h2 id="request-title">Your controlled-access request</h2><div class="journey-status">${journey(active)}</div><div class="request-summary"><div><small>COUNTRIES REQUESTED</small><strong>${chosen.map(country => country.name).join(", ")}</strong></div><div><small>ACCESS SCOPE</small><strong>RGB-D, relational export and metadata</strong></div></div>${card}</div></section></div>`;
  bindModalClose();
  if (status === "submitted") document.querySelector("#approve-demo").onclick = () => renderStatus("approved");
  if (status === "approved") {
    const check = document.querySelector("#dua-check");
    const button = document.querySelector("#activate-access");
    check.onchange = () => button.disabled = !check.checked;
    button.onclick = () => renderStatus("signed");
  }
}

function bindModalClose() {
  document.querySelector(".modal-close").onclick = closeRequest;
  document.querySelector(".modal-backdrop").addEventListener("mousedown", event => {
    if (event.target.classList.contains("modal-backdrop")) closeRequest();
  });
}

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && modalRoot.innerHTML) closeRequest();
});
document.querySelectorAll(".js-open-request").forEach(button => button.onclick = openRequest);
document.querySelector("#request-selected").onclick = openRequest;
document.querySelector("#sample-metadata").onclick = () => {
  const toast = document.querySelector("#toast");
  toast.hidden = false;
  window.setTimeout(() => toast.hidden = true, 3000);
};

renderCountries();
