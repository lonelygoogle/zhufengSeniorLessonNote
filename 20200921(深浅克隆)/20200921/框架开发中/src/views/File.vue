<template>
  <div></div>
</template>

<script>
import instance from "../api/http_file";

export default {
  mounted() {
    instance.get("/xxx/xxx");
  },
};
</script>