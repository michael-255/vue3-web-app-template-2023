<script setup lang="ts">
import { QTable } from 'quasar'
import { Icon, type AnyModel } from '@/constants/globals'
import { onMounted, ref, type Ref } from 'vue'
import { getTableFromSlug, getTableColumnProps } from '@/services/DatabaseUtils'
import { useRoute } from 'vue-router'
import useGoBack from '@/use/useGoBack'
import useLogger from '@/use/useLogger'
import useDatabase from '@/use/useDatabase'

const route = useRoute()
const { log } = useLogger()
const { onGoBack } = useGoBack()
const { getTable } = useDatabase()

const routeTable = getTableFromSlug(route?.params?.tableSlug as string)
const rows: Ref<AnyModel[]> = ref([])
const columns: Ref<any[]> = ref([])
const searchFilter = ref('')

onMounted(async () => {
  try {
    // TODO - This needs to be handled by a live query that will give me more control and auto update when changed
    rows.value = (await getTable(routeTable)) as AnyModel[]
    columns.value = getTableColumnProps(routeTable)
  } catch (error) {
    log.error('Failed to retrieve table data', error)
  }
})
</script>

<template>
  <QTable
    :rows="rows"
    :columns="columns"
    :rows-per-page-options="[0]"
    virtual-scroll
    fullscreen
    row-key="id"
  >
    <!-- Column Headers -->
    <!-- Hiding "hiddenId" so only the truncated Id* is shown -->
    <template v-slot:header="props">
      <QTr :props="props">
        <QTh
          v-show="col.name !== 'hiddenId'"
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
        >
          {{ col.label }}
        </QTh>
        <QTh auto-width />
      </QTr>
    </template>

    <template v-slot:top>
      <div class="row justify-start full-width q-mb-md">
        <div class="col-10 text-h6 ellipsis">{{ routeTable }}</div>
        <QBtn
          round
          flat
          class="absolute-top-right q-mr-sm q-mt-sm"
          :icon="Icon.CLOSE"
          @click="onGoBack()"
        />
      </div>

      <div class="row justify-start full-width">
        <div class="col-12">
          <QInput
            outlined
            dense
            clearable
            debounce="300"
            v-model="searchFilter"
            placeholder="Search"
          >
            <template v-slot:before>
              <QBtn color="primary" class="q-px-sm" :icon="Icon.OPTIONS" />
            </template>

            <template v-slot:append>
              <QIcon name="search" />
            </template>
          </QInput>
        </div>
      </div>
    </template>

    <template v-slot:bottom>
      <div class="row justify-between full-width">
        <QBtn color="positive" class="q-px-sm" :icon="Icon.ADD" />
        <!-- Use getItemsCountText from Dashboard (make it a composable?) -->
        <div class="q-mt-sm">{{ rows.length || 0 }} items found</div>
      </div>
    </template>
  </QTable>
</template>