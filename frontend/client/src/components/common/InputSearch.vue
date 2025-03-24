<script>
export default {
    props: {
        modelValue: { type: String, default: "" },  // Nhận giá trị từ v-model
    },
    emits: ["update:modelValue", "submit"],  // Đảm bảo emit đúng
    methods: {
        updateModelValue(e) {
            this.$emit("update:modelValue", e.target.value);  // Cập nhật modelValue
        },
        submit() {
            this.$emit("submit");  // Gửi sự kiện submit
        },
    },
};
</script>

<template>
    <div class="input-group">
        <input type="text" class="form-control" placeholder="Nhập thông tin cần tìm..." :value="modelValue"
            @input="updateModelValue" @keyup.enter="submit" />
        <button class="btn btn-primary" type="button" @click="submit">
            <i class="fas fa-search"></i> Tìm kiếm
        </button>
    </div>
</template>
