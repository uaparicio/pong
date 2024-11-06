const equiposJSON = {
    "equipos": [
        {
            "nombre": "De todo un poco",
            "jugadores": [
                { "nombre": "Azeglio, Luciano", "pareja": "Wengorra, Claudio" },
                { "nombre": "Wengorra, Claudio", "pareja": "Azeglio, Luciano" },
                { "nombre": "Cirella, Jorge", "pareja": "Azeglio, Daniel" },
                { "nombre": "Azeglio, Daniel", "pareja": "Cirella, Jorge" }
            ]
        },
        {
            "nombre": "Aura TDM",
            "jugadores": [
                { "nombre": "Balmaceda, Daniel", "pareja": "Agüero, Renzo" },
                { "nombre": "Agüero, Renzo", "pareja": "Balmaceda, Daniel" },
                { "nombre": "Gil Lemos, Benjamín", "pareja": "Iglesias, Alejandro" },
                { "nombre": "Iglesias, Alejandro", "pareja": "Gil Lemos, Benjamín" }
            ]
        },
        {
            "nombre": "El Gran Equipo",
            "jugadores": [
                { "nombre": "Solorza, Pablo", "pareja": "Bustarack, José" },
                { "nombre": "Bustarack, José", "pareja": "Solorza, Pablo" },
                { "nombre": "Furlotti, Alberto", "pareja": "Mideo, Diego" },
                { "nombre": "Mideo, Diego", "pareja": "Furlotti, Alberto" }
            ]
        },
        {
            "nombre": "Los Ping Pro",
            "jugadores": [
                { "nombre": "Aparicio, Ulises", "pareja": "Mayer, Jorge" },
                { "nombre": "Mayer, Jorge", "pareja": "Aparicio, Ulises" },
                { "nombre": "Nieva, Sergio", "pareja": "Valdivia, Ignacio" },
                { "nombre": "Valdivia, Ignacio", "pareja": "Nieva, Sergio" }
            ]
        },
        {
            "nombre": "Ping Pongfinity",
            "jugadores": [
                { "nombre": "Domínguez, Agustín", "pareja": "Domínguez, Juan Carlos" },
                { "nombre": "Mandolesi, Agustín", "pareja": "Gallegos, Rosauro" },
                { "nombre": "Domínguez, Juan Carlos", "pareja": "Domínguez, Agustín" },
                { "nombre": "Gallegos, Rosauro", "pareja": "Mandolesi, Agustín" }
            ]
        },
        {
            "nombre": "Los libres",
            "jugadores": [
                { "nombre": "Cirella, Facundo", "pareja": "Loncharich, Juan" },
                { "nombre": "Loncharich, Juan", "pareja": "Cirella, Facundo" },
                { "nombre": "Agüero, Tiziano", "pareja": "Salcedo, Darío" },
                { "nombre": "Salcedo, Darío", "pareja": "Agüero, Tiziano" }
            ]
        }
    ]
};

window.onload = function() {
    cargarDropdowns();
    restaurarValoresDesdeLocalStorage();

    // Verificar si hay equipos seleccionados en localStorage y cargar cruces si es así
    if (localStorage.getItem("equipo1Seleccionado") && localStorage.getItem("equipo2Seleccionado")) {
        mostrarPartidos();  // Cargar los cruces automáticamente si hay datos guardados

        // Calcular los totales automáticamente después de restaurar valores
        calcularTotalesAutomaticamente();
    }
};

function reiniciarAplicacion() {
    const confirmacion = confirm("¿Estás seguro que querés reiniciar? Esto borrará los puntos cargados hasta ahora.");
    if (confirmacion) {
        localStorage.clear(); // Borrar el localStorage
        location.reload();    // Recargar la página
    }
}

function calcularTotalesAutomaticamente() {
    const partidos = document.querySelectorAll(".partido");
    partidos.forEach(partido => {
        const partidoId = partido.id;
        calcularTotal(partidoId);
    });
}


function guardarValorEnLocalStorage(id, valor) {
    localStorage.setItem(id, valor);
}

// Nueva función para guardar el equipo seleccionado
function guardarEquiposSeleccionados(equipo1, equipo2) {
    localStorage.setItem("equipo1Seleccionado", equipo1);
    localStorage.setItem("equipo2Seleccionado", equipo2);
}


function restaurarValoresDesdeLocalStorage() {
    const inputs = document.querySelectorAll("input[type='text']");
    inputs.forEach(input => {
        const valorGuardado = localStorage.getItem(input.id);
        if (valorGuardado) {
            input.value = valorGuardado;
        }
    });
}


