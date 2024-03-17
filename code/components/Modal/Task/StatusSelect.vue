<script
  setup
  lang="ts"
>
const props = defineProps<{
  taskId: string,
  currentStatus: string
}>()

const emit = defineEmits<{
  update: [value: string]
}>()

const {$client} = useNuxtApp()

const {data: options} = useAsyncData('allTasksStatuses', ()=> $client.getParentColumnStatuses.query({taskId: props.taskId}))

const v = ref(props.currentStatus)

watch(()=> v.value, (newStatus)=> emit('update', newStatus))
</script>

<template>
  <ComboboxRoot
    v-model="v"
    class="relative"
  >
    <ComboboxAnchor
      class="w-full inline-flex items-center justify-between rounded px-4 text-md text-black leading-none h-10 border border-medium-grey/25"
    >
      <ComboboxInput
        class="!bg-transparent outline-none text-grass11 h-full selection:bg-grass5 placeholder-mauve8"
        placeholder="Select status..."
      />
      <ComboboxTrigger>
        <SvgIcons icon="chevron-down" />
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxContent
      class="absolute z-10 w-full mt-2 min-w-[160px] bg-white overflow-hidden rounded shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
    >
      <ComboboxViewport class="p-[5px]">
        <ComboboxEmpty
          class="text-mauve8 text-xs font-medium text-center py-2" />

        <ComboboxGroup class="p-4">
          <ComboboxItem
            v-for="(option, index) in options"
            :key="index"
            class="relative py-2 text-md leading-none cursor-pointer"
            :value="option.status"
          >
            <span class="font-medium">
              {{ option.status }}
            </span>
          </ComboboxItem>
        </ComboboxGroup>
      </ComboboxViewport>
    </ComboboxContent>
  </ComboboxRoot>
</template>