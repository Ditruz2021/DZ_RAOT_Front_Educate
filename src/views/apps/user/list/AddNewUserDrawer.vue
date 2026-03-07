<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { VForm } from 'vuetify/components/VForm'

import type { CreateUserPayload } from '@/views/apps/user/useUserListStore'
import { emailValidator, requiredValidator } from '@validators'

interface Emit {
  (e: 'update:isDrawerOpen', value: boolean): void
  (e: 'userData', value: CreateUserPayload): void
}

interface Props {
  isDrawerOpen: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const isDialogVisible = computed({
  get: () => props.isDrawerOpen,
  set: value => emit('update:isDrawerOpen', value),
})

const isFormValid = ref(false)
const refForm = ref<VForm>()
const firstName = ref('')
const lastName = ref('')
const username = ref('')
const email = ref('')
const isActive = ref(true)
const roleId = ref<number | null>(null)

// 👉 drawer close
const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)

  nextTick(() => {
    refForm.value?.reset()
    refForm.value?.resetValidation()
  })
}

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      emit('userData', {
        firstname: firstName.value,
        lastname: lastName.value,
        username: username.value,
        email: email.value,
        isActive: isActive.value,
        roleId: roleId.value || 1,
      })
      emit('update:isDrawerOpen', false)
      nextTick(() => {
        refForm.value?.reset()
        refForm.value?.resetValidation()
      })
    }
  })
}

</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 600"
    v-model="isDialogVisible"
  >
    <VCard>
      <DialogCloseBtn
        variant="text"
        size="small"
        @click="closeNavigationDrawer"
      />

      <VCardItem>
        <VCardTitle>Add User</VCardTitle>
      </VCardItem>

      <VCardText>
        <!-- 👉 Form -->
        <VForm
          ref="refForm"
          v-model="isFormValid"
          @submit.prevent="onSubmit"
        >
          <VRow>
              <!-- 👉 Firstname -->
            <VCol cols="12">
              <VTextField
                v-model="firstName"
                :rules="[requiredValidator]"
                label="Firstname"
                placeholder="Somchai"
              />
            </VCol>

              <!-- 👉 Lastname -->
            <VCol cols="12">
              <VTextField
                v-model="lastName"
                :rules="[requiredValidator]"
                label="Lastname"
                placeholder="Jaidee"
              />
            </VCol>

              <!-- 👉 Username -->
            <VCol cols="12">
              <VTextField
                v-model="username"
                :rules="[requiredValidator]"
                label="Username"
                placeholder="somchai.j"
              />
            </VCol>

              <!-- 👉 Email -->
            <VCol cols="12">
              <VTextField
                v-model="email"
                :rules="[requiredValidator, emailValidator]"
                label="Email"
                placeholder="somchai.j@gmail.com"
              />
            </VCol>

              <!-- 👉 Role ID -->
            <VCol cols="12">
              <VSelect
                v-model="roleId"
                :rules="[requiredValidator]"
                label="Role"
                placeholder="Select Role"
                :items="[
                  { title: 'Admin (1)', value: 1 },
                  { title: 'User (2)', value: 2 },
                ]"
              />
            </VCol>

              <!-- 👉 Is Active -->
            <VCol cols="12">
              <VSwitch
                v-model="isActive"
                label="Active"
                inset
              />
            </VCol>

              <!-- 👉 Submit and Cancel -->
            <VCol cols="12">
              <VBtn
                type="submit"
                class="me-3"
              >
                Submit
              </VBtn>
              <VBtn
                type="reset"
                variant="outlined"
                color="secondary"
                @click="closeNavigationDrawer"
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
