<script
  setup
  lang="ts"
>
const props = defineProps({
  type: {
    type: String,
    default: 'text',
  },
  value: {
    type: String,
    default: undefined,
  },
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
  },
  placeholder: {
    type: String,
    default: '',
  },
  disabled:{
    type:Boolean,
    default:false
  }
});

const name = toRef(props, 'name');

const {
  value: inputValue,
  errorMessage,
  handleBlur,
  handleChange,
  meta,
} = useField(name, undefined, {
  initialValue: props.value,
});
</script>

<template>
  <div class="relative w-full">
    <label
      v-show="label"
      :for="name"
      class="block mb-2 w-full text-sm"
    >{{ label }}
    </label>
    <input
      :name="name"
      :id="name"
      :type="type"
      :value="inputValue"
      :placeholder="placeholder"
      :disabled="disabled"
      class="w-full min-h-10 px-4 flex items-center text-md text-black rounded border placeholder:opacity-25"
      :class="errorMessage ? 'border-red' : 'border-medium-grey/25'"
      @input="handleChange"
      @blur="handleBlur"
    />
    <small
      v-show="errorMessage"
      class="absolute top-1/2 right-0 mr-4 text-sm text-red"
    >
      {{errorMessage}} </small>
  </div>
</template>