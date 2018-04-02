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


const product_list = new Vue({
  el: '#product_list',
  data: {
    products: [],
  },

  methods: {
    update_products_from_server: async function() {
        this.products = [
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
        ]
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
        this.give_order_values()
        const index = this.products.findIndex((el) => el.id == product.id)

        if (index + 1 >= this.products.length) return  // last element cannot be moved lower

        const order = this.products[index].order
        this.products[index].order = order + 1
        this.products[index + 1].order = order

        this.sort_products_by_order()

        this.product_changed(this.products[index])
        this.product_changed(this.products[index + 1])
    },

    move_higher: function(product) {
        this.give_order_values()
        const index = this.products.findIndex((el) => el.id == product.id)

        if (index == 0) return  // first element cannot be moved higher

        const order = this.products[index].order
        this.products[index].order = order - 1
        this.products[index - 1].order = order

        this.sort_products_by_order()

        this.product_changed(this.products[index])
        this.product_changed(this.products[index - 1])
    },

    /**
    * Updates product on server, when product was changed on frontend.
    */
    product_changed: async function(product) {
        console.log('product changed: ', product.id)
    },
  }
})


async function first_load() {
    await product_list.update_products_from_server()
    product_list.sort_products_by_order()
}


first_load()

