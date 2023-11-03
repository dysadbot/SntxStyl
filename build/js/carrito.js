// ======== VARIABLES =============== \\
// ================================== \\
const carrito = document.querySelector('.container-cart-icon');
const containerCartProducts = document.querySelector('.container-cart-products');
const botonPagar = document.querySelector('.contenedor_pagar');
const productList = document.querySelector('.contenedor-productos');
const cartInfo = document.querySelector('.cart-product');
const rowProduct = document.querySelector('.row-product');
let allProducts = []; // Variable de arreglos de Productos
const valorTotal = document.querySelector('.total-pagar');
const countProducts = document.querySelector('#contador-productos');
const cartEmpty = document.querySelector('.cart-empty');
const cartTotal = document.querySelector('.cart-total');

cargarEventListeners();
function cargarEventListeners() {
    if (productList) {
        productList.addEventListener('click', agregarProducto);
    }
    if (rowProduct) {
        rowProduct.addEventListener('click', eliminarCurso);
    }
    if (carrito) {
        carrito.addEventListener('click', ocultarCarrito);
    }
    document.addEventListener('DOMContentLoaded', () => {
        allProducts = JSON.parse( localStorage.getItem('carrito') ) || [];

        showHTML();
    })
}

// === FUNCIONES ==== \\
document.addEventListener('click', function(e) { // DEBUGEAR
    var elementoClicado = e.target;
    console.log('Se hizo clic en el elemento:', elementoClicado);
  });
function ocultarCarrito() {
    containerCartProducts.classList.toggle('hidden-cart');
};

function agregarProducto(e) {
    if(e.target.classList.contains('agregar-carrito')){
        const product = e.target.parentElement.parentElement;
        const selectedSize = product.querySelector('.talla-option').value;
        if (selectedSize === "Seleccionar Talla") {
            alert("Por favor, selecciona una talla antes de agregar al carrito.");
            return; // Detiene la ejecución de la función si no se seleccionó una talla válida
        }

        const infoProduct = {
            quantity: 1,
            title: product.querySelector('h2').innerText,
            price: product.querySelector('p').innerText,
            selectedSize: selectedSize
        };
        // Actualizar el no. de producto
        const exist = allProducts.some(product => product.title === infoProduct.title && product.selectedSize == infoProduct.selectedSize );
        if (exist){
            const products = allProducts.map(product => {
                if(product.title === infoProduct.title) {
                    product.quantity++;
                    return product;
                } else {
                    return product;
                }
            });
            allProducts = [...products];
        } else {
            allProducts = [...allProducts, infoProduct];
    }
        showHTML();
    }
};
// Funcion para Mostrar en Carrito
const showHTML = () => {
    if(!allProducts.length){
		cartEmpty.classList.remove('hidden');
		rowProduct.classList.add('hidden');
		cartTotal.classList.add('hidden');
        botonPagar.classList.add('hidden');
    } else {
        cartEmpty.classList.add('hidden');
		rowProduct.classList.remove('hidden');
		cartTotal.classList.remove('hidden');
        botonPagar.classList.remove('hidden');
    }
    //Limpiar HTML
    rowProduct.innerHTML='';
    let total = 0;
    let totalOfProducts = 0;
    allProducts.forEach(product =>  {
        const containerProduct = document.createElement('div');
        containerProduct.classList.add('cart-product');
        containerProduct.innerHTML =  `
            <div class="info-cart-product">
                <span class="cantidad-producto-carrito">${product.quantity}</span>
                
                <p class="titulo-producto-carrito">${product.title}</p>
                <p class="talla-producto-carrito">${product.selectedSize}</p>
                <span class="precio-producto-carrito">${product.price}</span>
                
            </div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="icon-close"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
            
        `;
        rowProduct.append(containerProduct);
        // Actualizar contador y total
        total = total + parseInt(product.quantity * product.price.slice(1));
        totalOfProducts = totalOfProducts + product.quantity;
    });
    valorTotal.innerText = `$${total}`;
    countProducts.innerText = totalOfProducts;

    //Agregar el carrito en el LocalStorage
    sincronizarStorage();
};

function sincronizarStorage (){
    localStorage.setItem('carrito', JSON.stringify(allProducts));
}

function eliminarCurso(e) {
    if(e.target.classList.contains('icon-close')){
        const product = e.target.parentElement;
        const title = product.querySelector('p').innerText;
        const selectedSize = product.querySelector('.talla-producto-carrito').innerText
        const indexToRemove = allProducts.findIndex(product => product.title === title && product.selectedSize === selectedSize);
        if (indexToRemove !== -1) {
            if (allProducts[indexToRemove].quantity > 1) {
                allProducts[indexToRemove].quantity--; 
            } else {
                allProducts.splice(indexToRemove, 1); 
            }
        };

            showHTML()
    }
};

