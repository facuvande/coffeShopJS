const $productsContainer = document.getElementById('productsContainer');
const $comprar = document.querySelectorAll('#comprar')
const $cantidadCart = document.getElementById('numero')
const $contenedorCompra = document.getElementById('contenedorCompra')
const $productosCompra = document.getElementById('productosCompra')
const $btnEliminar = document.getElementsByClassName('noselect')
const $total = document.getElementById('total')
const $input = document.getElementById('search')

let listadoCarrito = []

document.addEventListener('DOMContentLoaded', () =>{
    fetchData()
})

const fetchData = async () => {
    try{
        const res = await fetch('../js/data/products.json')
        const data = await res.json()
        showProducts(data)
    } catch (error){
        console.log(error)
    }
}

function showProducts(products){
    products.forEach(el => {
        const $div = document.createElement("div")
        
        $div.classList.add("product")
        $div.setAttribute("data-id", el.id)
        // Debemos iniciarla como vacia ya que sino marca error porque no esta inicializada
        $div.innerHTML = ""
        $div.innerHTML += `
        <img src="${el.img}" alt="${el.variedad}">
        <h2>${el.marca}</h2>
        <p class="description">${el.variedad}</p>
        <p class="price">$ ${el.precio}</p>
        <button id="comprar">Comprar</button>
        `
        $productsContainer.appendChild($div)

    })
}


document.addEventListener("click", (e) =>{
    if(e.target.matches('#comprar')){
        Toastify({
            text: `El producto ${e.target.parentElement.querySelector('.description').textContent} se agrego correctamente`,
            duration: 2000,
            newWindow: true,
            close: false,
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: false, // Prevents dismissing of toast on hover
            style: {
                background: "linear-gradient(to right, #008248, #008248)",
            },
            onClick: function(){} // Callback after click
            }).showToast();
        addProductToCart(e.target.parentElement);
    }

    if(e.target.matches('.carrito')){
        $contenedorCompra.classList.add('isActive')
    }
    if(e.target.matches('.x') || e.target.matches('.contenedorCompra')){
        $contenedorCompra.classList.remove('isActive')
    }

    if(e.target.parentElement.matches('.noselect')){
        deleteProductToCart(Number(e.target.parentElement.parentElement.parentElement.getAttribute('data-id')))

    }
    if(e.target.matches('.svg')){
        deleteProductToCart(Number(e.target.parentElement.parentElement.parentElement.parentElement.getAttribute('data-id')))
    }
    if(e.target.matches('.path')){
        deleteProductToCart(Number(e.target.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute('data-id')))
    }

    if(e.target.matches('.limpiar')){
        listadoCarrito = []
        limpiarHtml()
        actualizarNumeroCart();
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Carrito limpiado correctamente',
            showConfirmButton: false,
            timer: 1500
        })
    }

    if(e.target.matches('.finalizar')){
        listadoCarrito = []
        limpiarHtml()
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Gracias por tu compra!',
            showConfirmButton: false,
            timer: 1500
          })
    }
});

function addProductToCart(product){
    const infoProduct = {
        id: Number(product.getAttribute('data-id')),
        img: product.querySelector('img').src,
        marca: product.querySelector('h2').textContent,
        variedad: product.querySelector('.description').textContent,
        price: product.querySelector('.price').textContent,
        cantidad: 1
    }

    const corroborarExistencia = listadoCarrito.find(el => el.id === infoProduct.id)
    if(corroborarExistencia){
        listadoCarrito.map(el =>{
            if(el.id === infoProduct.id){
                el.cantidad++;
            }
            mostrarHtml()
        })
    }else{
        listadoCarrito.push(infoProduct);
        actualizarNumeroCart();
        mostrarHtml()
    }
}

function deleteProductToCart(id){
    const productosFiltrados = listadoCarrito.filter(e => e.id !== id);
    listadoCarrito = productosFiltrados;
    actualizarNumeroCart();
    mostrarHtml();
}

function mostrarHtml(){
    limpiarHtml()

    listadoCarrito.forEach(el =>{
        const $divCart = document.createElement('div');
        $divCart.setAttribute("data-id", el.id)
        $divCart.innerHTML = `
            <img class="img" src="${el.img}" alt="">
            <div class="informacion">
                <p>${el.marca} ${el.variedad}</p>
                <p class="precio">${el.price}</p>
                <p class="cantidad">${el.cantidad}</p>
                <button class="noselect">
                    <span class="text">Eliminar</span>
                    <span class="icon">
                        <svg class="svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path class="path" d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path></svg>
                    </span>
                </button>
            </div>
        `

        $productosCompra.appendChild($divCart)
        actualizarTotal();
    })
}

function limpiarHtml(){
    
    (listadoCarrito.length === 0) ? $productosCompra.innerHTML = `<p class="noProducts">No tienes productos &#128557;</p>` : $productosCompra.innerHTML = ``;
    actualizarTotal();
}

function actualizarNumeroCart(){
    $cantidadCart.innerHTML = listadoCarrito.length
}

function actualizarTotal(){
    let total = 0;
    listadoCarrito.forEach((el) =>{
        if(el.cantidad > 1){
            total += Number(el.price.replace("$", "")) * el.cantidad
        }else{
            total += Number(el.price.replace("$", ""))
        }
    })
    
    $total.innerText = `Total: $ ${total}`

}

$input.addEventListener('input', (e) =>{
    const searchValue = $input.value.toLowerCase();
    const $product = document.querySelectorAll('.product')
    
    $product.forEach((product) => {
        const productName = product.querySelector('h2').textContent.toLowerCase();

        if(!productName.includes(searchValue)){
            product.style.display = 'none';
        }else{
            product.style.display = 'block';
        }
    })
    
    
})