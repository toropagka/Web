<template>
  <full-screen-section
    v-slot="{ cardClass, cardRounded }"
    bg="leadertask"
  >
    <img
      src="https://www.leadertask.ru/templates/default/img/logo.svg"
      class="mb-10"
    >
    <card-component
      :class="cardClass"
      :rounded="cardRounded"
      form
      @submit.prevent="submit"
    >
      <icon
        v-if="form.showBackButton"
        :path="mdiChevronLeft"
        class="cursor-pointer"
        size="24"
        :box="'0 0 24 24'"
        @click="getBack"
      />
      <p class="pb-4 pt-5 text-center text-2xl font-bold dark:text-white">
        {{ form.startScreenText }}
      </p>
      <field>
        <control
          v-model="form.email"
          :icon="form.emailMdi"
          name="email"
          :icon-class="form.emailIconClass"
          placeholder="Email"
          autocomplete="email"
          type="email"
          required
          :disabled="form.emailControlDisabled"
          @blur="checkEmailExistense"
          @keyup.enter="checkEmailExistense"
        />
      </field>
      <jb-button
        v-if="form.showCheckButton"
        class="w-full rounded-lg text-sm"
        color="login"
        :icon="mdiArrowRight"
        label="Продолжить с Email"
        @click="checkEmailExistense"
      />

      <transition-group name="slide-fade">
        <div v-if="showValues.showLoginInputsValue">
          <field>
            <control
              v-model="form.password"
              name="password"
              autocomplete="current-password"
              placeholder="Пароль"
              icon-class="cursor-pointer"
              :icon="form.showPassword ? mdiEyeOutline : mdiEyeOffOutline"
              :type="form.showPassword ? 'text' : 'password'"
              :valid="form.password.trim().length > 7"
              @icon-click="togglePasswordVisibility"
            />
          </field>
          <p
            v-if="form.showError"
            class="text-red-500 text-xs pb-3"
          >
            {{ form.errorMessage }}
          </p>
          <jb-button
            type="submit"
            class="w-full rounded-lg text-sm"
            color="login"
            :icon="mdiArrowRight"
            label="Войти"
          />
          <a
            href="https://www.leadertask.ru/user?t=passrecovery"
            class="text-xs mt-5 text-blue-500 underline decoration-1"
            target="_blank"
          >
            Забыли пароль?
          </a>
        </div>
      </transition-group>

      <transition-group name="slide-fade">
        <div v-if="showValues.showRegisterInputsValue">
          <field
            help="Пароль (не менее 8 символов)"
            :max-count="8"
            :actual-count="form.password.length"
          >
            <control
              v-model="form.password"
              name="password"
              placeholder="Пароль"
              autocomplete="current-password"
              icon-class="cursor-pointer"
              :icon="form.showPassword ? mdiEyeOutline : mdiEyeOffOutline"
              :type="form.showPassword ? 'text' : 'password'"
              :valid="validatePassword"
              @icon-click="togglePasswordVisibility"
              @click="form.passwordTouched = true"
              @blur="validateAndShowMessage"
            />
          </field>

          <field
            help="Введите ваше имя"
            :max-count="3"
            :actual-count="form.username.length"
          >
            <control
              v-model="form.username"
              type="text"
              :icon="mdiAccountOutline"
              name="username"
              autocomplete="username"
              placeholder="Имя пользователя"
              :valid="form.username.length > 2"
              @click="form.usernameTouched = true"
              @blur="validateAndShowMessage"
            />
          </field>

          <field
            help="Введите ваш номер телефона"
          >
            <control
              v-model="form.phone"
              type="text"
              :icon="mdiPhoneOutline"
              name="phone"
              autocomplete="phone"
              placeholder="Номер телефона"
            />
          </field>

          <p
            v-if="form.showError"
            class="text-red-500 text-xs pb-3"
          >
            {{ form.errorMessage }}
          </p>

          <jb-button
            type="submit"
            color="login"
            class="w-full rounded-lg text-sm"
            :icon="mdiArrowRight"
            label="Создать аккаунт"
            :disabled="!allFieldsAreValid"
          />
        </div>
      </transition-group>
    </card-component>
  </full-screen-section>
</template>

<script>
import axios from 'axios'
import { mdiEmailOutline, mdiEyeOutline, mdiEyeOffOutline, mdiAccountOutline, mdiArrowRight, mdiCheckBold, mdiChevronLeft, mdiPhoneOutline } from '@mdi/js'
import FullScreenSection from '@/components/FullScreenSection.vue'
import CardComponent from '@/components/CardComponent.vue'
import Field from '@/components/Field.vue'
import Icon from '@/components/Icon.vue'
import Control from '@/components/Control.vue'
import JbButton from '@/components/JbButton.vue'
import { USER_START_ONBOARDING } from '@/store/actions/onboarding.js'
import { AUTH_REQUEST, AUTH_REGISTER } from '@/store/actions/auth'

