<template>
  <router-link
    v-if="breadcrumb?.to"
    class="flex gap-[10px] items-center font-roboto text-[16px] text-[#7E7E80] hover:text-[#4C4C4D] font-medium overflow-hidden"
    :to="breadcrumb?.to"
  >
    <span class="flex-initial truncate">
      {{ breadcrumb?.name }}
    </span>
    <svg
      v-if="breadcrumb?.showNext"
      class="flex-none mt-[1px]"
      width="6"
      height="10"
      viewBox="0 0 6 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M0.243325 9.72429C0.564743 10.0415 1.08244 10.0381 1.39963 9.71664L5.32433 5.7396C5.62089 5.43909 5.63988 4.96221 5.36816 4.63906L1.74536 0.330611C1.45474 -0.0150146 0.938954 -0.0596037 0.593328 0.231019C0.247702 0.521642 0.203113 1.03742 0.493736 1.38305L3.63705 5.12126L0.235667 8.56799C-0.0815222 8.88941 -0.0780937 9.4071 0.243325 9.72429Z"
        fill="currentColor"
      />
    </svg>
  </router-link>
  <div
    v-else
    class="flex gap-[10px] items-center font-roboto text-[16px] font-medium overflow-hidden"
    :class="{ 'text-[#7E7E80]': !breadcrumb?.selected, 'text-[#4C4C4D]': breadcrumb?.selected }"
  >
    <span class="flex-initial truncate">
      {{ breadcrumb?.name }}
    </span>
    <svg
      v-if="breadcrumb?.showNext"
      class="flex-none mt-[1px]"
      width="6"
      height="10"
      viewBox="0 0 6 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M0.243325 9.72429C0.564743 10.0415 1.08244 10.0381 1.39963 9.71664L5.32433 5.7396C5.62089 5.43909 5.63988 4.96221 5.36816 4.63906L1.74536 0.330611C1.45474 -0.0150146 0.938954 -0.0596037 0.593328 0.231019C0.247702 0.521642 0.203113 1.03742 0.493736 1.38305L3.63705 5.12126L0.235667 8.56799C-0.0815222 8.88941 -0.0780937 9.4071 0.243325 9.72429Z"
        fill="currentColor"
      />
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    breadcrumb: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style>

</style>
