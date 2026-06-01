/* ============================================================
   مصنف — استبيان آراء العملاء (script.js)

   ⬇⬇  هذا هو السطر الوحيد اللي تعدّله  ⬇⬇
   حُط رابط سكربت جوجل (ينتهي بـ /exec) بين علامتي الاقتباس.
   ============================================================ */
const ENDPOINT = "https://script.google.com/macros/s/AKfycbxS40M_GC0yF4zDgDCbMvJOHqtZfbv-LjLPC2b5cTveQl6g1a9f7xSgrJowPdh2vxq8Xw/exec";
/* ============================================================ */

const $ = (s, p = document) => p.querySelector(s);

/* بناء أزرار المقياس 1 → 10 */
const scaleEl = $("#scale");
let rating = null;
for (let i = 1; i <= 10; i++) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "scale__btn";
  b.textContent = i;
  b.setAttribute("aria-label", "تقييم " + i);
  b.addEventListener("click", () => {
    rating = i;
    document.querySelectorAll(".scale__btn").forEach(x => x.classList.remove("is-selected"));
    b.classList.add("is-selected");
    $("#q2").classList.remove("has-error");
  });
  scaleEl.appendChild(b);
}

/* إظهار حقل "غير ذلك" */
const otherWrap = $("#otherWrap");
document.querySelectorAll('input[name="source"]').forEach(r => {
  r.addEventListener("change", () => {
    const isOther = $("#srcOther").checked;
    otherWrap.classList.toggle("show", isOther);
    if (isOther) setTimeout(() => $("#otherText").focus(), 120);
    $("#q1").classList.remove("has-error");
  });
});

/* مساعد: تمييز سؤال ناقص */
function flag(id) {
  const el = $("#" + id);
  el.classList.add("has-error", "shake");
  setTimeout(() => el.classList.remove("shake"), 450);
  el.scrollIntoView({ behavior: "smooth", block: "center" });
}

/* الإرسال */
const form = $("#survey");
const btn = $("#submitBtn");
const note = $("#formNote");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  note.classList.remove("show");

  const sourceInput = $('input[name="source"]:checked');
  // تحقق: السؤال 1 و 2 إجباري
  if (!sourceInput) { flag("q1"); return; }
  if (!rating) { flag("q2"); return; }

  const otherText = $("#srcOther").checked ? $("#otherText").value.trim() : "";
  const payload = {
    source:    sourceInput.value,
    otherText: otherText,
    rating:    rating,
    comment:   $("#comment").value.trim()
  };

  btn.disabled = true;
  btn.textContent = "جارٍ الإرسال…";

  try {
    if (ENDPOINT && !ENDPOINT.startsWith("PASTE_")) {
      await fetch(ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });
    } else {
      console.warn("ENDPOINT غير مضبوط — عرض شاشة الشكر للتجربة فقط.", payload);
    }
    form.style.display = "none";
    $("#thanks").classList.add("show");
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (err) {
    console.error(err);
    note.classList.add("show");
    btn.disabled = false;
    btn.textContent = "إرسال";
  }
});
