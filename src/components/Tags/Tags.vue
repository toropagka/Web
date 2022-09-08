<template>
  <NavBar class="flex lg:hidden" />
  <TagModalBoxTagsLimit
    v-if="showTagsLimit"
    @cancel="showTagsLimit = false"
    @ok="showTagsLimit = false"
  />
  <div id="tags">
    <p
      class="font-['Roboto'] text-[#424242] text-[19px] leading-[22px] font-bold pt-[30px]"
    >
      Метки
    </p>
    <div class="flex flex-col gap-[6px] mt-[25px]">
      <TagInput
        v-if="showAddTag"
        class="place-self-start mb-[25px] w-[184px]"
        @save="createTag"
        @cancel="showAddTag = false"
      />
      <TagAdd
        v-else
        class="place-self-start mb-[25px] w-[184px]"
        @click="clickAddTag"
      />
      <template
        v-for="tag in tags"
        :key="tag.uid"
      >
        <TagItem
          class="place-self-start max-w-full"
          :count="tag.children?.length ?? 0"
          :color="tag.back_color"
          :title="tag.name"
          :selected="focusedTag === tag.uid"
          @click="openProperties(tag)"
        />
      </template>
    </div>
    <EmptyTasksListPics v-if="isEmpty" />
  </div>
</template>

<script>
import TagModalBoxTagsLimit from '@/components/Tags/TagModalBoxTagsLimit.vue'
import TagItem from '@/components/Tags/TagItem.vue'
import TagAdd from '@/components/Tags/TagAdd.vue'
import TagInput from '@/components/Tags/TagInput.vue'
import EmptyTasksListPics from '@/components/TasksList/EmptyTasksListPics'
import * as TASK from '@/store/actions/tasks'
import { SELECT_TAG } from '@/store/actions/tasks'
import * as NAVIGATOR from '@/store/actions/navigator'
import { uuidv4 } from '@/helpers/functions'

import NavBar from '@/components/Navbar/NavBar.vue'

export default {
  components: {
    TagItem,
    TagAdd,
    TagInput,
    NavBar,
    TagModalBoxTagsLimit,
    EmptyTasksListPics
  },
  data () {
    return {
      focusedTag: '',
      showTagsLimit: false,
      randomColors: [
        '#F5F5DC',
        '#FFE5B4',
        '#FFC0CB',
        '#D0F0C0',
        '#C9A0DC',
        '#D8BFD8',
        '#FFCC00',
        '#F4A460',
        '#FFDB58',
        '#E6E6FA'
      ],
      showAddTag: false
    }
  },
  computed: {
    isPropertiesMobileExpanded () {
      return this.$store.state.isPropertiesMobileExpanded
    },
    tags () {
      return this.$store.getters.sortedNavigator.tags?.items
    },
    user () {
      return this.$store.state.user.user
    },
    isEmpty () {
      return !this.tags.length
    }
  },
  watch: {
    isPropertiesMobileExpanded: {
      immediate: true,
      handler: function (val) {
        if (!val) {
          this.focusedTag = ''
        }
      }
    }
  },
  methods: {
    openProperties (tag) {
      this.focusedTag = tag.uid
      this.$store.dispatch('asidePropertiesToggle', true)
      this.$store.commit('basic', { key: 'propertiesState', value: 'tag' })
      this.$store.commit(SELECT_TAG, tag)
      console.log('select tag', tag)
    },
    clickAddTag () {
      // если лицензия истекла
      if (this.tags.length >= 3 && this.user.days_left <= 0) {
        this.showTagsLimit = true
        return
      }
      this.showAddTag = true
    },
    createTag (name) {
      this.showAddTag = false

      const title = name.trim()
      if (!title) return

      const randomIndex = Math.floor(Math.random() * this.randomColors.length - 1)
      const randomColor = this.randomColors[randomIndex]
      const data = {
        back_color: randomColor,
        uid: uuidv4(),
        name: title
      }
      this.$store.dispatch(TASK.CREATE_TAG_REQUEST, data)
        .then((resp) => {
          const tag = { ...resp.data }
          console.log('CREATE_TAG_REQUEST', tag)
          tag.global_property_uid = '00a5b3de-9474-404d-b3ba-83f488ac6d30'
          this.$store.commit(NAVIGATOR.NAVIGATOR_PUSH_TAG, [tag])
          this.openProperties(tag)
        })
    }
  }
}
</script>
