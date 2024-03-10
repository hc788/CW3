<template>
  <div id="Task">
    <header>
      <div v-if="currentView.name === 'Lessons'">
        <!--CW3 REQ-->
        <strong class="test-elem">HTTPS Test: </strong>
        <a v-bind:href="serverURL" target="_blank">link</a>

        <button @click="deleteAllCaches" class="test-elem">
          <span class="fas fa-trash"></span>
          Delete All Caches
        </button>

        <button @click="unregisterAllServiceWorkers" class="test-elem">
          <span class="fab fa-uniregistry"></span>
          Unregister All ServiceWorkers
        </button>

        <button @click="reloadPage" class="test-elem">
          <span class="fas fa-sync"></span>
          Reload Page
        </button>
      </div>
      <!--title of the app-->
      <h1 id=" sitename"> After School Classes </h1>
      <!--checkout button -->
      <button id="checkoutButton" v-on:click="showCheckout">
        <span class="fas fa-cart-plus">
          {{ cartItemCount }}
        </span>
        Checkout
      </button>
      <!--seach bar for lessons -->
      <div class="search-box">
        <input class="search-input" type="text" v-model="searchLesson" placeholder="Search for lesson..">
        <button class="search-btn"></button>
      </div>

    </header>
    <main>
      <component :is="currentView" :cartItemCount="cartItemCount" :cart="cart" :lessons="lessons"
        :isDisabled="isDisabled"  :grabIdFromCart="grabIdFromCart"
        :remove-from-cart-button="removeFromCartButton" :removeFromCartButton="removeFromCartButton"  :itemsLeft="itemsLeft" :sortedProducts="sortedProducts"
        :addToCartButton="addToCartButton" :order="order" :isLetter="isLetter" :isNumber="isNumber"
        :canSubmitForm="canSubmitForm"></component>
    </main>
  </div>
</template>

<script>
import Lessons from "./components/Lessons.vue";
import Checkout from "./components/Checkout.vue";
import { computed } from "vue";

