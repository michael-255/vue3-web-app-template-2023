<script setup lang="ts">
import { Icon } from '@/constants/globals'
import { QPage, QPageScroller, QBtn } from 'quasar'

defineProps<{
  bannerIcon?: Icon
  bannerTitle?: string
}>()
</script>

<template>
  <QPage padding>
    <div class="row justify-center">
      <div class="col-md-6 col-xs-12">
        <!-- Optional Banner -->
        <QCard v-if="bannerIcon && bannerTitle" class="q-mb-md">
          <QCardSection class="text-h5">
            <QIcon class="q-pb-xs q-pr-xs" :name="bannerIcon" />
            {{ bannerTitle }}
          </QCardSection>
        </QCard>

        <!-- Additional Components Slot -->
        <slot />
      </div>
    </div>

    <!-- Page Scroller -->
    <QPageScroller>
      <QBtn fab :icon="Icon.TOP_OF_PAGE" color="accent" />
    </QPageScroller>
  </QPage>
</template>
