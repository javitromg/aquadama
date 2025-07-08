const API_URL = 'https://tu-backend.onrender.com/api'; // ⚠️ Sustituye por tu URL real

let canvas, ctx, isDrawing = false;
let token = sessionStorage.getItem("authToken");

// ------------------ FORMULARIO REGISTRO EMPLEADOS ------------------
if (document.getElementById("employeeForm")) {
  canvas = document.getElementById("signaturePad");
  ctx = canvas.getContext("2d");

  function startDraw(e) {
    isDrawing = true;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }

  function draw(e) {
    if (!isDrawing) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }

  function stopDraw() {
    isDrawing = false;
  }

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    if (e.touches) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  }

  canvas.addEventListener("mousedown", startDraw);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", stopDraw);
  canvas.addEventListener("touchstart", startDraw);
  canvas.addEventListener("touchmove", draw);
  canvas.addEventListener("touchend", stopDraw);

  document.getElementById("clearSignature").addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  document.getElementById("employeeForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const fd = new FormData(form);
    const body = {};

    for (const [k, v] of fd.entries()) {
      body[k] = v;
    }

    body.firma = canvas.toDataURL();

    try {
      const response = await fetch(`${API_URL}/empleados`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token || ""}`
        },
        body: fd
      });

      const result = await response.json();
      if (response.ok) {
        alert("✅ Registro exitoso");
        form.reset();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        alert("❌ Error: " + result.error);
      }
    } catch (err) {
      alert("❌ Error en la conexión con el servidor");
    }
  });
}

// ------------------ LOGIN ------------------
if (document.getElementById("loginForm")) {
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = document.getElementById("loginUser").value.trim();
    const pass = document.getElementById("loginPass").value.trim();

    try {
      const response = await fetch(`${API_URL}/admins/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user, password: pass })
      });

      const data = await response.json();
      if (response.ok) {
        sessionStorage.setItem("authToken", data.token);
        location.href = "admin.html";
      } else {
        alert("❌ " + data.error);
      }
    } catch (err) {
      alert("❌ No se pudo conectar con el servidor");
    }
  });
}

// ------------------ PANEL ADMINISTRACIÓN ------------------
if (document.querySelector(".sidebar")) {
  if (!token) location.href = "login.html";

  const headers = { Authorization: `Bearer ${token}` };

  document.getElementById("logout").addEventListener("click", () => {
    sessionStorage.removeItem("authToken");
    location.href = "login.html";
  });

  const panels = document.querySelectorAll(".main-content section");
  document.querySelectorAll(".sidebar a").forEach(a => {
    a.addEventListener("click", () => {
      panels.forEach(p => p.classList.add("hidden"));
      document.getElementById(a.id.replace("nav-", "panel-")).classList.remove("hidden");
    });
  });

  async function loadEmpleados() {
    const res = await fetch(`${API_URL}/empleados`, { headers });
    const empleados = await res.json();
    const container = document.getElementById("employeeList");
    container.innerHTML = "";

    empleados.forEach(emp => {
      const div = document.createElement("div");
      div.className = "employee-card";
      div.innerHTML = `
        <h3>${emp.nombre} ${emp.apellidos}</h3>
        <p><strong>DNI:</strong> ${emp.dni}</p>
        <p><strong>Teléfono:</strong> ${emp.telefono}</p>
        <p><strong>Email:</strong> ${emp.email}</p>
        <button onclick="eliminarEmpleado(${emp.id})">🗑️ Eliminar</button>
        <button onclick="descargarPDF(${emp.id})">📄 PDF</button>
      `;
      container.appendChild(div);
    });
  }

  window.eliminarEmpleado = async (id) => {
    if (!confirm("¿Eliminar este empleado?")) return;
    const res = await fetch(`${API_URL}/empleados/${id}`, {
      method: "DELETE",
      headers
    });
    const result = await res.json();
    alert(result.message);
    loadEmpleados();
  };

  window.descargarPDF = async (id) => {
    alert("⚠️ Esta versión aún no implementa el PDF personalizado directamente desde backend.\nLo haremos en breve si lo necesitas con diseño profesional.");
  };

  loadEmpleados();
}
