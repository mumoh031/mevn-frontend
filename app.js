const {createApp} = Vue

const myApp = createApp({
    data(){
        return {
            subjects: [],
            cart: [],
            order: {
                name: "",
                phoneNumber: "",
                lessonsOrdered : []
            },
            showProduct: true,
            sortType: "price",
            sortAscending: true,
            orderConfirmed: false
        }
    },
    created(){
        this.fetchData()
    },
    methods: {
        // loads the subjects list from the backend API and stores it in state
        async fetchData(){
            const URL = "http://localhost:8080/lessons"
            const response = await fetch(URL)
            this.subjects = await response.json()
        },
        async postOrder(){
            const URL = "http://localhost:8080/orders";
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify(this.order)
            }
            let response = await (fetch(URL, options));
        },
        // flips between the product list view and the checkout view
        toggleCheckout(){
            this.showProduct = !this.showProduct
            // clear any old confirmation message so it doesn't still be showing
            // next time the customer comes back to checkout
            this.orderConfirmed = false
        },
        // books one spot for this subject by adding its id to the cart
        // (the same id can appear more than once if multiple spots are booked)
        addItem(subject){
            this.cart.push(subject.id)
        },
        // counts how many times this subject's id is already in the cart,
        // then subtracts that from the total inventory to get what's left
        spotsLeft(subject){
            let timesInCart = 0
            for (const id of this.cart) {
                if (id === subject.id) {
                    timesInCart = timesInCart + 1
                }
            }
            return subject.availableInventory - timesInCart
        },
        // the "Add to cart" button is only enabled while spots remain
        canAddToCart(subject){
            return this.spotsLeft(subject) > 0
        },
        // removes a single booked spot for this subject from the cart
        // (indexOf finds the id's position, splice removes just one entry there)
        removeSubjectFromCart(subject){
            const index = this.cart.indexOf(subject.id)
            this.cart.splice(index, 1)
        },
        // true only once the cart has something in it and both
        // name and phone number have real content
        canSubmitOrder(){
            const hasName = this.order.name.trim() !== ""
            const hasPhoneNumber = this.order.phoneNumber.trim() !== ""
            return hasName && hasPhoneNumber && this.canCheckout
        },
        // confirms the order: empties the cart and shows the confirmation
        // message in place of the cart and form
        async submitOrder(){
            this.order.lessonsOrdered = this.cartSubjects;
            await this.postOrder();
            this.cart = []
            this.orderConfirmed = true

        }
    },
    computed: {
        // total number of booked spots sitting in the cart
        cartItemCount(){
            return this.cart.length
        },
        // the checkout button only makes sense once something is in the cart
        canCheckout(){
            return this.cartItemCount > 0
        },
        // turns the cart's list of ids into the full subject records
        // needed to display each one on the checkout page
        cartSubjects(){
            const subjectsInCart = []
            for (const id of this.cart) {
                const match = this.subjects.find(subject => subject.id === id)
                subjectsInCart.push(match)
            }
            return subjectsInCart
        },
        // returns the subjects list sorted by whichever sortType and
        // sortAscending direction the customer picked from the two dropdowns
        sortedLessons(){
            // copy the array first so sort() doesn't change the original subjects list
            const subjectsCopy = this.subjects.slice()

            // sort() needs a function that compares two subjects (a and b) at a time.
            // Returning -1 means a goes first, 1 means b goes first, 0 means they're equal.
            // This always sorts from smallest to largest (increasing order) for now.
            subjectsCopy.sort((a, b) => {
                if (this.sortType === "subject") {
                    if (a.name < b.name) {
                        return -1
                    }
                    if (a.name > b.name) {
                        return 1
                    }
                    return 0
                }

                if (this.sortType === "location") {
                    if (a.location < b.location) {
                        return -1
                    }
                    if (a.location > b.location) {
                        return 1
                    }
                    return 0
                }

                if (this.sortType === "price") {
                    if (a.price < b.price) {
                        return -1
                    }
                    if (a.price > b.price) {
                        return 1
                    }
                    return 0
                }

                if (this.sortType === "availability") {
                    // "availability" isn't a plain field, so work it out for each subject first
                    const spacesA = this.spotsLeft(a)
                    const spacesB = this.spotsLeft(b)
                    if (spacesA < spacesB) {
                        return -1
                    }
                    if (spacesA > spacesB) {
                        return 1
                    }
                    return 0
                }
            })

            // the sort above always puts the smallest value first. If the user picked
            // decreasing order instead, just turn the whole sorted list backwards.
            if (!this.sortAscending) {
                subjectsCopy.reverse()
            }

            return subjectsCopy
        },
        // label for the "increasing" option, worded to fit whichever sortType is active
        ascendingLabel(){
            if (this.sortType === "price") {
                return "Lowest first"
            }
            if (this.sortType === "availability") {
                return "Fewest first"
            }
            return "A to Z"
        },
        // label for the "decreasing" option, worded to fit whichever sortType is active
        descendingLabel(){
            if (this.sortType === "price") {
                return "Highest first"
            }
            if (this.sortType === "availability") {
                return "Most first"
            }
            return "Z to A"
        }
    }
})
myApp.mount('#mydiv')