function cargarDropdowns() {
    const dropdown1 = document.getElementById("equipo1");
    const dropdown2 = document.getElementById("equipo2");

    equiposJSON.equipos.forEach(equipo => {
        let option1 = document.createElement("option");
        option1.value = equipo.nombre;
        option1.text = equipo.nombre;
        dropdown1.add(option1);

        let option2 = document.createElement("option");
        option2.value = equipo.nombre;
        option2.text = equipo.nombre;
        dropdown2.add(option2);
    });
}

function mostrarPartidos() {
    const nombreEquipo1 = localStorage.getItem("equipo1Seleccionado") || document.getElementById("equipo1").value;
    const nombreEquipo2 = localStorage.getItem("equipo2Seleccionado") || document.getElementById("equipo2").value;
    
    // Guardar los equipos seleccionados en localStorage si no están ya almacenados
    if (!localStorage.getItem("equipo1Seleccionado") || !localStorage.getItem("equipo2Seleccionado")) {
        guardarEquiposSeleccionados(nombreEquipo1, nombreEquipo2);
    }

    const equipo1 = equiposJSON.equipos.find(e => e.nombre === nombreEquipo1);
    const equipo2 = equiposJSON.equipos.find(e => e.nombre === nombreEquipo2);

    if (!equipo1 || !equipo2 || equipo1 === equipo2) {
        alert("Selecciona equipos diferentes.");
        localStorage.clear(); // Limpiar el localStorage si los equipos son iguales
        return;
    }

    const partidosContainer = document.getElementById("partidos");
    partidosContainer.innerHTML = ""; 

    const cruces = [
        { tipo: "Dobles", jugador1: `${equipo1.jugadores[0].nombre}-${equipo1.jugadores[0].pareja}`, jugador2: `${equipo2.jugadores[0].nombre}-${equipo2.jugadores[0].pareja}` },
        { tipo: "Dobles", jugador1: `${equipo1.jugadores[2].nombre}-${equipo1.jugadores[2].pareja}`, jugador2: `${equipo2.jugadores[2].nombre}-${equipo2.jugadores[2].pareja}` },
        { tipo: "Single", jugador1: equipo1.jugadores[0].nombre, jugador2: equipo2.jugadores[0].nombre },
        { tipo: "Single", jugador1: equipo1.jugadores[1].nombre, jugador2: equipo2.jugadores[2].nombre },
        { tipo: "Single", jugador1: equipo1.jugadores[0].nombre, jugador2: equipo2.jugadores[2].nombre },
        { tipo: "Single", jugador1: equipo1.jugadores[1].nombre, jugador2: equipo2.jugadores[0].nombre },
        { tipo: "Single", jugador1: equipo1.jugadores[2].nombre, jugador2: equipo2.jugadores[1].nombre },
        { tipo: "Single", jugador1: equipo1.jugadores[3].nombre, jugador2: equipo2.jugadores[3].nombre },
        { tipo: "Single", jugador1: equipo1.jugadores[2].nombre, jugador2: equipo2.jugadores[3].nombre },
        { tipo: "Single", jugador1: equipo1.jugadores[3].nombre, jugador2: equipo2.jugadores[1].nombre }
    ];

    cruces.forEach((cruce, index) => {
        const partidoDiv = document.createElement("div");
        partidoDiv.className = "partido";
        partidoDiv.id = `partido${index + 1}`;

        const titulo = document.createElement("h2");
        titulo.innerText = `${cruce.tipo} ${index + 1}: ${cruce.jugador1} vs ${cruce.jugador2}`;
        partidoDiv.appendChild(titulo);

        const jugadorContainer = document.createElement("div");
        jugadorContainer.className = "jugador-container";

        const { jugadorColumn: jugador1Column, inputs: jugador1Inputs } = crearColumnaJugador(cruce.jugador1, partidoDiv.id, "equipo1");
        const { jugadorColumn: jugador2Column, inputs: jugador2Inputs } = crearColumnaJugador(cruce.jugador2, partidoDiv.id, "equipo2");

        jugadorContainer.appendChild(jugador1Column);
        jugadorContainer.appendChild(jugador2Column);
        partidoDiv.appendChild(jugadorContainer);
        partidosContainer.appendChild(partidoDiv);

        for (let i = 0; i < 5; i++) {
            jugador1Inputs[i].tabIndex = i * 2 + 1;
            jugador2Inputs[i].tabIndex = i * 2 + 2;
        }
    });

    document.getElementById("finalizarPlanilla").style.display = "block";
    document.getElementById("reiniciarAppButton").style.display = "block";

    // Ocultar los dropdowns, el botón y los contadores de puntos
    document.getElementById("equipo1").style.display = "none";
    document.getElementById("equipo2").style.display = "none";
    document.getElementById("generarCrucesButton").style.display = "none";
    document.querySelector(".team-selection button").style.display = "none";
    document.getElementById("contadorEquipo1").style.display = "none";
    document.getElementById("contadorEquipo2").style.display = "none";
}



