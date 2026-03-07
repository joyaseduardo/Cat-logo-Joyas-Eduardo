var DATA=[{"codigo": "8501"}, {"codigo": "8502"}, {"codigo": "8503"}, {"codigo": "8504"}, {"codigo": "8505"}, {"codigo": "8506"}, {"codigo": "8507"}, {"codigo": "8508"}, {"codigo": "8509"}, {"codigo": "8510"}, {"codigo": "8511"}, {"codigo": "8512"}, {"codigo": "8513"}, {"codigo": "8514"}, {"codigo": "8515"}, {"codigo": "8516"}, {"codigo": "8517"}, {"codigo": "8518"}, {"codigo": "8519"}, {"codigo": "8520"}, {"codigo": "8521"}, {"codigo": "8522"}, {"codigo": "8523"}, {"codigo": "8524"}, {"codigo": "8525"}, {"codigo": "8526"}, {"codigo": "8527"}, {"codigo": "8528"}, {"codigo": "8529"}, {"codigo": "8530"}, {"codigo": "8531"}, {"codigo": "8532"}, {"codigo": "8533"}, {"codigo": "8534"}, {"codigo": "8535"}, {"codigo": "8536"}, {"codigo": "8537"}, {"codigo": "8538"}, {"codigo": "8539"}, {"codigo": "8540"}, {"codigo": "8541"}, {"codigo": "8542"}, {"codigo": "8543"}, {"codigo": "8544"}];
var CARPETA="https://res.cloudinary.com/dfsnzdwqx/image/upload";
var NOMBRE="Anillo Oro Mujer";
var CAT="Anillos Oro Mujer";
var WA="5492976235421";

window.onload = function() {
  var grid = document.getElementById("grid");
  if (!grid) return;
  var html = "";
  for (var i = 0; i < DATA.length; i++) {
    var cod = DATA[i].codigo;
    html += "<div class='card'>"
          + "<div class='card-foto'>"
          + "<img src='" + CARPETA + "/" + cod + ".jpg' alt='" + cod + "' onclick='abrirLightbox(this.src,this.alt)' onerror='this.style.display=\"none\";this.nextSibling.style.display=\"flex\"'>"
          + "<div class='placeholder' style='display:none'><span>&#x1F48D;</span><p>" + cod + "</p></div>"
          + "</div>"
          + "<div class='card-body'>"
          + "<div class='card-codigo'>" + cod + "</div>"
          + "<div class='card-nombre'>" + NOMBRE + "</div>"
          + "<div class='btns'>"
          + "<button class='btn btn-wa' onclick='waMsg(\"consultar\",\"" + cod + "\")'>&#x1F4AC; Consultar</button>"
          + "<button class='btn btn-talla' onclick='waMsg(\"talla\",\"" + cod + "\")'>&#x1F4CF; Talla</button>"
          + "</div>"
          + "<div class='btns-full'>"
          + "<button class='btn btn-envio' onclick='waMsg(\"envio\",\"" + cod + "\")'>&#x1F4E6; Envio</button>"
          + "<button class='btn btn-res' onclick='waMsg(\"reservar\",\"" + cod + "\")'>&#x1F512; Reservar</button>"
          + "</div>"
          + "</div></div>";
  }
  grid.innerHTML = html;
};

function waMsg(tipo, cod) {
  var base = "Codigo: " + cod + " (" + CAT + ")";
  var msgs = {
    consultar: "Hola! Me interesa\n\n" + base + "\n\nEsta disponible?",
    talla:     "Hola! Necesito ayuda con la talla para:\n\n" + base,
    envio:     "Hola! Cual es el costo de envio para:\n\n" + base + "?",
    reservar:  "Hola! Quiero RESERVAR:\n\n" + base
  };
  window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(msgs[tipo]), "_blank");
}