export default {
  components: {
    FullScreenSection,
    CardComponent,
    Field,
    Icon,
    Control,
    JbButton
  },
  data () {
    return {
      mdiEmailOutline,
      mdiEyeOffOutline,
      mdiAccountOutline,
      mdiArrowRight,
      mdiChevronLeft,
      mdiEyeOutline,
      mdiPhoneOutline,
      form: {
        email: '',
        password: '',
        username: '',
        phone: '',
        showError: false,
        errorMessage: '',
        isEmailValid: false,
        isPasswordInvalid: false,
        emailMdi: mdiEmailOutline,
        emailIconClass: '',
        emailControlDisabled: false,
        startScreenText: 'ЛидерТаск',
        showCheckButton: true,
        showBackButton: false,
        showPassword: false,
        passwordTouched: false,
        usernameTouched: false
      },
      showValues: {
        showRegisterInputsValue: false,
        showLoginInputsValue: false
      }
    }
  },
  computed: {
    validatePassword () {
      return this.form.password.trim().length > 7
    },
    ifSpaceInPassword () {
      return this.form.password[0] === ' ' || this.form.password[this.form.password.length - 1] === ' '
    },
    ifEmptyFields () {
      return (!this.form.username && this.form.usernameTouched) || (!this.form.password && this.form.passwordTouched)
    },
    allFieldsAreValid () {
      return !this.ifSpaceInPassword && !this.ifEmptyFields && this.validatePassword && this.form.username.length > 2
    }
  },
  methods: {
    login () {
      const uri = process.env.VUE_APP_LEADERTASK_API + 'api/v1/users/auth?login=' + this.form.email + '&password=' + encodeURIComponent(this.form.password) + '&system=' + this.getOSName() + '&type_device=' + this.getSysType()
      this.$store.dispatch(AUTH_REQUEST, uri)
        .then(() => {
          this.$router.push('/')
        })
        .catch(() => {
          this.form.showError = true
          this.form.errorMessage = 'Неверный email пользователя или пароль'
        })
    },
    register () {
      if (!this.form.password || !this.form.username) { return }
      const date = new Date()
      const timezone = date.getTimezoneOffset() / 60 * (-1)
      const data = {
        email: this.form.email,
        password: this.form.password,
        name: this.form.username,
        phone: this.form.phone,
        timezone: timezone,
        system: 'web',
        cid: 'webnew',
        language: 'russian',
        type_device: 'mobile'
      }
      this.$store.dispatch(AUTH_REGISTER, data)
        .then(() => {
          this.$router.push('/')
          this.$store.dispatch(USER_START_ONBOARDING)
        })
        .catch(() => {
          this.form.showError = true
          this.form.errorMessage = 'Unknown error'
        })
    },
    submit () {
      if (this.showValues.showLoginInputsValue) {
        this.login()
      } else if (this.showValues.showRegisterInputsValue && this.form.password.length > 7 && this.form.email.length > 2) {
        this.register()
      }
    },
    getOSName () {
      let detectOS = 'web'

      if (navigator.appVersion.indexOf('Mac') !== -1) {
        detectOS = 'mac'
      } else if (navigator.appVersion.indexOf('Win') !== -1) {
        detectOS = 'windows'
      } else if (navigator.appVersion.indexOf('Android') !== -1) {
        detectOS = 'android'
      } else if (navigator.appVersion.indexOf('iPhone') !== -1) {
        detectOS = 'ios'
      }

      return detectOS
    },
    isMobile () {
      return navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)
    },
    getSysType () {
      return this.isMobile() ? 'mobile' : 'desktop'
    },
    hideLoginInputs () {
      this.showValues.showLoginInputsValue = false
    },
    hideRegisterInputs () {
      this.showValues.showRegisterInputsValue = false
    },
    showLoginInputs () {
      this.showValues.showLoginInputsValue = true
      this.hideRegisterInputs()
    },
    showRegisterInputs () {
      this.showValues.showRegisterInputsValue = true
      this.hideLoginInputs()
    },
    getBack () {
      this.hideLoginInputs()
      this.hideRegisterInputs()
      this.form.emailControlDisabled = false
      this.form.email = ''
      this.form.password = ''
      this.form.username = ''
      this.form.phone = ''
      this.form.startScreenText = 'ЛидерТаск'
      this.form.emailMdi = mdiEmailOutline
      this.form.emailIconClass = ''
      this.form.showCheckButton = true
      this.form.showBackButton = false
      this.form.showError = false
      this.form.showPassword = false
      this.form.errorMessage = ''
    },
    validateEmail () {
      if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(this.form.email)) {
        return true
      }
      return false
    },
    checkEmailExistense () {
      if (this.form.email) {
        if (this.validateEmail()) {
          const uri = process.env.VUE_APP_LEADERTASK_API + 'api/v1/users/exists?email=' + this.form.email
          axios.get(uri)
            .then(() => {
              this.showLoginInputs()
              this.form.emailMdi = mdiCheckBold
              this.form.startScreenText = 'Войти в ЛидерТаск'
              this.form.emailIconClass = 'text-lime-500'
              this.form.emailControlDisabled = true
              this.form.showCheckButton = false
              this.form.showBackButton = true
            })
            .catch(() => {
              this.showRegisterInputs()
              this.form.emailMdi = mdiCheckBold
              this.form.startScreenText = 'Создать аккаунт'
              this.form.emailIconClass = 'text-lime-500'
              this.form.emailControlDisabled = true
              this.form.showCheckButton = false
              this.form.showBackButton = true
            })
        }
      }
    },
    togglePasswordVisibility () {
      this.form.showPassword = !this.form.showPassword
    },
    validateAndShowMessage () {
      if (this.ifSpaceInPassword) {
        this.form.showError = true
        this.form.errorMessage = 'Символ пробела в начале и в конце пароля недопустим'
      } else if (!this.validatePassword) {
        this.form.showError = true
        this.form.errorMessage = 'Длина пароля не может быть меньше 8 символов'
      } else if (this.ifEmptyFields) {
        this.form.showError = true
        this.form.errorMessage = 'Для успешной регистрации заполните все поля'
      } else if (this.form.showError) {
        this.form.showError = false
        this.form.errorMessage = ''
      }
    }
  }
}
</script>

<style>
.error-message {
  color: #8D021F;
  font-size: 14px;
}

.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(45px);
  opacity: 0;
}
</style>