function finalizarPlanilla() {
    const partidos = document.querySelectorAll(".partido");
    let todosPartidosFinalizados = true;

    partidos.forEach(partido => {
        const totalEquipo1 = parseInt(partido.querySelector(`[id$='_equipo1_total']`).value) || 0;
        const totalEquipo2 = parseInt(partido.querySelector(`[id$='_equipo2_total']`).value) || 0;

        // Verificar que alguno de los jugadores ha ganado 3 sets
        if (totalEquipo1 < 3 && totalEquipo2 < 3) {
            todosPartidosFinalizados = false;
        }
    });

    if (todosPartidosFinalizados) {
        // Si todos los partidos están completos, muestra el botón para descargar el PDF
        document.getElementById("finalizarPlanilla").style.display = "none";
        document.getElementById("generatePDF").style.display = "block";
    } else {
        // Si falta algún resultado, muestra una alerta
        alert("Aún hay partidos sin un resultado final.");
    }
}

function crearColumnaJugador(jugador, partidoId, equipo) {
    const jugadorColumn = document.createElement("div");
    jugadorColumn.className = "jugador-columnas";

    const label = document.createElement("label");
    label.innerText = jugador;
    jugadorColumn.appendChild(label);

    const inputs = [];
    for (let i = 1; i <= 5; i++) {
        const input = document.createElement("input");
        input.type = "text";
        input.id = `${partidoId}_${equipo}_set${i}`;
        input.placeholder = `Set ${i}`;
        input.onblur = () => calcularTotal(partidoId);

        input.oninput = () => guardarValorEnLocalStorage(input.id, input.value);

        const valorGuardado = localStorage.getItem(input.id);
        if (valorGuardado) {
            input.value = valorGuardado;
        }

        jugadorColumn.appendChild(input);
        inputs.push(input);
    }

    const total = document.createElement("input");
    total.type = "text";
    total.id = `${partidoId}_${equipo}_total`;
    total.placeholder = "Total";
    total.readOnly = true;
    
    // Restaurar el valor del total si existe en el localStorage
    const totalGuardado = localStorage.getItem(total.id);
    if (totalGuardado) {
        total.value = totalGuardado;
    }
    
    jugadorColumn.appendChild(total);

    return { jugadorColumn, inputs };
}


function guardarValorEnLocalStorage(id, valor) {
    localStorage.setItem(id, valor);
}


function calcularTotal(partidoId) {
    let totalEquipo1 = 0;
    let totalEquipo2 = 0;

    for (let i = 1; i <= 5; i++) {
        const setEquipo1 = document.getElementById(`${partidoId}_equipo1_set${i}`).value;
        const setEquipo2 = document.getElementById(`${partidoId}_equipo2_set${i}`).value;

        if (setEquipo1 && setEquipo2) {
            const puntosEquipo1 = parseInt(setEquipo1);
            const puntosEquipo2 = parseInt(setEquipo2);

            if (!isNaN(puntosEquipo1) && !isNaN(puntosEquipo2)) {
                const diferencia = Math.abs(puntosEquipo1 - puntosEquipo2);

                if (
                    (puntosEquipo1 === 11 && puntosEquipo2 <= 9) ||
                    (puntosEquipo2 === 11 && puntosEquipo1 <= 9) ||
                    (diferencia === 2 && (puntosEquipo1 >= 11 || puntosEquipo2 >= 11))
                ) {
                    if (puntosEquipo1 > puntosEquipo2) {
                        totalEquipo1++;
                    } else {
                        totalEquipo2++;
                    }

                    if (totalEquipo1 === 3 || totalEquipo2 === 3) {
                        deshabilitarSetsRestantes(partidoId, i + 1);
                        break;
                    }
                }
            }
        }
    }

    document.getElementById(`${partidoId}_equipo1_total`).value = totalEquipo1;
    document.getElementById(`${partidoId}_equipo2_total`).value = totalEquipo2;
    actualizarContadores();
}

function deshabilitarSetsRestantes(partidoId, desdeSet) {
    for (let i = desdeSet; i <= 5; i++) {
        const equipo1Set = document.getElementById(`${partidoId}_equipo1_set${i}`);
        const equipo2Set = document.getElementById(`${partidoId}_equipo2_set${i}`);
        
        equipo1Set.value = ''; 
        equipo1Set.disabled = true; 
        
        equipo2Set.value = ''; 
        equipo2Set.disabled = true;
    }
}

