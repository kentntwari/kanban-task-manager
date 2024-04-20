<script setup lang="ts">
  const props = defineProps<{
    taskId: string;
    currentStatus: string;
  }>();

  const emit = defineEmits<{
    update: [value: string];
  }>();

  const { $client } = useNuxtApp();

  const { data: options } = useAsyncData("allTasksStatuses", () =>
    $client.getAllStatus.query({ taskId: props.taskId })
  );

  const v = ref(props.currentStatus);

  watch(
    () => v.value,
    (newStatus) => emit("update", newStatus)
  );
</script>

<template>
  <ComboSelect v-model="v" placeholder="Select status...">
    <template #empty>No status available</template>
    <template #content>
      <ComboSelectItem
        v-for="(option, index) in options"
        :key="index"
        :value="option.name"
      >
        <span class="font-medium">
          {{ option.name }}
        </span>
      </ComboSelectItem>
    </template>
  </ComboSelect>
</template>
