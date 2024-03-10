<template>
    <div>
       <h1>Welcome to the Lessons List Page</h1> 
       <div id="mainContainer" >
                    <div id="sortingBox">
                        <div class="sortList">
                            <div class="col-md-6 boxes">
                                <h3>Sort by</h3>
                                <div class="input">
                                    <input type="radio" id="sort" value="Subject" v-model="sortBy" checked>
                                    <label for="subject">Subject</label>
                                </div>
                                <div class="input">
                                    <input type="radio" id="sort" value="Location" v-model="sortBy">
                                    <label for="location">Location</label>
                                </div>
                                <div class="input">
                                    <input type="radio" id="sort" value="Price" v-model="sortBy">
                                    <label for="price">Price</label>
                                </div>
                                <div class="input">
                                    <input type="radio" id="sort" value="Availability" v-model="sortBy">
                                    <label for="availability">Availability</label>
                                </div>
                            </div>
                        </div>
                        <div class="input">
                            <!--The user has to option to choose which order to sort the lessons: Asending and descending order-->
                            <div class="sortList">
                                <div class="col-md-6 boxes">
                                    <input type="radio" id="sort" value="Asending" v-model="direction" checked>
                                    <label for="asending">Asending</label>
                                </div>
                                <div class="input">
                                    <input type="radio" id="sort" value="Descending" v-model="direction">
                                    <label for="descending">Descending</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--Main Page-->
                    <!--Display of all lessons on the main page of the webapp-->
                    <div id="listOfLessons">
                        
                        <!--Display all filtered and sorted lessons from search bar-->
                        <div class="listOfLessons" v-for="lesson in lessons">
                            <!--img displayed of each lesson-->
                            <figure>
                                <img v-bind:src=  " lesson.newImg" />
                            </figure>
                            <p> Subject:{{lesson.subject}} </p>
                            <p> Location:{{lesson.location}} </p>
                            <p> Price:£ {{lesson.price}} </p>
                            <p> Spaces: {{lesson.availableInventory}}</p>
                            <!--display of Add to cart button and display of how many lessons are left-->
                            <button class="addToCartButton" v-on:click="addToCartButton(lesson)"
                                v-bind:disabled="isDisabled(lesson)"> Add to Cart</button>
                            <span v-if="lesson.availableInventory < 5"> Only {{lesson.availableInventory}} left!</span>
                            <span v-if='lesson.availableInventory === 0'>All out!</span>
                            <span v-else>Buy now!</span>
                        </div>
                    </div>
                </div>

    </div>
</template>
<script>
export default {
    name: "Lessons",
    props: ["lessons","sortBy","direction","imgPath","direction","itemsLeft","canAddToCart","isDisabled","cartItemCount","sortedProducts","addToCartButton"],
}


</script>