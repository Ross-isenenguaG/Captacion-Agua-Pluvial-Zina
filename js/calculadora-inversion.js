document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("calc-form");
    const resultPanel = document.getElementById("result-panel");
    const chartWrap = document.querySelector(".chart-wrap");
    const ctx = document.getElementById("resultsChart").getContext("2d");
    const errors = document.getElementById("errors");

    let myChart;

    function mostrarResultados(datos) {
        const { litrosCaptados, ahorroAnual, tiempoRecuperacion } = datos;

        resultPanel.innerHTML = `
            <h3>Resultados</h3>
            <p>Litros captados: <strong>${litrosCaptados.toFixed(2)} L</strong></p>
            <p>Ahorro aproximado por año: <strong>$${ahorroAnual.toFixed(2)}</strong></p>
            <p>Tiempo estimado para recuperar inversión: <strong>${tiempoRecuperacion} años</strong></p>
            <p>Comparte tu resultado:</p>
            <button id="shareFacebook">Facebook</button>
            <button id="shareWhatsApp">WhatsApp</button>
        `;
        const usos = ["Riego Jardín", "Limpieza", "Lavado de Autos", "Sanitario"];
        const cantidades = [
            litrosCaptados * 0.4,
            litrosCaptados * 0.3,
            litrosCaptados * 0.2,
            litrosCaptados * 0.1
        ];

        chartWrap.style.display = "block";
        if (myChart) myChart.destroy();
        myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: usos,
                datasets: [{
                    label: 'Uso del agua captada (litros)',
                    data: cantidades,
                    backgroundColor: ['#4caf50', '#2196f3', '#ff9800', '#9c27b0']
                }]
            },
            options: {
                responsive: true
            }
        });
        document.getElementById("shareWhatsApp").addEventListener("click", () => {
            const mensaje = `He calculado que puedo captar ${litrosCaptados.toFixed(2)} L de agua de lluvia, ahorrando aproximadamente $${ahorroAnual.toFixed(2)} al año. ¡Tú también puedes hacerlo!`;
            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(mensaje)}`, '_blank');
        });

        document.getElementById("shareFacebook").addEventListener("click", () => {
            const url = `https://www.facebook.com/sharer/sharer.php?u=&quote=He calculado que puedo captar ${litrosCaptados.toFixed(2)} L de agua de lluvia, ahorrando aproximadamente $${ahorroAnual.toFixed(2)} al año. ¡Tú también puedes hacerlo!`;
            window.open(url, '_blank');
        });
    }
    const datosGuardados = localStorage.getItem("resultadosAgua");
    if (datosGuardados) {
        const datos = JSON.parse(datosGuardados);
        mostrarResultados(datos);
    }
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const area = parseFloat(document.getElementById("area").value);
        const precipitacion = parseFloat(document.getElementById("precipitacion").value);
        const eficiencia = parseFloat(document.getElementById("eficiencia").value) / 100;
        const presupuesto = parseFloat(document.getElementById("presupuesto").value);

        if (isNaN(area) || isNaN(precipitacion) || isNaN(eficiencia) || isNaN(presupuesto) ||
            area <= 0 || precipitacion <= 0 || eficiencia <= 0 || presupuesto <= 0) {
            errors.innerText = "Todos los campos deben ser mayores a cero.";
            return;
        } else {
            errors.innerText = "";
        }

        const litrosCaptados = area * precipitacion * eficiencia;
        const metrosCubicos = litrosCaptados / 1000;
        const precioAgua = 20;
        const ahorroAnual = metrosCubicos * precioAgua;
        const tiempoRecuperacion = ahorroAnual > 0 ? (presupuesto / ahorroAnual).toFixed(1) : "∞";

        const resultados = { litrosCaptados, ahorroAnual, tiempoRecuperacion };

        localStorage.setItem("resultadosAgua", JSON.stringify(resultados));
        mostrarResultados(resultados);
    });
    document.getElementById("limpiar").addEventListener("click", function () {
        form.reset();
        resultPanel.innerHTML = '<p style="color:var(--muted)">Aquí se mostrarán los resultados una vez que completes el formulario.</p>';
        chartWrap.style.display = "none";
        if (myChart) myChart.destroy();
        localStorage.removeItem("resultadosAgua");
    });

});
