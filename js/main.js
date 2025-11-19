document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  const envelope = document.getElementById("envelope");
  const overlay = document.querySelector(".envelope-overlay");
  // Click nút "Mở thiệp" hoặc click vào phong bì đều mở được
  // if (sessionStorage.getItem("envelopeOpened")) {
  //   overlay.classList.add("closed");
  //   return;
  // }

  // function open() {
  //   envelope.classList.add("open");
  //   setTimeout(() => {
  //     overlay.classList.add("closed");
  //     sessionStorage.setItem("envelopeOpened", "true");
  //   }, 2600);
  // }

  // envelope.addEventListener("click", open);
  // document.querySelector(".open-letter").addEventListener("click", (e) => {
  //   e.stopPropagation();
  //   open();
  // });

  // // Nếu người dùng đã mở rồi (trở lại trang), bỏ qua envelope
  // if (sessionStorage.getItem("envelopeOpened")) {
  //   overlay.classList.add("closed");
  //   startCountdown();
  // } else {
  //   // Lưu trạng thái đã mở (chỉ hiện 1 lần mỗi phiên)
  //   envelope.addEventListener("click", () => {
  //     sessionStorage.setItem("envelopeOpened", "true");
  //   });
  // }
  toggle &&
    toggle.addEventListener("click", () => {
      if (nav.style.display === "block") nav.style.display = "none";
      else nav.style.display = "block";
    });

  const form = document.querySelector(".rsvp-form");
  form &&
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.querySelector("input").value.trim();
      const choice = form.querySelector("select").value;
      if (!name) {
        alert("Vui lòng nhập họ và tên");
        return;
      }
      alert(`Cảm ơn ${name}. Bạn đã chọn: ${choice}`);
      form.reset();
    });

  async function initGallery() {
    const galleryEl = document.querySelector("#gallery .grid");
    if (!galleryEl) return;

    let images = [];
    try {
      const res = await fetch("/images.json"); // Giờ là URL external từ Google Photos
      if (res.ok) images = await res.json();
    } catch (err) {
      console.warn("Không load được images.json", err);
      return;
    }

    if (!images || images.length === 0) return;

    galleryEl.innerHTML = "";

    images.forEach((src, i) => {
      // src giờ là URL đầy đủ từ Google
      const fig = document.createElement("figure");
      fig.className = "gallery-item";

      const img = document.createElement("img");
      img.className = "lazy";
      img.setAttribute("data-src", src); // URL external
      img.alt = `Ảnh cưới ${i + 1}`;
      img.loading = "lazy"; // Tối ưu thêm

      fig.appendChild(img);
      galleryEl.appendChild(fig);
    });

    // Phần còn lại giữ nguyên: load more, lazy load...
    const perPage = 8;
    const items = galleryEl.querySelectorAll(".gallery-item");
    items.forEach((item, idx) => {
      if (idx >= perPage) item.classList.add("hidden");
    });

    let loadMoreBtn = document.getElementById("loadMore");
    if (!loadMoreBtn) {
      loadMoreBtn = document.createElement("button");
      loadMoreBtn.id = "loadMore";
      loadMoreBtn.innerHTML = "<span>Xem thêm</span>";
      loadMoreBtn.className = "load-more-btn";
      galleryEl.parentNode.appendChild(loadMoreBtn);
    }

    let shown = perPage;
    if (shown >= items.length) loadMoreBtn.style.display = "none";

    loadMoreBtn.addEventListener("click", () => {
      const nextCount = Math.min(shown + 8, items.length);
      for (let i = shown; i < nextCount; i++) {
        items[i].classList.remove("hidden");
      }
      shown = nextCount;
      if (shown >= items.length) loadMoreBtn.style.display = "none";
      observeLazyImages();
    });

    // Lazy load (giờ tải từ external URL siêu nhanh)
    let io;
    function observeLazyImages() {
      const lazyImgs = galleryEl.querySelectorAll("img.lazy:not(.loaded)");
      if ("IntersectionObserver" in window) {
        if (io) io.disconnect();
        io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src; // Load URL external
                img.onload = () => img.classList.add("loaded");
                img.onerror = () =>
                  console.warn("Lỗi load ảnh:", img.dataset.src); // Debug nếu lỗi
                img.removeAttribute("data-src");
                io.unobserve(img);
              }
            });
          },
          { rootMargin: "100px" }
        );

        lazyImgs.forEach((img) => io.observe(img));
      } else {
        lazyImgs.forEach((img) => {
          img.src = img.dataset.src;
          img.classList.add("loaded");
        });
      }
    }
    observeLazyImages();
  }

  // ================== LIGHTBOX PHÓNG TO ẢNH ==================
  function initLightbox() {
    const lightbox = document.getElementById("lightbox");
    const lbImg = lightbox.querySelector("img");
    const closeBtn = lightbox.querySelector(".close");
    const prevBtn = lightbox.querySelector(".prev");
    const nextBtn = lightbox.querySelector(".next");

    let currentIndex = 0;
    let images = [];

    // Thu thập tất cả ảnh trong gallery (kể cả ẩn bởi "Xem thêm")
    function collectImages() {
      images = Array.from(
        document.querySelectorAll("#gallery .gallery-item img")
      ).map((img) => ({
        src: img.dataset.src || img.src,
        el: img,
      }));
    }

    function openLightbox(index) {
      collectImages();
      if (images.length === 0) return;

      currentIndex = index < 0 ? images.length - 1 : index % images.length;
      lbImg.src = images[currentIndex].src;

      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
      setTimeout(() => {
        lbImg.src = "";
      }, 500);
    }

    function showNext() {
      openLightbox(currentIndex + 1);
    }

    function showPrev() {
      openLightbox(currentIndex - 1);
    }

    // Click vào ảnh trong gallery → mở lightbox
    document.querySelector("#gallery").addEventListener("click", (e) => {
      const img = e.target.closest("img");
      if (!img) return;
      const all = Array.from(
        document.querySelectorAll("#gallery .gallery-item img")
      );
      const idx = all.indexOf(img);
      if (idx !== -1) openLightbox(idx);
    });

    // Nút đóng + click nền
    closeBtn.onclick = closeLightbox;
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox || e.target === lbImg) closeLightbox();
    });

    // Nút prev/next
    prevBtn.onclick = showPrev;
    nextBtn.onclick = showNext;

    // Phím tắt
    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    });

    // SWIPE TRÁI – PHẢI SIÊU MƯỢT CHO ĐIỆN THOẠI
    let startX = 0;
    let endX = 0;

    lightbox.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].screenX;
      },
      { passive: true }
    );

    lightbox.addEventListener(
      "touchend",
      (e) => {
        endX = e.changedTouches[0].screenX;
        const diff = startX - endX;

        if (Math.abs(diff) > 50) {
          // vuốt đủ mạnh
          if (diff > 0) showNext(); // vuốt trái → ảnh sau
          else showPrev(); // vuốt phải → ảnh trước
        }
      },
      { passive: true }
    );
  }

  // Gọi sau khi gallery load xong
  initGallery();
  initLightbox(); // thêm dòng này

  // --- Countdown timer ---
  function initCountdown() {
    // target date: 2025-08-20 12:00 local
    const target = new Date(2025, 10, 30, 11, 0, 0); // month is 0-based: 7 -> August
    const elDays = document.querySelector(".countdown .days");
    const elHours = document.querySelector(".countdown .hours");
    const elMinutes = document.querySelector(".countdown .minutes");
    const elSeconds = document.querySelector(".countdown .seconds");
    if (!elDays) return;

    function tick() {
      const now = new Date();
      let diff = Math.max(0, target - now);
      if (diff <= 0) {
        elDays.textContent = "0";
        elHours.textContent = "0";
        elMinutes.textContent = "0";
        elSeconds.textContent = "0";
        clearInterval(timer);
        return;
      }
      const sec = Math.floor(diff / 1000) % 60;
      const min = Math.floor(diff / 1000 / 60) % 60;
      const hrs = Math.floor(diff / 1000 / 60 / 60) % 24;
      const days = Math.floor(diff / 1000 / 60 / 60 / 24);
      elDays.textContent = String(days);
      elHours.textContent = String(hrs).padStart(2, "0");
      elMinutes.textContent = String(min).padStart(2, "0");
      elSeconds.textContent = String(sec).padStart(2, "0");
    }
    tick();
    const timer = setInterval(tick, 1000);
  }
  initCountdown();
});
