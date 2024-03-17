<template>
  <!-- CHEVRON DOWN -->
  <svg
    v-if="icon === 'chevron-down'"
    width="10"
    height="7"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      stroke="#635FC7"
      stroke-width="2"
      fill="none"
      d="m1 1 4 4 4-4"
    />
  </svg>

  <!-- PLUS -->
  <svg
    v-if="icon === 'plus'"
    width="12"
    height="12"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="#FFF"
      d="M7.368 12V7.344H12V4.632H7.368V0H4.656v4.632H0v2.712h4.656V12z"
    />
  </svg>

  <!-- DOTS -->
  <svg
    v-if="icon === 'dots'"
    width="5"
    height="20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      fill="#828FA3"
      fill-rule="evenodd"
    >
      <circle
        cx="2.308"
        cy="2.308"
        r="2.308"
      />
      <circle
        cx="2.308"
        cy="10"
        r="2.308"
      />
      <circle
        cx="2.308"
        cy="17.692"
        r="2.308"
      />
    </g>
  </svg>

  <!-- CHECK -->
  <svg
    v-if="icon === 'check'"
    width="10"
    height="8"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      stroke="#FFF"
      stroke-width="2"
      fill="none"
      d="m1.276 3.066 2.756 2.756 5-5"
    />
  </svg>
</template>

<script
  setup
  lang="ts"
>
defineProps<{
  icon: string
}>()
</script>