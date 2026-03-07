<script setup lang="ts">
const roleNameToIdMap: Record<string, number> = {
  admin: 1,
  author: 2,
  editor: 3,
  maintainer: 4,
  subscriber: 5,
  user: 5,
}

interface UserData {
  id: number | null
  firstname: string
  lastname: string
  username: string
  email: string
  isActive: boolean
  roleId: number | null

  // Backward-compatibility for old callers
  fullName?: string
  role?: string
  status?: string
}

interface Props {
  userData?: UserData
  isDialogVisible: boolean
}

interface Emit {
  (e: 'submit', value: UserData): void
  (e: 'update:isDialogVisible', val: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  userData: () => ({
    id: null,
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    isActive: true,
    roleId: null,
  }),
})

const emit = defineEmits<Emit>()

const normalizeUserData = (data: UserData): UserData => {
  const fullName = (data.fullName || '').trim()
  const [firstFromName = '', ...restName] = fullName.split(' ')

  return {
    id: data.id ?? null,
    firstname: data.firstname || firstFromName,
    lastname: data.lastname || restName.join(' ').trim(),
    username: data.username || '',
    email: data.email || '',
    isActive: typeof data.isActive === 'boolean' ? data.isActive : (data.status || '').toLowerCase() === 'active',
    roleId: data.roleId || roleNameToIdMap[(data.role || '').toLowerCase()] || 5,
  }
}

const userData = ref<UserData>(normalizeUserData(structuredClone(toRaw(props.userData))))

watch(props, () => {
  userData.value = normalizeUserData(structuredClone(toRaw(props.userData)))
})

const onFormSubmit = () => {
  emit('update:isDialogVisible', false)
  emit('submit', userData.value)
}

const onFormReset = () => {
  userData.value = structuredClone(toRaw(props.userData))

  emit('update:isDialogVisible', false)
}

const dialogVisibleUpdate = (val: boolean) => {
  emit('update:isDialogVisible', val)
}
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 800"
    :model-value="props.isDialogVisible"
    @update:model-value="dialogVisibleUpdate"
  >
    <VCard class="pa-sm-9 pa-5">
      <!-- 👉 dialog close btn -->
      <DialogCloseBtn
        variant="text"
        size="small"
        @click="onFormReset"
      />

      <VCardItem class="text-center">
        <VCardTitle class="text-h5 mb-2">
          Edit User Information
        </VCardTitle>
      </VCardItem>

      <VCardText>
        <!-- 👉 Form -->
        <VForm
          class="mt-6"
          @submit.prevent="onFormSubmit"
        >
          <VRow>
            <!-- 👉 Firstname -->
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="userData.firstname"
                label="Firstname"
                placeholder="Somchai"
              />
            </VCol>

            <!-- 👉 Lastname -->
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="userData.lastname"
                label="Lastname"
                placeholder="Jaidee"
              />
            </VCol>

            <!-- 👉 Username -->
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="userData.username"
                label="Username"
                placeholder="somchai.j"
              />
            </VCol>

            <!-- 👉 Email -->
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="userData.email"
                label="Email"
                placeholder="somchai.j@gmail.com"
              />
            </VCol>

            <!-- 👉 Role ID -->
            <VCol
              cols="12"
              md="6"
            >
              <VSelect
                v-model="userData.roleId"
                label="Role"
                :items="[
                  { title: 'Admin (1)', value: 1 },
                  { title: 'Author (2)', value: 2 },
                  { title: 'Editor (3)', value: 3 },
                  { title: 'Maintainer (4)', value: 4 },
                  { title: 'Subscriber (5)', value: 5 },
                ]"
              />
            </VCol>

            <!-- 👉 Is Active -->
            <VCol
              cols="12"
              md="6"
            >
              <VSwitch
                v-model="userData.isActive"
                density="compact"
                label="Active"
              />
            </VCol>

            <!-- 👉 Submit and Cancel -->
            <VCol
              cols="12"
              class="d-flex flex-wrap justify-center gap-4"
            >
              <VBtn type="submit">
                Submit
              </VBtn>

              <VBtn
                color="secondary"
                variant="outlined"
                @click="onFormReset"
              >
                Cancel
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
