<template>
    <div>
        <div>
           <h1> Welcome to Checkout Page </h1>
        

                    <h2>Shopping Cart</h2>
                    <div class="listOfLessons" v-for="lesson in cart">

                        {{ cart }}
                        <figure>
                            <img v-bind:src="lesson.newImg" />
                        </figure>
                        <input type="hidden" :value="lesson.id"> 
                        <p> Subject:{{lesson.subject}} </p>
                        <p> Location:{{lesson.location}} </p>
                        <p> Price:£ {{lesson.price}} </p>
                        <button class="addToCartButton" @click="RemoveCheckoutPage(lesson)"> Remove</button>
                    </div>
                    <!--When the user has finished purchasing the lessons, he/she will be asked to enter name,phone number in order to complete order-->
                    <p>
                        <strong> Name:</strong>
                        <input v-on:keypress="isLetter" v-model.trim="order.name" />
                    </p>
                    <p>
                        <strong>Phone number:</strong>
                        <input v-on:keypress="isNumber" v-model.trim="order.phoneNumber" />
                    </p>
                    <!--The user will have an option to choose if its a home/business method -->
                    <h2>Order Information</h2>
                    <div class="form-group">
                        <div class="col-md-6 boxes">
                            <input type="checkbox" id="gift" value="true" v-bind:false-value="order.dontSendGift" v-model="order.gift">
                            <label for="gift">Ship As Gift?</label>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-md-6 boxes">
                            <input type="radio" id="home" value="Home" v-model="order.method">
                            <label for="home">Home</label>
                            <input type="radio" id="business" value="Business" v-model="order.method">
                            <label for="business">Business</label>
                        </div>
                    </div>
                    <div class="col-md-12 verify">
                        <pre>
                        Name: {{order.name}}
                        Phone number: {{order.phoneNumber}}
                        </pre>
                    </div>
                    <!--Place order button- once the user has entered the input in correct format, user will get a confirmation that the order has been submitted successfully-->
                    <div>
                        <button v-on:click="submitForm" v-if="canSubmitForm">Place Order</button>
                        <button v-on:click="submitForm" disabled="disabled" v-else>Place Order</button>
                    </div>
                </div>
            </div>
               
</template>
<script>
    export default{
        name: "Checkout",
        props: ["cart","order","isLetter","isNumber", "submitForm", "canSubmitForm","removeFromCartButton","showCheckout","grabIdFromCart"],
        methods:
            {
                RemoveCheckoutPage(lesson){
                    this.$emit("remove-from-cart-button",lesson);
                },

               

                
            }
        
  };
    
</script>