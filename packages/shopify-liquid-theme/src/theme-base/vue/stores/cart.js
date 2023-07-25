import { defineStore } from "pinia";
import { onMounted, ref } from "vue";
import axios from "axios";

export const useCartStore = defineStore("cart", () => {
  // TODO: Build out cart store properties and methods [get, updateItem, removeItem]

  const cart = ref({});
  const loading = ref(false);

  const load = async () => {
    loading.value = true;
    return new Promise((resolve, reject) => {
      axios
        .get("/cart.js")
        .then((response) => {
          resolve(response.data);
          cart.value = response.data;
          loading.value = false;
        })
        .catch((err) => {
          console.log(err);
          reject(new Error("Unable to get your cart."));
        });
    });
  };

  const updateItem = ({ id, quantity, properties } = {}) => {
    return new Promise((resolve, reject) => {
      axios
        .post("/cart/change.js", { id, quantity, properties })
        .then((response) => {
          resolve(response.data);
          cart.value = response.data;
        })
        .catch((err) => {
          console.log(err);
          reject(new Error("Unable to update your cart."));
        });
    });
  };

  const addItem = ({ id, quantity, properties } = {}) => {
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
          resolve(response.data);
          cart.value = response.data;
          // This function closes the cart after adding it, we have commented it out for now
          // window.dispatchEvent(new Event("toggleCart"));
        })
        .catch((err) => {
          console.log(err);
          reject(new Error("Unable to add the item to your cart."));
        });
    });
  };

  const updateNote = (note) => {
    return new Promise((resolve, reject) => {
      axios
        .post("/cart/update.js", {
          note: note,
        })
        .then((response) => {
          resolve(response.data);
          cart.value = response.data;
        })
        .catch((err) => {
          console.log(err);
          reject(new Error("Unable to update cart note."));
        });
    });
  };

  onMounted(() => {
    load();
  });

  return { load, cart, addItem, loading, updateItem, updateNote };
});
