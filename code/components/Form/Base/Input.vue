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

defineOptions({
  inheritAttrs: false
})

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
      class="form-label"
    >{{ label }}
    </label>
    <slot>
      <input
        v-bind="$attrs"
        :name="name"
        :id="name"
        :type="type"
        :value="inputValue"
        :placeholder="placeholder"
        :disabled="disabled"
        class="form-input"
        :class="errorMessage ? 'border-red' : ''"
        @input="handleChange"
        @blur="handleBlur"
      />
    </slot>

    <small
      v-show="errorMessage"
      class="absolute top-1/2 right-0 mr-4 text-sm text-red"
    >
      {{errorMessage}} </small>
  </div>
</template>