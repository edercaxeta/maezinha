function isNumberKey(evt) {
  var charCode = evt.which ? evt.which : evt.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
}

$(document).ready(function () {
  $("#inputZip").on("input", function () {
    var cep = $(this).val().replace(/\D/g, "");
    if (cep.length == 8) {
      $.getJSON(`https://viacep.com.br/ws/${cep}/json/`, function (data) {
        if (!("erro" in data)) {
          $("#inputAddress").val(data.logradouro);
          $("#inputCity").val(data.localidade);
          $("#inputState").val(data.uf);
          // Preencha outros campos de endereço, se necessário
        } else {
          alert("CEP não encontrado.");
        }
      });
    }
  });
});

function enviar(nome, email, senha, cep, logradouro, complemento, cidade, estado, aceite) {
  const data = {
    nome: nome,
    email: email,
    senha: senha,
    cep: cep,
    logradouro: logradouro,
    complemento: complemento,
    cidade: cidade,
    estado: estado,
    aceite: aceite,
  };

  fetch("https://apiwpp.apaebrasil.org.br/user", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      Swal.fire({
        title: "Sucesso",
        text: "Usuário Cadastrado Com Sucesso",
        icon: "success",
      });
    })
    .catch((error) => {
      Swal.fire({
        title: "Erro",
        text: "Houve um Erro ao Salvar os Dados",
        icon: "error",
      });
    });

  listar();
}

function salvar() {
  let nome = document.getElementById("nome").value;
  let inputEmail4 = document.getElementById("inputEmail4").value;
  let inputPassword4 = document.getElementById("inputPassword4").value;
  let inputZip = document.getElementById("inputZip").value;
  let inputAddress = document.getElementById("inputAddress").value;
  let inputAddress2 = document.getElementById("inputAddress2").value;
  let inputCity = document.getElementById("inputCity").value;
  let inputState = document.getElementById("inputState").value;
  let gridCheck = document.getElementById("gridCheck").checked;

  console.log(nome, inputEmail4, inputPassword4, inputZip, inputAddress, inputAddress2, inputCity, inputState, gridCheck);

  let erros = [];
  if (nome.indexOf(" ") === -1) {
    erros.push("Preencha o nome completo");
  }
  if (inputEmail4.indexOf("@") < 0) {
    erros.push("Email inválido");
  }
  if (inputPassword4.length < 8) {
    erros.push("A senha teve ter pelos monos 8 caracteres");
  }
  if (inputZip.length < 7) {
    erros.push("O CEP teve ter pelos monos 7 caracteres");
  }
  if (inputAddress.length < 1) {
    erros.push("Preencha o Logradouro completo");
  }
  if (inputAddress2.length < 1) {
    erros.push("Preencha o Complemnto completo");
  }
  if (inputCity.length < 1) {
    erros.push("Preencha a Cidade completo");
  }
  if (inputState.length < 1) {
    erros.push("Preencha o Estado completo");
  }
  if (gridCheck === false) {
    erros.push("Tem que aceitar os Termos");
  }
  console.log(erros);

  if (erros.length == 0) {
    enviar(nome, inputEmail4, inputPassword4, inputZip, inputAddress, inputAddress2, inputCity, inputState, gridCheck);
  } else {
    Swal.fire({
      title: "Preecha os Campos Corretamente!",
      html: erros.join("<br>"),
      icon: "error",
    });
  }

  return false;
}

function listar() {
  fetch("https://apiwpp.apaebrasil.org.br/users", {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      renderizar(result);
    })
    .catch((error) => {
      Swal.fire({
        title: "Erro",
        text: "Houve um Erro ao listar os Dados",
        icon: "error",
      });
    });

  function renderizar(Categoria) {
    let tabela = document.querySelector("#tabela tbody");
    while (tabela.firstChild) {
      tabela.removeChild(tabela.firstChild);
    }

    for (let categoria of Categoria) {
      let linha = `
        <tr>
          <td>${categoria.id}</td>
          <td>${categoria.nome}</td>
          <td>${categoria.email}</td>
          <td>${categoria.senha}</td>
          <td>${categoria.cep}</td>
          <td>${categoria.logradouro}</td>
          <td>${categoria.complemento}</td>
          <td>${categoria.cidade}</td>
          <td>${categoria.estado}</td>
          <td>
          <button style="background: red; color: white; padding: 4px; border-radius: 9px; border: none;" onclick="excluir('${categoria.id}');">Excluir</button>
          </td>
        </tr>
      `;
      let tr = document.createElement("tr");
      tr.innerHTML = linha;
      tabela.appendChild(tr);
    }
  }
}

