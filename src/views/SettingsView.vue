<script setup lang="ts">
import { QSelect, QBtn, QOptionGroup } from 'quasar'
import { AppText, Icon, DatabaseTable, Limit, RouteName } from '@/constants/globals'
import { slugify } from '@/utils/common'
import useSettings from '@/use/useSettings'
import ResponsivePage from '@/components/ResponsivePage.vue'

const {
  showIntroduction,
  darkMode,
  showAllDataColumns,
  showConsoleLogs,
  showDebugMessages,
  showInfoMessages,
  importFile,
  deleteDataOptions,
  deleteDataModel,
  exportTableOptions,
  exportTableModel,
  logRetentionModel,
  logRetentionLabels,
  onTestLogger,
  onDefaults,
  onRejectedFile,
  onImportFile,
  onExportData,
  onChangeLogRetention,
  onDeleteUnusedData,
  onDeleteOrphanedData,
  onDeleteTableData,
  onDeleteAllData,
  onDeleteDatabase,
} = useSettings()
</script>

<template>
  <ResponsivePage :banner-icon="Icon.SETTINGS" banner-title="Settings">
    <!-- Options -->
    <QCard class="q-mb-md">
      <QCardSection>
        <div class="text-h6 q-mb-md">Options</div>

        <!-- Toggles -->
        <div class="q-mb-md">
          Introduction provides instructions on the Home page on how to use the app.
        </div>

        <QToggle v-model="showIntroduction" class="q-mb-md" label="Show Introduction" />

        <div class="q-mb-md">
          Dark Mode allows you to switch between a light or dark theme for the app.
        </div>

        <QToggle v-model="darkMode" class="q-mb-md" label="Dark Mode" />

        <div class="q-mb-md">
          Show all columns while on the data table page or only show the default columns. You can
          change the individual columns while on the page.
        </div>

        <QToggle v-model="showAllDataColumns" label="Show All Data Columns" />
      </QCardSection>
    </QCard>

    <!-- Defaults -->
    <QCard class="q-mb-md">
      <QCardSection>
        <div class="text-h6 q-mb-md">Defaults</div>

        <!-- Examples -->
        <div class="q-mb-md">Load default Examples into the database.</div>

        <QBtn label="Load Examples" color="primary" @click="onDefaults()" />
      </QCardSection>
    </QCard>

    <!-- Data Management -->
    <QCard class="q-mb-md">
      <QCardSection>
        <div class="text-h6 q-mb-md">Data Management</div>

        <!-- Import -->
        <div class="q-mb-md">
          Import data into the database from a JSON file. The app expects the data in the file to be
          structured the same as the exported version.
        </div>

        <QFile
          v-model="importFile"
          dense
          outlined
          counter
          bottom-slots
          label="File Select"
          :max-file-size="Limit.FILESIZE"
          accept="application/json"
          @rejected="onRejectedFile"
        >
          <template v-slot:before>
            <QBtn :disable="!importFile" label="Import" color="primary" @click="onImportFile()" />
          </template>

          <template v-slot:append>
            <QIcon
              v-if="importFile"
              :name="Icon.CLOSE"
              class="cursor-pointer"
              @click.stop="importFile = null"
            />
          </template>
        </QFile>

        <!-- Export -->
        <div class="q-mb-md">
          Export the selected data tables as a JSON file. Do this on a regularly basis so you have a
          backup of your data.
        </div>

        <QOptionGroup
          class="q-mb-md"
          v-model="exportTableModel"
          :options="exportTableOptions"
          type="checkbox"
        />

        <QBtn
          class="q-mb-md"
          :disable="exportTableModel.length === 0"
          label="Export"
          color="primary"
          @click="onExportData(exportTableModel)"
        />

        <!-- Access Internal Tables -->
        <div class="q-mb-md">
          Access the internal {{ AppText.APP_NAME }} data tables if you need to troubleshoot issues.
        </div>

        <div class="q-mb-md">
          <QBtn
            label="Logs Table"
            color="primary"
            :to="{ name: RouteName.DATA, params: { tableSlug: slugify(DatabaseTable.LOGS) } }"
          />
        </div>

        <div>
          <QBtn
            label="Settings Table"
            color="primary"
            :to="{ name: RouteName.DATA, params: { tableSlug: slugify(DatabaseTable.SETTINGS) } }"
          />
        </div>
      </QCardSection>
    </QCard>

    <!-- Logs -->
    <QCard class="q-mb-md">
      <QCardSection>
        <div class="text-h6 q-mb-md">Logs</div>

        <!-- Toggles -->
        <div class="q-mb-md">
          Show Console Logs will display all log messages in the developer console.
        </div>

        <QToggle v-model="showConsoleLogs" class="q-mb-md" label="Show Console Logs" />

        <div class="q-mb-md">Show Debug Messages will display debug level notification alerts.</div>

        <QToggle v-model="showDebugMessages" class="q-mb-md" label="Show Debug Messages" />

        <div class="q-mb-md">Show Info Messages will display info level notification alerts.</div>

        <QToggle v-model="showInfoMessages" class="q-mb-md" label="Show Info Messages" />

        <!-- Test Logger -->
        <div class="q-mb-md">
          Validate that your logging settings above are working as expected by using the test action
          below.
        </div>

        <QBtn class="q-mb-md" label="Test Logger" color="primary" @click="onTestLogger()" />

        <!-- Log Retention Time -->
        <div class="q-mb-md">
          Change log retention time below. Logs older than the selected time will be deleted. This
          functions retroactivley, so if you change the time to 3 months, all logs older than 3
          months will be deleted. Expired log processing occurs every time the app is loaded.
        </div>

        <QSlider
          v-model="logRetentionModel"
          :label-value="logRetentionLabels[logRetentionModel]"
          class="q-mb-lg"
          color="primary"
          markers
          label-always
          switch-label-side
          :min="0"
          :max="5"
          :step="1"
          @change="(logRetentionIndex) => onChangeLogRetention(logRetentionIndex)"
        />
      </QCardSection>
    </QCard>

    <!-- DANGER ZONE -->
    <QCard class="q-mb-md">
      <QCardSection>
        <div class="text-h6 text-negative q-mb-md">DANGER ZONE</div>

        <div class="q-mb-md">
          The following operations cannot be undone. Consider exporting your data before proceeding.
        </div>

        <!-- Delete Table Data -->
        <div class="q-mb-md">Select a table and permanently delete all of its data.</div>

        <QSelect
          v-model="deleteDataModel"
          outlined
          dense
          label="Database Table"
          class="q-mb-md"
          :options="deleteDataOptions"
        >
          <template v-slot:before>
            <QBtn
              :disable="!deleteDataModel"
              label="Delete Data"
              color="negative"
              @click="onDeleteTableData(deleteDataModel as DatabaseTable)"
            />
          </template>
        </QSelect>

        <!-- Delete Unused Parent Items -->
        <div class="q-mb-md">
          Delete all unused parent items that have no record items associated with them.
        </div>

        <QBtn
          class="q-mb-md"
          label="Delete Unused Items"
          color="negative"
          @click="onDeleteUnusedData()"
        />

        <!-- Delete Orphaned Record Items -->
        <div class="q-mb-md">
          Delete all orphaned record items that have no parent item associated with them.
        </div>

        <QBtn
          class="q-mb-md"
          label="Delete Orphaned Items"
          color="negative"
          @click="onDeleteOrphanedData()"
        />

        <!-- Delete All Data -->
        <div class="q-mb-md">Permanently delete all data from the database.</div>

        <QBtn class="q-mb-md" label="Delete All Data" color="negative" @click="onDeleteAllData()" />

        <!-- Delete Database -->
        <div class="q-mb-md">
          Delete the underlining database and all of its data (requires website reload).
        </div>

        <QBtn label="Delete Database" color="negative" @click="onDeleteDatabase()" />
      </QCardSection>
    </QCard>
  </ResponsivePage>
</template>
