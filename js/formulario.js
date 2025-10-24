document.getElementById("contactoForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const formData = new FormData(this);

    fetch("enviar.php", {
     method: "POST",
    body: formData
 })
.then(response => response.text())
.then(data => {
alert(data.includes("Mensaje enviado correctamente") ? "Mensaje enviado correctamente." : "Error al enviar el mensaje.");
               
document.getElementById("contactoForm").reset();
    })
    .catch(error => {
    alert("Ocurrió un error al enviar el mensaje.");
    console.error("Error:", error);
            });
         });