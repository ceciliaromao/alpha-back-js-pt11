const msg = document.querySelector('#msg');
let allProducts = [];
let product = {};
let id = 0;
let currentId = 0;
let newProduct = true;
let modalId;
let nameAsc = false;
let priceAsc = false;
let search = false;

function validateData(name, description, price) {
  if (name === '') throw new Error(`Falha no cadastro do produto: Nome inválido!`);
  if (description === '') throw new Error(`Falha no cadastro do produto: Descrição inválida!`);
  if (isNaN(price) || price <= 0) throw new Error(`Falha no cadastro do produto: Valor (${price}) inválido!`);

  for (let el of allProducts) {
    if (el.name.toLowerCase() === name.toLowerCase() && (newProduct || el.id != currentId)) {
      throw new Error(`Outro produto está cadastrado com este nome!`);
    };
  }
}

function saveProduct() {
  let name = document.querySelector("#name").value.trim();
  let description = document.querySelector("#description").value.trim();
  let price = parseFloat(document.querySelector('#price').value.replace(",", "."));

  try {
    validateData(name, description, price);
    if (newProduct) {
      document.querySelector('#details-ctn').style.display = 'none';
      product = { id, name, description, price, createdAt: Date.now(), };
      allProducts.push(product);
      msg.textContent = `Produto ${product.name.toLowerCase()} incluído com sucesso`;
      id++;
    } else {
      for (let i = 0; i < allProducts.length; i++) {
        if (allProducts[i].id === currentId) {
          allProducts[i].name = name;
          allProducts[i].description = description;
          allProducts[i].price = price;
          msg.textContent = `Produto ${allProducts[i].name} editado com sucesso`;
          if (document.querySelector('#details-ctn').style.display === 'flex') {
            showProduct(i);
          }
          break;
        };
      }
    }
    if (document.querySelector('#products-ctn').style.display == 'flex') {
      listProducts(allProducts);
    }
    document.querySelector("#name").value = '';
    document.querySelector("#description").value = '';
    document.querySelector('#price').value = '';
    document.querySelector("#save").textContent = 'Incluir produto';
  } catch (err) {
    msg.textContent = err;
    return false;
  }
}

function listProducts(array) {
  if (array.length === 0) {
    document.querySelector('#products-ctn').style.display = 'none';
    document.querySelector('#details-ctn').style.display = 'none';

    if (!search) msg.innerHTML = `Não há produtos cadastrados`;
    else msg.innerHTML = `Não foram encontrados produtos conforme chave de pesquisa!`;

  } else {
    const table = document.querySelector('#products-table');
    table.innerHTML = `
    <tr> 
      <th onclick="sortName(list)" style="cursor: pointer;" >Produto ⇵</th> 
      <th onclick="sortPrice(list)" style="cursor: pointer;" >Valor ⇵</th>
      <th>Editar</th>
      <th>Apagar</th>
    </tr>`

    for (let el of array) {
      table.innerHTML += `
      <tr> 
        <td class="show-product" onclick="showProduct(${el.id})">${el.name}</td> 
        <td class="show-product" onclick="showProduct(${el.id})">${el.price.toFixed(2)}</td>
        <td class="edit-icon" onclick="editProduct(${el.id})"><i class="material-icons">edit</i></td>
        <td class="del-icon" onclick="showModal(${el.id})"><i class="material-icons">delete</i></td>
      </tr>`
    }
    if (!search) msg.innerHTML = `&nbsp`;
    document.querySelector('#products-ctn').style.display = 'flex';
  }
}

function sortName(list) {
  if (!nameAsc) {
    list.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    })
    nameAsc = true;
    priceAsc = false;
  } else {
    list.sort((a, b) => {
      if (b.name < a.name) {
        return -1;
      }
      if (b.name > a.name) {
        return 1;
      }
      return 0;
    })
    nameAsc = false;
    priceAsc = false;
  }
  listProducts(list);
}

function sortPrice(list) {
  if (!priceAsc) {
    list.sort((a, b) => a.price - b.price);
    priceAsc = true;
    nameAsc = false;
  } else {
    list.sort((a, b) => b.price - a.price);
    priceAsc = false;
    nameAsc = false;
  }
  listProducts(list);
}

function editProduct(Id) {
  msg.innerHTML = `&nbsp`;
  newProduct = false;
  currentId = allProducts[Id].id;
  document.querySelector("#save").textContent = 'Salvar produto';
  document.querySelector('#name').value = allProducts[Id].name;
  document.querySelector('#description').value = allProducts[Id].description;
  document.querySelector('#price').value = allProducts[Id].price;

  if (document.querySelector('#details-ctn').style.display === 'flex') {
    showProduct(Id);
  }
}

function showModal(Id) {
  document.querySelector('.modal').style.display = 'flex';
  modalId = Id;
}

function closeModal() {
  document.querySelector('.modal').style.display = 'none';
}

function deleteProduct() {
  allProducts.splice(modalId, 1);
  cancel();
  listProducts(allProducts);
  closeModal();
}

function showProduct(Id) {
  const productDetails = document.querySelector('#details-table');
  const date = new Date(allProducts[Id].createdAt);

  productDetails.innerHTML = `
  <tr> 
    <th colspan="2">Detalhes do Produto</th> 
  </tr>
  <tr> 
    <th>Id</th>
    <td>${allProducts[Id].id}</td> 
  </tr>
  <tr>  
    <th>Nome</th>
    <td>${allProducts[Id].name}</td> 
  </tr>
  <tr>  
    <th>Descrição</th>
    <td>${allProducts[Id].description}</td>  
  </tr>
  <tr>  
    <th>Valor</th>
    <td>${allProducts[Id].price.toFixed(2)}</td>
  </tr>
  <tr>  
    <th>Incluído Em</th>
    <td>${date.toLocaleDateString()} - ${date.toLocaleTimeString()}</td>
  </tr>`

  document.querySelector('#details-ctn').style.display = 'flex';
}

function cancel() {
  newProduct = true;
  msg.innerHTML = `&nbsp`;
  document.querySelector("#name").value = '';
  document.querySelector("#description").value = '';
  document.querySelector('#price').value = '';
  document.querySelector("#save").textContent = 'Incluir produto';
  document.querySelector('#products-ctn').style.display = 'none';
  document.querySelector('#details-ctn').style.display = 'none';
}

function searchProducts() {
  const query = document.querySelector('#search').value.toLowerCase();
  let newList = [];
  search = true;

  if (query == "") {
    newList = allProducts;
  } else {
    newList = allProducts.filter(el => el.name.includes(query) || el.description.includes(query));
  }

  if (newList.length) {
    msg.innerHTML = `${newList.length == 1 ? "Foi encontrado" : "Foram encontrados"} ${newList.length} produto${newList.length > 1 ? "s" : ""}.`
  }

  listProducts(newList);
}

document.getElementById('save').addEventListener('click', saveProduct);
document.getElementById('list').addEventListener('click', function () { search = false; listProducts(allProducts) });
document.getElementById('yes').addEventListener('click', deleteProduct);
document.getElementById('no').addEventListener('click', closeModal);
document.getElementById('cancel').addEventListener('click', cancel);
document.getElementById('search-btn').addEventListener('click', searchProducts);