<template>
  <div></div>
</template>

<script>
import axios from "../api/http";

export default {
  mounted() {
    axios.get("/xxx/xxx");
  },
};
</script>