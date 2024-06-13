function menuMobile() {
  const navbar = document.querySelector(".navbar");
  const menuButton = document.querySelector(".menu-button");

  menuButton.addEventListener("click", () => {
    navbar.classList.toggle("show-menu");
  });
}
menuMobile();

function isNumberKey(evt) {
  var charCode = evt.which ? evt.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
}

$(document).ready(function () {
  $("#inputZip").on("blur", function () {
    var cep = $(this).val().replace(/\D/g, "");
    if (cep.length == 8) {
      $.getJSON(`https://viacep.com.br/ws/${cep}/json/`, function (data) {
        console.log(data); // Verifique se os dados estão sendo retornados corretamente
        if (!("erro" in data)) {
          $("#inputAddress").val(data.logradouro);
          $("#inputCity").val(data.localidade);
          $("#inputState").val(data.uf);
          // Preencha outros campos de endereço, se necessário
        } else {
          alert("CEP não encontrado.");
        }
      }).fail(function() {
        alert("Erro ao acessar a API de CEP.");
      });
    }
  });
});

