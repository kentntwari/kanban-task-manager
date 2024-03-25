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

  <!-- CROSS -->
  <svg
    v-if="icon === 'cross'"
    width="15"
    height="15"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      fill="#828FA3"
      fill-rule="evenodd"
    >
      <path d="m12.728 0 2.122 2.122L2.122 14.85 0 12.728z" />
      <path d="M0 2.122 2.122 0 14.85 12.728l-2.122 2.122z" />
    </g>
  </svg>

  <!-- BOARD -->
  <svg
    v-if="icon === 'board'"
    width="16"
    height="16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 2.889A2.889 2.889 0 0 1 2.889 0H13.11A2.889 2.889 0 0 1 16 2.889V13.11A2.888 2.888 0 0 1 13.111 16H2.89A2.889 2.889 0 0 1 0 13.111V2.89Zm1.333 5.555v4.667c0 .859.697 1.556 1.556 1.556h6.889V8.444H1.333Zm8.445-1.333V1.333h-6.89A1.556 1.556 0 0 0 1.334 2.89V7.11h8.445Zm4.889-1.333H11.11v4.444h3.556V5.778Zm0 5.778H11.11v3.11h2a1.556 1.556 0 0 0 1.556-1.555v-1.555Zm0-7.112V2.89a1.555 1.555 0 0 0-1.556-1.556h-2v3.111h3.556Z"
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