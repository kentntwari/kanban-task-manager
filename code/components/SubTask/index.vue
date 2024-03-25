<script
  lang="ts"
  setup
>
const props = defineProps<{
  id:string,
  isCompleted: boolean,
}>()

const emit = defineEmits<{
  update: [id: string, value: boolean]
}>()

const checked = ref<boolean | 'indeterminate'>(props.isCompleted ? true : 'indeterminate')

watch(()=> checked.value, (val)=>{
  emit('update', props.id, val === 'indeterminate' ? false : val)
})
</script>

<template>
  <div class="p-3 bg-light-grey flex rounded cursor-pointer">
    <label class="w-full flex items-center gap-4 cursor-pointer">
      <CheckboxRoot
        v-model:checked="checked"
        class="bg-white size-4 flex items-center justify-center appearance-none border border-medium-grey/25 rounded"
      >
        <CheckboxIndicator
          v-if="checked !== 'indeterminate'"
          class="bg-main-purple h-full w-full rounded flex items-center justify-center outline-none"
        >
          <SvgIcons icon="check" />
        </CheckboxIndicator>
      </CheckboxRoot>
      <span
        class="text-sm"
        :class="[props.isCompleted ? 'line-through' : 'text-black']"
      >
        <slot></slot>
      </span>
    </label>
  </div>
</template>
