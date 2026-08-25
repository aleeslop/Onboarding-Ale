const form = document.querySelector("#formEscuela");
const errores = document.querySelector("#errores");
const exito = document.querySelector("#exito");


function cargarAlumnos() {
  fetch("/alumnos")
    .then(async res => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudieron cargar los alumnos");
      return data;
    })
    .then(data => {
      const lista = document.getElementById("lista");
      lista.innerHTML = "";
      data.forEach(alumno => {
        const li = document.createElement("li");
        li.textContent = `${alumno.nombre} - ${alumno.matricula}`;
        lista.appendChild(li);
      });
    })
    .catch(error => {
      document.getElementById("lista").innerHTML =
      `<li style='color: red;'>${error.message}</li>`;
    });
}

document.addEventListener("DOMContentLoaded", () => {
  cargarAlumnos();
});

form.addEventListener("submit", (event) => {
  event.preventDefault(); 
  errores.textContent = "";
  exito.textContent = "";

  const nombre = document.querySelector("#nombre").value.trim();
  const email = document.querySelector("#email").value.trim();
  const matricula = document.querySelector("#matricula").value.trim();

  let mensajesError = [];

  if (!nombre || !email || !matricula) {
    mensajesError.push("Todos los campos son obligatorios.");
  }

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !regexEmail.test(email)) {
    mensajesError.push("Correo electrónico inválido.");
  }

  if (matricula && matricula.length < 5) {
    mensajesError.push("Matrícula inválida, debe tener al menos 5 caracteres.");
  }

  if (mensajesError.length > 0) {
    errores.textContent = mensajesError.join(" | ");
    errores.style.color = "red";
  } else {
    fetch("/alumnos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, matricula, grado: "Pendiente" })
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "No se pudo registrar el alumno");
        return data;
      })
      .then(() => {
        exito.textContent = "Formulario enviado correctamente";
        exito.style.color = "green";
        document.body.style.backgroundColor = "#e0f2fe";
        cargarAlumnos();
      })
      .catch(error => {
        errores.textContent = error.message;
        errores.style.color = "red";
      });
  }
});
