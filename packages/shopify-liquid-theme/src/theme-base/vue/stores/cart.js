import { defineStore } from "pinia";
import axios from "axios";

export const useCartStore = defineStore("cart", () => {
  // TODO: Build out cart store properties and methods [get, updateItem, removeItem]
  const addItem = ({ id, quantity, properties } = {}) => {
    console.log("id " + id);
    console.log("quantity " + quantity);
    console.log("properties " + properties);
    return new Promise((resolve, reject) => {
      axios
        .post("/cart/add.js", {
          id,
          quantity,
          properties,
        })
        .then(() => axios.get("/cart.js"))
        .then((response) => {
          // TODO: Update cart store with response OR just replace this entire thing with an action
          resolve();
        })
        .catch((err) => {
          console.log(err);
          reject(new Error("Unable to add the item to your cart."));
        });
    });
  };
  return { addItem };
});
