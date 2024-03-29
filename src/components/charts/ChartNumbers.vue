<script setup lang="ts">
import { colors, date } from 'quasar'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from 'chart.js'
import { onMounted, ref, type Ref } from 'vue'
import { DatabaseField, type DatabaseChildType } from '@/types/database'
import { getChildType } from '@/services/Blueprints'
import type { AppObject } from '@/types/misc'
import useLogger from '@/composables/useLogger'
import useRoutables from '@/composables/useRoutables'
import useUIStore from '@/stores/ui'
import useChartTimeWatcher from '@/composables/useChartTimeWatcher'
import DB from '@/services/LocalDatabase'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
)

// Props & Emits
defineProps<{
  label: string
  chartOptions: AppObject
}>()

// Composables & Stores
const uiStore = useUIStore()
const { getPaletteColor } = colors
const { log } = useLogger()
const { routeDatabaseType, routeId } = useRoutables()
useChartTimeWatcher(recalculateChart)

// Data
const recordCount: Ref<number> = ref(0)
const chartData: Ref<{
  labels: any[]
  datasets: any[]
}> = ref({
  labels: [],
  datasets: [],
})

onMounted(async () => {
  await recalculateChart()
})

/**
 * Returns the color for the chart line if the trend is downward.
 * @param ctx
 * @param value
 */
function downwardTrend(ctx: any, color: any) {
  return ctx.p0.parsed.y > ctx.p1.parsed.y ? color : undefined
}

/**
 * Rebuilds the chart data.
 */
async function recalculateChart() {
  try {
    // Get all records for the current route type and id
    const chartingRecords = await DB.getChildRecordsByParentId(
      getChildType(routeDatabaseType) as DatabaseChildType,
      routeId
    )

    // Continue if there are records
    if (chartingRecords.length > 0) {
      const chartMilliseconds = uiStore.getChartTimeMilliseconds

      // Filter records to only include those within the chart time
      const timeRestrictedRecords = chartingRecords.filter((record: any) => {
        const timeDifference = new Date().getTime() - record[DatabaseField.CREATED_TIMESTAMP]
        return timeDifference <= chartMilliseconds
      })

      recordCount.value = timeRestrictedRecords.length

      // Create chart label dates from the created timestamps
      const chartLabels = timeRestrictedRecords.map((record: any) =>
        date.formatDate(record[DatabaseField.CREATED_TIMESTAMP], 'YYYY MMM D')
      )

      // Create chart data from the number fields
      const chartDataItems = timeRestrictedRecords.map(
        (record: any) => record[DatabaseField.NUMBER]
      )

      // Set chart data with the labels and data
      chartData.value = {
        labels: chartLabels,
        datasets: [
          {
            label: '', // Legend label
            backgroundColor: getPaletteColor('primary'),
            borderColor: getPaletteColor('primary'),
            segment: {
              borderColor: (ctx: any) =>
                downwardTrend(ctx, getPaletteColor('accent')) || getPaletteColor('primary'),
            },
            data: chartDataItems,
          },
        ],
      }
    }
  } catch (error) {
    log.error('Error loading numbers chart', error)
  }
}
</script>

<template>
  <QCard class="q-mb-md">
    <QCardSection>
      <div class="text-h6">{{ label }}</div>

      <div>Displays all numbers recorded over time.</div>

      <!-- Chart -->
      <Line v-if="recordCount && recordCount > 0" :options="chartOptions" :data="chartData" />

      <!-- Record Count -->
      <QBadge v-if="recordCount && recordCount === 1" rounded color="secondary" class="q-py-none">
        <span class="text-caption">{{ recordCount }} record in time frame</span>
      </QBadge>
      <QBadge v-if="recordCount && recordCount > 1" rounded color="secondary" class="q-py-none">
        <span class="text-caption">{{ recordCount }} records in time frame</span>
      </QBadge>

      <!-- No Data -->
      <div v-else>No records found</div>
    </QCardSection>
  </QCard>
</template>
