import { menuArray } from './data.js'

let orderArr = []
let userDetails = {}
let rate = 0
let isActive = true

document.addEventListener('click', (e) => {
	if (e.target.dataset.add) {
		if (!orderArr.some((product) => product.id === Number(e.target.dataset.add))) {
			productOrdered(e.target.dataset.add)
		}
	} else if (e.target.dataset.remove) {
		removeProduct(e.target.dataset.remove)
	} else if (e.target.id === 'complete-order-btn') {
		document.getElementById('prod-container').innerHTML += formPopup()
		const userForm = document.getElementById('form-details')
		userForm.addEventListener('submit', (e) => {
			e.preventDefault()
			const userData = new FormData(userForm)
			const userName = userData.get('name')
			userDetails['name'] = userName
			closeForm()
			isActive = !isActive
			render()
		})
	} else if (e.target.id === 'xbtn') {
		closeForm()
		render()
	} else if (e.target.id === 'reload') {
		location.reload()
	} else if (e.target.dataset.increment) {
		qtyBtns('increment', e.target.dataset.increment)
	} else if (e.target.dataset.decrement) {
		const quantity = menuArray.filter((product) => {
			return product.id === Number(e.target.dataset.decrement)
		})[0]
		if (quantity.qty === 1) {
			return
		} else {
			qtyBtns('decrement', e.target.dataset.decrement)
		}
	} else if (e.target.id === 'pay-btn') {
		let isEmpty = true
		document.querySelectorAll('.form-input').forEach((inp, i) => {
			if (inp.value === '') {
				isEmpty = false
			}
		})
		if (isEmpty) {
			setTimeout(() => {
				document.querySelector('#rating').classList.add('showrating')
				document.querySelector('.star-rating').classList.add('show')
			}, 1500)
		}
	} else if (e.target.id === 'rate-btn') {
		if (rate === 0) {
			return
		}
		document.querySelector('.star-rating').classList.remove('show')
		document.querySelector('.thankyou').classList.add('show')
		setTimeout(() => {
			document.querySelector('#rating').classList.remove('showrating')
			document.querySelector('.thankyou').classList.remove('show')
			document.querySelector('#reload').style.display = 'block'
		}, 1500)
	}
})

const ratings = () => {
	const stars = document.querySelectorAll('.fa-star')
	stars.forEach((star, i1) => {
		star.addEventListener('click', () => {
			rate = star.dataset.value
			stars.forEach((star, i2) => {
				i1 >= i2 ? star.classList.add('rate') : star.classList.remove('rate')
			})
		})
	})
}
ratings()

const qtyBtns = (btnType, productId) => {
	if (btnType === 'increment') {
		const quantity = menuArray.filter((product) => {
			return product.id === Number(productId)
		})[0]
		quantity.qty++
		render()
	} else if (btnType === 'decrement') {
		const quantity = menuArray.filter((product) => {
			return product.id === Number(productId)
		})[0]
		quantity.qty--
		render()
	}
}
const formPopup = () => {
	let formHtml = `
	<div class="card">
	<form class="card-inner" id="form-details">
		<i class="fa-solid fa-xmark" id="xbtn"></i>
	   <h2>Enter card details</h2>
	   <div class="input-container">
		  <input type="text" class="form-input" name="name" placeholder="Enter your name" required>
		  <input type="text" class="form-input" name="cardnumber" placeholder="Enter card number" required>
		  <input type="text" class="form-input" name="ccv" placeholder="Enter CCV" required>
	   </div>
	   <input type="submit" id="pay-btn" value="Pay">
	</form>
	`
	return formHtml
}
const closeForm = () => {
	document.querySelectorAll('.form-input').forEach((inp) => {
		inp.value = ''
	})
	document.querySelector('.card').style.display = 'none'
}

const removeProduct = (removeId) => {
	const newOrder = orderArr.filter((product) => product.id !== Number(removeId))
	orderArr = newOrder
	render()
}

const productOrdered = (productId) => {
	menuArray.filter((product) => {
		if (product.id === Number(productId)) {
			orderArr.unshift(product)
		}
	})
	render()
}

const gatherData = () => {
	let productHtml = ''

	menuArray.forEach((product) => {
		productHtml += `
      <div class="product">
			<div class="prod-inner">
				<p class="prod-emoji">${product.emoji}</p>
				<div class="prod-description">
					<div class="description">
						<h2 class="prod-name">${product.name}</h2>
						<p class="ingredients">${product.ingredients}</p>
					</div>
					<p class="price">$${product.price}</p>
				</div>
			</div>
			<div class="side">
				<div class="quantity">
					<p class="qty-text">Quantity</p>
					<div class="btn-wrapper">
						<button class="qtybtn" data-decrement="${product.id}">-</button>
						<p class="qty-value">${product.qty}</p>
						<button class="qtybtn" data-increment="${product.id}">+</button>
					</div>
				</div>
				<i class="fa-solid fa-plus" data-add="${product.id}"></i>
			</div>
		</div>
      `
	})
	let resultHtml = ''
	let greetings = ''
	let checkoutHtml = ''

	if (orderArr.length > 0 && isActive) {
		checkoutHtml += `
		<div class="checkout">
            <h3 class="order-text">Your Order</h3>
		<div class="ordered">
		`
		let total = 0
		orderArr.forEach((order) => {
			total += order.qty * order.price
			checkoutHtml += `
			<div class="prod-ordered">
                     <div class="desc">
                        <p class="prod-name pn">${order.name}</p>
                        <button class="remove-btn" data-remove="${order.id}">remove</button>
                     </div>
                     <p class="price"><span class="orderQty">(${order.qty})</span> $${order.price}</p>
            </div>
			`
		})

		checkoutHtml += `
		</div>
		<div class="total-container">
               <p class="pn total-txt">Total price:</p>
               <p class="price" id="total-price">$${total}</p>
        </div>
			<button class="complete-btn" id="complete-order-btn">Complete Order</button>
		</div>
		`
		resultHtml = checkoutHtml
	} else if (!isActive) {
		greetings = `
		<div class="greetings">
			<p class="greetings-text">Thanks, ${userDetails.name} Your order is on its way!</p>
			<button id="reload">Order Again?</button>
		</div>
		`
		resultHtml = greetings
	}

	return productHtml + resultHtml
}

const render = () => {
	document.querySelector('#prod-container').innerHTML = gatherData()
}
render()
