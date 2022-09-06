<template>
  <div
    class="rounded-xl bg-white"
  >
    <div class="w-full flex justify-center p-2">
      <div
        class="animate-pulse bg-gray-200 rounded-[10px] h-[72px] w-[104px]"
      />
    </div>
    <div class="mt-2 p-2 flex justify-center">
      <div class="h-[30px] w-[70px] animate-pulse rounded-[10px] bg-gray-200" />
      <div class="h-[30px] w-[120px] rounded-[10px] bg-gray-200 ml-[20px]" />
    </div>
    <br>
    <div class="grid grid-cols-1 gap-4 p-5">
      <div class="flex flex-col items-center">
        <div class="h-[32px] w-[160px] bg-gray-200 animate-pulse rounded-[10px] mb-[5px]" />
        <div class="w-full h-[328px] bg-gray-200 animate-pulse rounded-[10px]" />
      </div>
      <div class="flex flex-col items-center">
        <div class="w-[250px] h-[48px] bg-gray-200 animate-pulse rounded-[10px]" />
        <div
          v-for="i in 6"
          :key="i"
          class="w-full h-[120px] mt-[10px] rounded-[10px] bg-gray-200 animate-pulse"
        />
      </div>
    </div>
  </div>
</template>