export default {
  name: "Task",
  data() {
    return {
      sitename: "After School Classes",
      cart: [],
      currentView: Lessons,
      showProduct: true,
      lessons: [],
      sortBy: 'Subject',
      direction: 'Asending',
      imgPath: '',
      //serverURL:"http://localhost:3000/collections/lessons",
      serverURL: "https://lessonstoreapp2-env.eba-iqtais9f.eu-west-2.elasticbeanstalk.com/collections/lessons",
      searchLesson: '',
      order: {
        name: '',
        phoneNumber: '',
        method: 'Home',
        gift: '',
        sendGift: 'Send as a gift',
        dontSendGift: 'Do not send as a gift',
      },


    }
  },

  components: { Lessons, Checkout },
  created: function () {

    //this.getData();
    //one fetch that retrieves all the lessons with GET 
    //fetch("http://localhost:3000/collections/lessons").then(
    let app = this;
    fetch("https://lessonstoreapp2-env.eba-iqtais9f.eu-west-2.elasticbeanstalk.com/collections/lessons").then(
      function (response) {
        response.json().then(
          function (json) {
            app.lessons = json;
          }
        )
      }
    )

    if ("serviceWorker" in navigator) {
      //retrieve service workers and check if there is one with the name of the file
      //only if the above is false, do the registration below
      navigator.serviceWorker.register("service-worker.js");
    }

  },
  methods: {
    showCheckout() {
      if (this.currentView == Lessons) {
        this.currentView = Checkout;
      }
      else {
        this.currentView = Lessons;
      }
      this.showProduct = this.showProduct ? false : true;

    },
    addToCartButton: function (lesson) {
      console.log(this.cart);
      this.cart.push(lesson);
      for (let i = 0; i < this.lessons.length; i++) {

        if (this.lessons[i].id == lesson.id) {
          console.log(lesson.id);
          console.log(this.lessons[i].id);
          this.lessons[i].availableInventory--;
        }
      }
    },
    deleteAllCaches() {
      console.log("entered here");
      caches.keys().then(function (names) {
        for (let name of names)
          caches.delete(name);
      });
      console.log("All Caches Deleted");
    },
    //unregister service workers
    unregisterAllServiceWorkers() {
      navigator.serviceWorker.getRegistrations().then(function (registrations) {
        for (let registration of registrations) {
          registration.unregister()
        }
      });
      console.log("ServiceWorkers Unregistered");
    },
    reloadPage() {
      window.location.reload();
    },
    submitForm: function () {
      let name = this.order.name;
      let phoneNum = this.order.phoneNumber;

      this.grabIdFromCart();

      const info = [];
      info.push({
        n: name,
        phone: phoneNum,
        basketInfo: this.lessonsId
      })

      const availability = [];

      for (let i = 0; i < this.lessonsId.length; i++) {
        availability.push({ id: this.lessonsId[i].id, spaces: this.lessonsId[i].spaces });

      }

      console.log(availability);


      //one fetch that saves a new order with POST after it is submitted
      //  fetch("http://localhost:3000/collections/orders",
      fetch("https://lessonstoreapp2-env.eba-iqtais9f.eu-west-2.elasticbeanstalk.com/collections/orders",
        {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            info
          })
        })
        .then(function (res) { return res.json(); })
        .then(function (body) {
          alert(JSON.stringify(body))
        })

      // one fetch that updates the available lesson space with PUT after an order is submitted
      // sends a put request with an array of info that needs to be updated
      fetch("https://lessonstoreapp2-env.eba-iqtais9f.eu-west-2.elasticbeanstalk.com/lessons",
        {
          method: "PUT",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            availability
          })
        })
        .then(function (res) { return res.json(); })
        .then(function (body) {
          alert(JSON.stringify(body))
        })


    },
    //a function that removes lesson from cart 
    removeFromCartButton: function (lesson) {

      for (let i = 0; i < this.cart.length; i++) {
        if (this.cart[i].id === lesson.id) {
          let start = this.cart.splice(0, i);
          let finish = this.cart.splice(i + 1, this.cart.length);
          this.cart = [...start, ...finish];
          for (let i = 0; i < this.lessons.length; i++) {
            if (this.lessons[i].id === lesson.id) {

              this.lessons[i].availableInventory++;
            }
          }
          return;
        }
      }
    },
    //button becomes disables when there is no more lessons left
    isDisabled: function (lesson) {
      return lesson.availableInventory < 1;
    },

    isLetter: function (event) {
      if (/\d+/.test(event.key)) {
        return event.preventDefault();
      }

    },
    ////regular expressions for number validation, to check that the user is only inputing a number 
    isNumber: function (event) {
      if (!/[0-9]/.test(event.key)) {
        return event.preventDefault();
      }
    },
    ///function will grab id from all items in cart
    ///function will grab id from all items in cart
    grabIdFromCart: function () {
      for (let i = 0; i < this.cart.length; i++) {
        this.lessonsId.push({ id: this.cart[i].id, spaces: this.cart[i].availableInventory });

      }
    }
  },
  computed: {
    //function that counts the item in the cart 
    cartItemCount: function () {
      return this.cart.length || "";
    },
    //the user will be able to add to cart if there availablitly for the lesson is biger than 0
    // canAddToCart(lesson) {
    //   return lesson.availableInventory > this.cartItemCount(lesson.id);
    // },
    //the submit button will only be visable once the user has entered name and phone number
    canSubmitForm: function () {
      if (this.cart.length > 0 && this.order.name != '' && this.order.phoneNumber != '')
        return true;
      else
        return false;
    },
    //after the user adds lessons to cart the availabilty gets decreased
    itemsLeft() {
      return this.lessons.availableInventory - this.cartItemCount;
    },
    //sorting the lessons by subject,location,price and availability in ascending and descending order
    sortedProducts() {

      return this.lessons.sort((a, b) => {
        if (this.direction == 'Asending') {
          if (this.sortBy == 'Subject') {
            if (a.subject > b.subject) return 1;
            if (a.subject < b.subject) return -1;
            return 0;

          }
          else if (this.sortBy == 'Location') {
            if (a.location > b.location) return 1;
            if (a.location < b.location) return -1;
            return 0;
          }
          else if (this.sortBy == 'Price') {
            if (parseInt(a.price) > parseInt(b.price)) return 1;
            if (parseInt(a.price) < parseInt(b.price)) return -1;
            return 0;
          }
          else if (this.sortBy == 'Availability') {
            if (a.availableInventory > b.availableInventory) return 1;
            if (a.availableInventory < b.availableInventory) return -1;
            return 0;
          }
        }
        else {
          if (this.sortBy == 'Subject') {
            if (a.subject > b.subject) return -1;
            if (a.subject < b.subject) return 1;
            return 0;

          }
          else if (this.sortBy == 'Location') {
            if (a.location > b.location) return -1;
            if (a.location < b.location) return 1;
            return 0;
          }
          else if (this.sortBy == 'Price') {
            if (parseInt(a.price) > parseInt(b.price)) return -1;
            if (parseInt(a.price) < parseInt(b.price)) return 1;
            return 0;
          }
          else if (this.sortBy == 'Availability') {
            if (a.availableInventory > b.availableInventory) return -1;
            if (a.availableInventory < b.availableInventory) return 1;
            return 0;
          }

        }

      });

    },
    //search functionality
    filteredLessons() {
      return this.sortedProducts.filter((lesson) => {
        return lesson.subject.match(this.searchLesson);
      });
    },


  },

};
</script>