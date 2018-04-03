function compare_ids(a, b) {
    return a.id - b.id
}


function compare_amount(a, b) {
    return a.amount - b.amount
}


function compare_order(a, b) {
    return a.order - b.order
}


function compare_names(a, b) {
    return compare_using_list(a.name, b.name)
}


/**
* Compares 2 values using .sort() method of array.
* Is used by other comparing functions.
*/
const compare_using_list = (a, b) => {
    switch ([a, b].sort()[0]) {
        case a:
            return 1
        case b:
            return -1
    }
}


function create_random_index() {
    const arr = []
    while(arr.length < 8){
        const randomnumber = Math.floor(Math.random()*100) + 1;
        if(arr.indexOf(randomnumber) > -1) continue;
        arr[arr.length] = randomnumber;
    }
    const num = Number(arr.join(''))
    return num
}


function pluck_from_array(array, key) {
  return array.map(o => o[key]);
}


/**
 * Assumes, that server address was passed to base template.
 */
function get_server_address() {
    const server_address = document.getElementById('server_address').getAttribute('value')
    return server_address
}


function get_csrf_token() {
    return document.getElementsByName("csrfmiddlewaretoken")[0].value
}


const product_list = new Vue({
  el: '#product_list',
  data: {
    products: [],
    fields_in_russian: {
        name: 'название',
        amount: 'количество',
    }
  },

  methods: {
    get_products_from_server: async function() {
        /*this.products = [
             {
                "id": 3,
                "name": "White Bread",
                "amount": 1,
                "order": 0,
            },
            {
                "id": 7,
                "name": "Soap",
                "amount": 1000,
                "order": 0,
            }
        ]*/
        server_address = get_server_address()

        const response = await fetch('/api/v1/products/', {
		    method: 'get',
		    headers: {
			    'Content-Type': 'application/json',
			    },
		    credentials: 'same-origin',
		})
		const body = await response.json()
		//console.log('response: ', body)
		this.products = body
    },

    sort_products_by_order: function(reverse = false) {
        this.products.sort(compare_order)
        if (reverse) this.products.reverse()
    },

    sort_products_by_id: function(reverse = false) {
        this.products.sort(compare_ids)
        if (reverse) this.products.reverse()
    },

    sort_products_by_names: function(reverse = false) {
        this.products.sort(compare_names)
        if (reverse) this.products.reverse()
    },

    sort_products_by_amount: function(reverse = false) {
        this.products.sort(compare_amount)
        if (reverse) this.products.reverse()
    },

    /**
    * Gives order values to all products depending on their current position in list.
    */
    give_order_values: function() {
        let ord_number = 0
        for (let product of this.products) {
            product.order = ord_number
            ord_number += 1
        }
    },

    update_orders_on_server: async function() {

    },

    /**
    * Moves current product to one position lower in list.
    */
    move_lower: function(product) {
        console.log('received product: ', product.name, product.order)
        this.give_order_values()
        const index = this.products.findIndex((el) => el.id == product.id)

        if (index + 1 >= this.products.length) return  // last element cannot be moved lower

        const order = this.products[index].order
        this.products[index].order = order + 1
        this.products[index + 1].order = order

        this.sort_products_by_order()

        this.update_on_server_several([this.products[index], this.products[index + 1]])
    },

    move_higher: function(product) {
        console.log('received product: ', product.name, product.order)
        this.give_order_values()
        const index = this.products.findIndex((el) => el.id == product.id)

        if (index == 0) return  // first element cannot be moved higher

        const order = this.products[index].order
        this.products[index].order = order - 1
        this.products[index - 1].order = order

        this.sort_products_by_order()

        this.update_on_server_several([this.products[index], this.products[index - 1]])
    },

    add_product: async function() {
        let product = {}
        for (let n of ['name', 'amount']) {
            let warning = ''
            while (true) {
                let input = prompt(warning + '\n' + `Введите, пожалуйста, ${this.fields_in_russian[n]} продукта:`)
                if (input == null) return
                if (input == '') {
                    warning = `Вы не ввели ${this.fields_in_russian[n]} продукта.\n`
                    continue
                }
                if (n == 'amount') {
                    input = Number(input)
                    if (isNaN(input)) {
                        warning = `Вы не ввели число.\n` +
                                  `Введите, пожалуйста, число, обозначающее количество продуктов.\n`
                        continue
                    }
                }
                product[n] = input
                break
            }
        }

        try {
            product = await this.create_on_server(product)
            this.products.push(product)
        }
        catch (err) {
            this.products.pop()
            alert(`Извините, произошла ошибка при добавлении продукта: ${err}`)
            return
        }

        this.give_order_values()
        this.update_on_server(product)

        // hack to work without server connection (index would be applied after response from server)
        let products_without_index = this.products.filter(el => !el.id)
        console.log('products_without_index: ', products_without_index)
        products_without_index.map(el => { el.id = create_random_index() })
        products_without_index = this.products.filter(el => !el.id)
        console.log('products_without_index after: ', products_without_index)
        // end hack

        console.log('we got product: ', product)
    },

    delete_product: async function(product) {
        if (confirm(`Вы уверены, что хотите удалить продукт "${product.name}" из списка ?`)) {
            //this.products = this.products.filter(p => p != product)
            if (this.delete_on_server(product)) {
                this.products = this.products.filter(el => el.id != product.id)
            }
        }
    },

    /**
    * Updates product on server, when product was changed on frontend.
    */
    update_on_server: async function(product) {
        console.log('updating on server: ', product.name)

        productNoId = y = Object.assign({}, product);
        delete productNoId.id

        const response = await fetch(`/api/v1/products/${product.id}/`, {
		    method: 'patch',
		    headers: {
			    'Content-Type': 'application/json',
			    'X-CSRFToken': get_csrf_token(),
			    },
		    credentials: 'same-origin',
		    body: JSON.stringify(productNoId),
		})
		const body = await response.json()
		console.log('updated on server: ', body)
		return body
    },

    update_on_server_several: async function(products) {
        console.log('updating several on server: ', JSON.stringify(products))

        const response = await fetch(`/api/v1/products/set_order/`, {
		    method: 'patch',
		    headers: {
			    'Content-Type': 'application/json',
			    'X-CSRFToken': get_csrf_token(),
			    },
		    credentials: 'same-origin',
		    body: JSON.stringify(products),
		})
		const body = await response.json()
		console.log('updated several on server: ', body)
		return body
    },

    create_on_server: async function(product) {
        console.log('creating on server: ', product.name)
        const response = await fetch('/api/v1/products/', {
		    method: 'post',
		    headers: {
			    'Content-Type': 'application/json',
			    'X-CSRFToken': get_csrf_token(),
			    },
		    credentials: 'same-origin',
		    body: JSON.stringify(product),
		})
		const body = await response.json()
		console.log('created on server: ', body)
		return body
    },

    delete_on_server: async function(product) {
        console.log('deleting on server: ', product.name)
        const response = await fetch(`/api/v1/products/${product.id}`, {
		    method: 'delete',
		    headers: {
			    'Content-Type': 'application/json',
			    'X-CSRFToken': get_csrf_token(),
			},
		    credentials: 'same-origin',
		})

		if (response.ok) {
		    console.log('deleted on server.')
		    return true
		}
        else {
            alert(`Error deleting ${product.name} on server.\n\n` +
                  `Status code: ${response.status}\n` +
                  `Status text: ${response.statusText}`)
            return false
        }
    },
  }
})


async function first_load() {
    await product_list.get_products_from_server()
    product_list.sort_products_by_order()
}


first_load()