function excluir(id) {
  fetch("https://apiwpp.apaebrasil.org.br/delete-user/" + id, {
    method: "DELETE",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      listar();
    })
    .catch((error) => {
      Swal.fire({
        title: "Erro",
        text: "Houve um Erro ao Excluir Usuario",
        icon: "error",
      });
      listar();
    });

    listar();

}

// Função para fazer o login
function login(email, senha) {
  const data = {
    email: email,
    senha: senha,
  };

  // Depuração: exibe os dados enviados para o servidor
  console.log("Enviando dados para o servidor:", data);

  fetch("http://localhost:5249/api/Categoria/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      // Verifica se a resposta não é um sucesso
      if (!response.ok) {
        throw new Error("Erro ao fazer login");
      }
      return response.json(); // Converte a resposta para JSON
    })
    .then((result) => {
      // Depuração: exibe os dados recebidos do servidor
      console.log("Resposta do servidor:", result);
      if (result.user && result.user.id) {
        // Se o usuário estiver presente na resposta, consideramos o login bem-sucedido
        localStorage.setItem("token", result.token);
        Swal.fire({
          title: "Sucesso",
          text: "Login realizado com sucesso",
          icon: "success",
        });
      } else {
        // Se não houver usuário na resposta, exibe uma mensagem de erro
        throw new Error("Email ou senha incorretos");
      }
    })
    .catch((error) => {
      // Exibe uma mensagem de erro caso ocorra algum problema
      console.error("Erro ao realizar login:", error);
      Swal.fire({
        title: "Erro",
        text: "Houve um erro ao realizar o login",
        icon: "error",
      });
    });
}

// Função para validar o formulário de login
function validarLogin() {
  let email = document.getElementById("emailLogin").value;
  let senha = document.getElementById("senhaLogin").value;

  let erros = [];
  if (email.indexOf("@") === -1) {
    erros.push("Email inválido");
  }
  if (senha.length < 8) {
    erros.push("A senha deve ter pelo menos 8 caracteres");
  }

  if (erros.length === 0) {
    login(email, senha); // Chama a função de login se não houver erros de validação
  } else {
    // Exibe mensagens de erro se houver problemas de validação
    Swal.fire({
      title: "Preencha os Campos Corretamente!",
      html: erros.join("<br>"),
      icon: "error",
    });
  }

  return false; // Impede o envio do formulário
}

function previewImage() {
  var inputFile = document.getElementById("inputFile");
  if (inputFile.files && inputFile.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("imagePreview").innerHTML =
        '<img src="' +
        e.target.result +
        '" alt="Imagem selecionada" style="max-width: 100%; height: auto;">' +
        '<button class="btn btn-danger delete-btn" onclick="deleteImage()" style="margin-top: 10px;">Excluir</button>';
    };
    reader.readAsDataURL(inputFile.files[0]);
  }
}

function deleteImage() {
  document.getElementById("imagePreview").innerHTML = "";
  document.getElementById("inputFile").value = "";
}

function submitForm() {
  var nome = document.getElementById("inputNome").value;
  var email = document.getElementById("inputEmail").value;
  var doacao = document.getElementById("inputDoacao").value;

  var mailto_link =
    "mailto:edercaxeta10@hotmail.com?subject=Nova Doação&body=" +
    "Nome: " +
    encodeURIComponent(nome) +
    "%0D%0A" +
    "Email: " +
    encodeURIComponent(email) +
    "%0D%0A" +
    "Doação: " +
    encodeURIComponent(doacao);

  window.location.href = mailto_link;
}

function validarLogin() {
  const email = document.getElementById("emailLogin").value;
  const senha = document.getElementById("senhaLogin").value;

  console.log("Email digitado:", email);  // Log do email digitado
  console.log("Senha digitada:", senha);  // Log da senha digitada

  // Substitua pelos seus dados de login reais
  const emailCorreto = "edercaxeta10@hotmail.com";
  const senhaCorreta = "Gabi@1020";

  if (email === emailCorreto && senha === senhaCorreta) {
    console.log("Credenciais corretas");  // Log de credenciais corretas
    sessionStorage.setItem("authenticated", "true");

    // Caminho relativo ao diretório raiz do site
    let relativePath = "";
    const currentPath = window.location.pathname.split('/');

    // Determina a profundidade do caminho atual
    for (let i = 0; i < currentPath.length - 1; i++) {
      if (currentPath[i] !== "") {
        relativePath += "../";
      }
    }

    console.log("Caminho relativo calculado:", relativePath);  // Log do caminho relativo calculado

    // Redireciona usando o caminho relativo calculado
    window.location.href = relativePath + "assets/pages/cadastroPro.html";

    return false;
  } else {
    alert("Credenciais inválidas");
    console.log("Credenciais inválidas");  // Log de credenciais inválidas
    return false;
  }
}