function actualizarContadores() {
    let contadorEquipo1 = 0;
    let contadorEquipo2 = 0;

    const totalInputsEquipo1 = document.querySelectorAll("[id$='_equipo1_total']");
    const totalInputsEquipo2 = document.querySelectorAll("[id$='_equipo2_total']");

    totalInputsEquipo1.forEach(input => {
        contadorEquipo1 += parseInt(input.value) || 0;
    });
    totalInputsEquipo2.forEach(input => {
        contadorEquipo2 += parseInt(input.value) || 0;
    });

    document.getElementById("contadorEquipo1").innerText = `Puntos: ${contadorEquipo1}`;
    document.getElementById("contadorEquipo2").innerText = `Puntos: ${contadorEquipo2}`;
}

function resetearContadores() {
    document.getElementById("contadorEquipo1").innerText = "Puntos: 0";
    document.getElementById("contadorEquipo2").innerText = "Puntos: 0";
}

function generarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Obtener nombres de equipos desde localStorage
    const nombreEquipo1 = localStorage.getItem("equipo1Seleccionado");
    const nombreEquipo2 = localStorage.getItem("equipo2Seleccionado");

    doc.setFontSize(16);
    doc.text("Resultados del Encuentro de Tenis de Mesa", 20, 20);

    // Agregar contadores de sets ganados de cada equipo con sus nombres
    const contadorEquipo1 = document.getElementById("contadorEquipo1").innerText.replace("Puntos:", "Puntos");
    const contadorEquipo2 = document.getElementById("contadorEquipo2").innerText.replace("Puntos:", "Puntos");
    doc.setFontSize(12);
    doc.text(`${nombreEquipo1}: ${contadorEquipo1}`, 20, 40);
    doc.text(`${nombreEquipo2}: ${contadorEquipo2}`, 20, 50);

    // Agregar resultados de cada partido en formato de tabla
    const partidos = document.querySelectorAll(".partido");
    let yOffset = 60;

    doc.line(20, yOffset - 5, 190, yOffset - 5);  // Dibuja una línea divisoria horizontal

    partidos.forEach((partido, index) => {
        const titulo = partido.querySelector("h2").innerText;
        const jugadores = titulo.split(" vs ");
        const jugadorEquipo1 = jugadores[0].split(": ")[1] || jugadores[0];
        const jugadorEquipo2 = jugadores[1] || "-";

        const equipo1Sets = [];
        const equipo2Sets = [];
        for (let i = 1; i <= 5; i++) {
            const setEquipo1 = partido.querySelector(`#${partido.id}_equipo1_set${i}`).value || "-";
            const setEquipo2 = partido.querySelector(`#${partido.id}_equipo2_set${i}`).value || "-";
            equipo1Sets.push(setEquipo1);
            equipo2Sets.push(setEquipo2);
        }

        const equipo1Total = partido.querySelector(`#${partido.id}_equipo1_total`).value || "0";
        const equipo2Total = partido.querySelector(`#${partido.id}_equipo2_total`).value || "0";

        const tableData = [
            [jugadorEquipo1, ...equipo1Sets, equipo1Total],
            [jugadorEquipo2, ...equipo2Sets, equipo2Total]
        ];

        const columns = [
            { header: "Jugador/Equipo", dataKey: "jugador" },
            { header: "Set 1", dataKey: "set1" },
            { header: "Set 2", dataKey: "set2" },
            { header: "Set 3", dataKey: "set3" },
            { header: "Set 4", dataKey: "set4" },
            { header: "Set 5", dataKey: "set5" },
            { header: "Total", dataKey: "total" }
        ];

        doc.text(titulo, 20, yOffset); // Título del partido (e.g., "Dobles 1: Jugador1 - Jugador2 vs Jugador3 - Jugador4")
        doc.autoTable({
            startY: yOffset + 10,
            head: [columns.map(col => col.header)],
            body: tableData,
            theme: "grid",
            headStyles: { fillColor: [240, 240, 240], textColor: 0 },
            margin: { left: 20, right: 20 }
        });

        yOffset = doc.autoTable.previous.finalY + 10;
        if (yOffset > 270) {
            doc.addPage();
            yOffset = 20;
        }
    });

    const nombreArchivo = `${nombreEquipo1}_VS_${nombreEquipo2}.pdf`;
    doc.save(nombreArchivo);

    const numeroWhatsApp = "5492616649617";
    const mensaje = `Va adjunto el resultado del enfrentamiento entre ${nombreEquipo1} y ${nombreEquipo2}. (No te olvides de adjuntarlo, se te acaba de descargar en el celu)`;
    const whatsappLink = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappLink, "_blank");

    // Limpiar el localStorage y reiniciar la página
    localStorage.clear();
    location.reload();
}
