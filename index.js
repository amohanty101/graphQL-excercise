import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import express from "express";

//var { graphqlHTTP } = require("express-graphql");
//var { buildSchema } = require("graphql");
//var express = require("express");

// Construct a schema, using GraphQL schema language
var restaurants = [
  {
    id: 1,
    name: "WoodsHill",
    description: "American cuisine, farm to table, with fresh produce every day",
    dishes: [
      {
        name: "Swordfish grill",
        price: 27,
      },
      {
        name: "Roasted Broccily",
        price: 11,
      },
    ],
  },
  {
    id: 2,
    name: "Fiorellas",
    description: "Italian-American home cooked food with fresh pasta and sauces",
    dishes: [
      {
        name: "Flatbread",
        price: 14,
      },
      {
        name: "Carbonara",
        price: 18,
      },
      {
        name: "Spaghetti",
        price: 19,
      },
    ],
  },
  {
    id: 3,
    name: "Karma",
    description: "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
    dishes: [
      {
        name: "Dragon Roll",
        price: 12,
      },
      {
        name: "Pancake roll",
        price: 11,
      },
      {
        name: "Cod cakes",
        price: 13,
      },
    ],
  },
];

var schema = buildSchema(`
  type Query {
    restaurant(id: Int!): Restaurant
    restaurants: [Restaurant]
  }
  
  type Mutation {
    setRestaurant(input: RestaurantInput!): Restaurant
    deleteRestaurant(id: Int!): DeleteResponse
    editRestaurant(id: Int!, name: String!): Restaurant
  }
  
  type Restaurant {
    id: Int
    name: String
    description: String
    dishes: [Dish]
  }
  
  type Dish {
    name: String
    price: Int
  }
  
  input RestaurantInput {
    name: String
    description: String
  }
  
  type DeleteResponse {
    ok: Boolean!
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  restaurant: ({ id }) => {
    return restaurants.find((restaurant) => restaurant.id === id);
  },
  restaurants: () => {
    return restaurants;
  },
  setRestaurant: ({ input }) => {
    const newRestaurant = {
      id: restaurants.length + 1,
      name: input.name,
      description: input.description,
      dishes: [],
    };
    restaurants.push(newRestaurant);
    return newRestaurant;
  },
  deleteRestaurant: ({ id }) => {
    const index = restaurants.findIndex((restaurant) => restaurant.id === id);
    if (index === -1) {
      return { ok: false };
    }
    restaurants.splice(index, 1);
    return { ok: true };
  },
  editRestaurant: ({ id, name }) => {
    const restaurant = restaurants.find((restaurant) => restaurant.id === id);
    if (restaurant) {
      restaurant.name = name;
      return restaurant;
    }
    return null;
  },
};



var app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
var port = 5500;
app.listen(5500, () => console.log("Running Graphql on Port:" + port));

export { root };
