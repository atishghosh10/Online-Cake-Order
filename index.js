import { cakeItems } from "./cake-items.js";

let cart = [];

const filterByCategory = (category) => {
  return cakeItems.filter((item) => item.category === category);
};

const findById = (itemId) => {
  return cakeItems.find((item) => item.id === itemId);
};

const findItemInCart = (itemId) => {
  return cart.find((cartItem) => cartItem.item.id === itemId);
};

const getCartTotal = () => {
  return cart.reduce( ( acc, cartItem ) => acc + cartItem.qty * cartItem.item.Price, 0 );
};

// array of duplicates with categories
const categoriesArrayDuplicates = cakeItems.map((item) => item.category);

const categoriesSet = new Set(categoriesArrayDuplicates);

//array of categroies without duplicates
const categories = Array.from(categoriesSet);

const showCategories = () => {
  const categoriesList = document.querySelector('.categories-list');

  categoriesList.innerHTML= '';

  categories.forEach(
    category => {
      const items = filterByCategory( category );
      const itemImg = items[0].img;
      
      categoriesList.innerHTML += `
        <div>
        <img src="${itemImg}" />
        <a href="#${category}">${category}</a>
        </div>
        `;
    }
  )

};

const showItemsByCategory = () => {
  const main = document.querySelector('.main');

  categories.forEach((category) => {
    let itemsHTML = "";
    // form a list of divs for items in this category (itemsHTML)
    filterByCategory(category).forEach((item) => {
      itemsHTML += `
                <div class ="category-item " data-id="${item.id}">
                <div class = "category-item-actions">
                <i class="fa-solid fa-star">${item.rating}</i>
                <i class="fa-solid fa-heart add-item-to-cart"></i>
                </div>
                    <img src ="${item.img}" alt ="${item.name}" />
                    <div>${item.name}</div>
                    <div>Price: Rs.${item.Price}</div>
                </div>
                `;
    });

    console.log(itemsHTML);

    // render HTML for a category and its items
    main.innerHTML += `
            <section class = "category" id="${category}">
            <h3>${category}</h3>
            <div class = "category-items">${itemsHTML}</div>
            </section>
             `;
  });
};
showItemsByCategory();
showCategories();

function showCart(){
  const cartTBody = document.querySelector( '.cart tbody' );
  // populate the cart table rows

  cartTBody.innerHTML = '';

  cart.forEach( 
    cartItem => {
      const { item, qty } = cartItem ;

      cartTBody.innerHTML += `
      <tr>
          <td>
              <img src="${item.img}" alt="${item.name}" class="cart-item-image" />
              </td>
              <td>${item.name}</td>
              <td>
              <button
              class ="cart-item-decease" onclick="decreaseQty(${item.id} )">-</button>
              ${qty}
              <button
              class ="cart-item-increase" onclick="increaseQty(${item.id} )">+</button>
              </td>
              <td>Rs.${item.Price}</td>
            </tr>  
              `;
    }
  )
}

function updateTotalSidebar(){
  const totalItemsEl = document.querySelector('.total-items');
  const totalPriceEl = document.querySelector('.total-price');

  totalItemsEl.textContent = cart.length;
  totalPriceEl.textContent = getCartTotal();

}
function increaseQty( itemId ) {
  // alert(itemId);
  findItemInCart( itemId ).qty++;
  showCart();

  console.log( getCartTotal());

  updateTotalSidebar()
}

function decreaseQty( itemId ) {
  const item = findItemInCart( itemId ) 
  item.qty--;
if( item.qty === 0 ) {
  cart = cart.filter ( i => i.item.id !== itemId );
}

  showCart();
  updateTotalSidebar()
}
window.increaseQty = increaseQty;
window.decreaseQty = decreaseQty;

function bindListeners() {
  const addItemToCartButtons = document.querySelectorAll(".add-item-to-cart");

  const cartButton = document.querySelector( '.items');

  const cartCount = document.querySelector( '.cart-items-count' );

  const addressButton = document.querySelector( '.address');

  const addressInner = document.querySelector( '.address-inner');

  const mainPage = document.querySelector( '.main');

  const cartPage = document.querySelector( '.cart');

  const mainSidebar = document.querySelector( '.main-sidebar');

  const cartSidebar = document.querySelector( '.cart-sidebar');

  const checkoutButtons = document.querySelectorAll( 'checkout-button');

  


  // console.log(addItemToCartButtons);


  addItemToCartButtons.forEach (button => {
    button.addEventListener("click", function () {
      // console.log( this );

      this.classList.add( 'fa-heart-selected');

      const itemEl = this.closest(".category-item");
      //  console.log( itemEl );

      const itemId = parseInt(itemEl.getAttribute("data-id"));
      console.log(itemId);

      const item = findById(itemId);
      console.log(item);

      // check if item exists in the cart
      if (findItemInCart(itemId)) {
        alert("This item is already in the cart");
      } else {
        cart.push({
          qty: 1,
          item,
        });
      }
      
      cartCount.innerText = cart.length;

      showCart();

      updateTotalSidebar();

      console.log( 'total =' , getCartTotal());
    });
  }
  )

    addressButton.addEventListener('click', function(){
      const address = prompt('Enter Your Address');

      if( !address){
        alert( ' No Address Given ');
        return;
      }

      addressInner.textContent = address;
    });
    
    cartButton.addEventListener( 'click' , function(){
      // Check the use of classList.toggle()
        if( mainPage.classList.contains( 'd-none')) {
          cartPage.classList.add('d-none');
          cartSidebar.classList.add('d-none');
          mainPage.classList.remove( 'd-none')
          mainSidebar.classList.remove( 'd-none')
        } else {
            if(cart.length === 0){
              alert('No items in the cart');
              return;
            }

          cartPage.classList.remove('d-none');
          cartSidebar.classList.remove('d-none');
          mainPage.classList.add( 'd-none')
          mainSidebar.classList.add( 'd-none')
        }
    });

    checkoutButtons.forEach(
      button => {
        button.addEventListener( 'click', function() {
            const items = document.querySelectorAll( '.fa-heart-selected');
            items.forEach(
              item => item.classList.remove(
                'fa-heart-selected'
              )
            );

            cart = [];
            cartCount.textContent = cart.length;

            showCart();
            updateTotalSidebar();

            alert('Your order has been placed');

            cartPage.classList.add('d-none');
          cartSidebar.classList.add('d-none');
          mainPage.classList.remove( 'd-none');
          mainSidebar.classList.remove( 'd-none');
        }
        );
      }
    )
}

bindListeners();
