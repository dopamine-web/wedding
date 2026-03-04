function updateCountdown() {
  const target = new Date("2026-04-25T11:00:00");
  const now = new Date();
  const diff = target - now;

  if (diff <= 0) {
    document.getElementById("cd-days").textContent = "0";
    document.getElementById("cd-hours").textContent = "0";
    document.getElementById("cd-mins").textContent = "0";
    document.getElementById("cd-secs").textContent = "0";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById("cd-days").textContent = String(days).padStart(
    2,
    "0",
  );
  document.getElementById("cd-hours").textContent = String(hours).padStart(
    2,
    "0",
  );
  document.getElementById("cd-mins").textContent = String(mins).padStart(
    2,
    "0",
  );
  document.getElementById("cd-secs").textContent = String(secs).padStart(
    2,
    "0",
  );
}

updateCountdown();
setInterval(updateCountdown, 1000);

function submitForm(e) {
  e.preventDefault();
  document.getElementById("rsvpForm").style.display = "none";
  document.getElementById("successMsg").style.display = "block";
}

const otherCheck = document.getElementById("otherCheck");
const otherInput = document.getElementById("otherInput");

otherCheck.addEventListener("change", () => {
  otherInput.style.display = otherCheck.checked ? "block" : "none";

  if (!otherCheck.checked) {
    otherInput.value = "";
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  },
  { threshold: 0.1 },
);

document
  .querySelectorAll(
    ".section, .calendar-section, .location-section, .timing-section, .dresscode-section, .memories-section, .rsvp-section",
  )
  .forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.7s ease, transform 0.7s ease";
    observer.observe(el);
  });

const openBtn = document.getElementById("openGallery");
const gallery = document.getElementById("gallery");
const closeBtn = document.querySelector(".close");

const swiper = new Swiper(".mySwiper", {
  loop: true,
  spaceBetween: 20,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});

openBtn.addEventListener("click", () => {
  gallery.classList.add("active");
  swiper.update();
});

closeBtn.addEventListener("click", () => {
  gallery.classList.remove("active");
});

document.getElementById("rsvpForm").addEventListener("submit", submitForm);

emailjs.init("-I90ZJf7b9jEpu84-");

async function submitForm(event) {
  event.preventDefault();

  const form = document.getElementById("rsvpForm");
  const btn = form.querySelector(".submit-btn");

  const fullname = form.fullname.value.trim();

  const attendValue = form.querySelector('input[name="attend"]:checked');
  if (!attendValue) {
    alert("Пожалуйста, подтвердите присутствие");
    return;
  }

  const attendText =
    attendValue.value === "yes" ? "✅ Да, приду" : "😢 Не смогу прийти";

  const drinks = [];

  if (form.white_semi_sweet_wine.checked) drinks.push("Белое полусладкое вино");
  if (form.dry_red_wine.checked) drinks.push("Красное сухое вино");
  if (form.red_semi_sweet_wine.checked) drinks.push("Красное полусладкое вино");
  if (form.champagne.checked) drinks.push("Шампанское");
  if (form.strong_alcohol.checked) drinks.push("Крепкий алкоголь");
  if (form.drink_none.checked) drinks.push("Не буду пить алкоголь");

  const otherCheck = document.getElementById("otherCheck");
  const otherInput = document.getElementById("otherInput");

  if (otherCheck.checked && otherInput.value.trim()) {
    drinks.push("Другое: " + otherInput.value.trim());
  }

  btn.disabled = true;
  btn.textContent = "Отправляю...";

  try {
    await emailjs.send("service_tvgp9tb", "template_l5z706m", {
      fullname,
      attend: attendText,
      drinks: drinks.length ? drinks.join(", ") : "Не указано",
    });

    btn.textContent = "✅ Спасибо! Мы очень рады вас видеть! 🌸";
    btn.style.background = "#4CAF50";
    form.reset();
  } catch (error) {
    btn.textContent = "❌ Ошибка, попробуй снова";
    btn.style.background = "#e53935";
    btn.disabled = false;
    console.error(error);
  }
}
