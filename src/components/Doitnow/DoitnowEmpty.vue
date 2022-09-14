<template>
  <div class="flex items-center">
    <div class="max-w-xl mx-auto">
      <img
        class="mx-auto"
        width="320"
        height="314"
        src="@/assets/images/emptydoitnow.png"
        alt="Empty task image"
      >
      <div class="flex flex-col items-center">
        <p
          class="text-[20px] text-[#3D3E40] text-center font-bold mt-[17px]"
        >
          Отличная работа! В Очереди пусто.<br>
          Запланируем еще дела?
        </p>
        <div>
          <router-link to="/tasks/today">
            <button
              class="bg-[#FF912380] px-[18px] py-[16px] font-[500] rounded-[8px] text-[#3D3E40] flex items-center text-[16px] mr-1 hover:bg-[#F5DEB3] w-[156px] h-[51px] mr-auto ml-auto mt-[35px]"
            >
              Запланировать
            </button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
