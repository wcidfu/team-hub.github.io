const SUPABASE_URL = "https://ramjspdxsqujoawjfxvj.supabase.co";
const SUPABASE_KEY = "sb_publishable_gRIuMXzaTlRAeYcUisHjDw_VtoLgOKP";

const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const slotsContainer = document.getElementById("scrimSlots");
const statusText = document.getElementById("scrimStatus");
const refreshButton = document.getElementById("refreshSlots");
const availableCount = document.getElementById("availableCount");
const bookedCount = document.getElementById("bookedCount");
const filterButtons = document.querySelectorAll("[data-filter]");

const modal = document.getElementById("bookingModal");
const closeButton = document.getElementById("closeBooking");
const bookingForm = document.getElementById("bookingForm");
const bookingSlotText = document.getElementById("bookingSlotText");
const slotIdInput = document.getElementById("slotId");
const teamNameInput = document.getElementById("teamName");
const contactInput = document.getElementById("contact");
const commentInput = document.getElementById("comment");

let slots = [];
let activeFilter = "all";

loadSlots();

refreshButton.addEventListener("click", loadSlots);
closeButton.addEventListener("click", closeModal);

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    renderSlots();
  });
});

bookingForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const slotId = Number(slotIdInput.value);
  const teamName = teamNameInput.value.trim();
  const contact = contactInput.value.trim();
  const comment = commentInput.value.trim();

  if (!teamName || !contact) {
    alert("Заполни название команды и контакт.");
    return;
  }

  const submitButton = bookingForm.querySelector("button[type='submit']");
  submitButton.disabled = true;
  submitButton.textContent = "Бронирую...";

  const { error } = await client
    .from("scrim_slots")
    .update({
      status: "booked",
      team_name: teamName,
      contact,
      comment,
    })
    .eq("id", slotId)
    .eq("status", "available");

  submitButton.disabled = false;
  submitButton.textContent = "Забронировать";

  if (error) {
    alert("Ошибка бронирования: " + error.message);
    return;
  }

  closeModal();
  await loadSlots();
  alert("Слот забронирован.");
});

async function loadSlots() {
  statusText.textContent = "Загружаю слоты...";
  slotsContainer.innerHTML = "";

  const { data, error } = await client
    .from("scrim_slots")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    statusText.textContent = "Ошибка загрузки: " + error.message;
    return;
  }

  slots = data || [];
  renderSlots();
}

function renderSlots() {
  const available = slots.filter((slot) => slot.status === "available").length;
  const booked = slots.filter((slot) => slot.status === "booked").length;

  availableCount.textContent = available;
  bookedCount.textContent = booked;

  const visibleSlots = slots.filter((slot) => {
    if (activeFilter === "all") return true;
    return slot.status === activeFilter;
  });

  if (!slots.length) {
    statusText.textContent = "Слотов пока нет. Добавь их в Supabase.";
    slotsContainer.innerHTML = `<article class="scrim-slot"><p>Пусто.</p></article>`;
    return;
  }

  statusText.textContent = `Всего слотов: ${slots.length}`;

  if (!visibleSlots.length) {
    slotsContainer.innerHTML = `<article class="scrim-slot"><p>Cлотов нет.</p></article>`;
    return;
  }

  slotsContainer.innerHTML = visibleSlots.map(createSlotCard).join("");

  document.querySelectorAll("[data-book-slot]").forEach((button) => {
    button.addEventListener("click", () => {
      const slot = slots.find((item) => item.id === Number(button.dataset.bookSlot));
      openModal(slot);
    });
  });
}

function createSlotCard(slot) {
  const isBooked = slot.status === "booked";
  const slotDate = escapeHtml(slot.slot_date || "Дата");
  const slotTime = escapeHtml(slot.slot_time || "Время");
  const teamName = escapeHtml(slot.team_name || "");

  return `
    <article class="scrim-slot ${isBooked ? "scrim-slot--booked" : "scrim-slot--available"}">
      <div class="scrim-slot__main">
        <div class="scrim-slot__date">${slotDate}</div>
        <div class="scrim-slot__time">${slotTime}</div>
      </div>

      <div class="scrim-slot__side">
        <span class="scrim-slot__badge ${isBooked ? "is-booked" : "is-available"}">
          ${isBooked ? "Занято" : "Свободно"}
        </span>

        ${isBooked ? `<p class="scrim-slot__team">by <b>${teamName}</b></p>` : ""}

        <button class="scrim-slot__button" type="button" data-book-slot="${slot.id}" ${isBooked ? "disabled" : ""}>
          ${isBooked ? "Забронирован" : "Забронировать"}
        </button>
      </div>
    </article>
  `;
}

function openModal(slot) {
  if (!slot || slot.status !== "available") return;

  slotIdInput.value = slot.id;
  bookingSlotText.textContent = `${slot.slot_date} · ${slot.slot_time}`;
  teamNameInput.value = "";
  contactInput.value = "";
  commentInput.value = "";

  modal.classList.remove("is-hidden");
  modal.setAttribute("aria-hidden", "false");
  teamNameInput.focus();
}

function closeModal() {
  modal.classList.add("is-hidden");
  modal.setAttribute("aria-hidden", "true");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
