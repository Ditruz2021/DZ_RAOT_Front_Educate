<script setup lang="ts">
import type { UserProperties } from '@/@fake-db/types'
import { paginationMeta } from '@/@fake-db/utils'
import AddNewUserDrawer from '@/views/apps/user/list/AddNewUserDrawer.vue'
import type { CreateUserPayload, EditUserPayload } from '@/views/apps/user/useUserListStore'
import { useUserListStore } from '@/views/apps/user/useUserListStore'
import type { Options } from '@core/types'
import { avatarText } from '@core/utils/formatters'
import { VDataTableServer } from 'vuetify/labs/VDataTable'

// 👉 Store
const userListStore = useUserListStore()
const searchQuery = ref('')
const appliedSearchQuery = ref('')
const selectedRole = ref()
const selectedPlan = ref()
const selectedStatus = ref()
const totalPage = ref(1)
const totalUsers = ref(0)
const users = ref<UserProperties[]>([])

const roleIdToNameMap: Record<number, string> = {
  1: 'admin',
  2: 'user',
}

const options = ref<Options>({
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
  groupBy: [],
  search: undefined,
})

// Headers
const headers = [
  { title: 'User', key: 'user' },
  { title: 'Email', key: 'email' },
  { title: 'Role', key: 'role' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false },
]

// 👉 Fetching users
const fetchUsers = () => {
  return userListStore.fetchUsers({
    q: appliedSearchQuery.value,
    status: selectedStatus.value,
    plan: selectedPlan.value,
    role: selectedRole.value,
    options: options.value,
  }).then(response => {
    users.value = response.data.users
    totalPage.value = response.data.totalPage
    totalUsers.value = response.data.totalUsers
    options.value.page = response.data.page
  }).catch(error => {
    console.error(error)
  })
}

const onSearch = () => {
  appliedSearchQuery.value = (searchQuery.value || '').trim()
  options.value.page = 1
  fetchUsers()
}

const onClearSearch = () => {
  searchQuery.value = ''
  appliedSearchQuery.value = ''
  options.value.page = 1
  fetchUsers()
}

onMounted(fetchUsers)

watch(
  () => [options.value.page, options.value.itemsPerPage],
  fetchUsers,
)

const resolveUserRoleVariant = (role: string) => {
  const roleLowerCase = role.toLowerCase()

  if (roleLowerCase === 'subscriber')
    return { color: 'primary', icon: 'mdi-account-outline' }
  if (roleLowerCase === 'author')
    return { color: 'warning', icon: 'mdi-cog-outline' }
  if (roleLowerCase === 'maintainer')
    return { color: 'success', icon: 'mdi-chart-donut' }
  if (roleLowerCase === 'editor')
    return { color: 'info', icon: 'mdi-pencil-outline' }
  if (roleLowerCase === 'admin')
    return { color: 'error', icon: 'mdi-laptop' }

  return { color: 'primary', icon: 'mdi-account-outline' }
}

const resolveUserStatusVariant = (stat: string) => {
  const statLowerCase = stat.toLowerCase()
  if (statLowerCase === 'pending')
    return 'warning'
  if (statLowerCase === 'active')
    return 'success'
  if (statLowerCase === 'inactive')
    return 'secondary'

  return 'primary'
}

const isAddNewUserDrawerVisible = ref(false)
const isUserViewDialogVisible = ref(false)
const isUserInfoEditDialogVisible = ref(false)

type DialogUserData = UserProperties & {
  taskDone: number | null
  projectDone: number | null
  taxId: string
  language: string
}

type EditDialogSubmitPayload = Omit<EditUserPayload, 'roleId'> & {
  roleId: number | null
}

const selectedUser = ref<DialogUserData>({
  id: 0,
  fullName: '',
  company: '',
  role: '',
  username: '',
  country: '',
  contact: '',
  email: '',
  currentPlan: '',
  status: '',
  avatar: '',
  taskDone: 0,
  projectDone: 0,
  taxId: '-',
  language: 'English',
})

const editUserData = ref<EditUserPayload>({
  id: null,
  firstname: '',
  lastname: '',
  username: '',
  email: '',
  isActive: true,
  roleId: 1,
})

const setSelectedUser = (user: UserProperties) => {
  selectedUser.value = {
    ...user,
    taskDone: 0,
    projectDone: 0,
    taxId: '-',
    language: 'English',
  }
}

const openViewDialog = (user: UserProperties) => {
  setSelectedUser(user)
  isUserViewDialogVisible.value = true
}

const openEditDialog = (user: UserProperties) => {
  userListStore.fetchUser(user.id).then(response => {
    editUserData.value = response.data.user || {
      id: user.id,
      firstname: user.fullName.split(' ')[0] || '',
      lastname: user.fullName.split(' ').slice(1).join(' '),
      username: user.username,
      email: user.email,
      isActive: user.status.toLowerCase() === 'active',
      roleId: 5,
    }
    isUserInfoEditDialogVisible.value = true
  }).catch(error => {
    console.error(error)
    editUserData.value = {
      id: user.id,
      firstname: user.fullName.split(' ')[0] || '',
      lastname: user.fullName.split(' ').slice(1).join(' '),
      username: user.username,
      email: user.email,
      isActive: user.status.toLowerCase() === 'active',
      roleId: 5,
    }
    isUserInfoEditDialogVisible.value = true
  })
}

const updateUser = async (userData: EditDialogSubmitPayload) => {
  if (!userData.id)
    return

  try {
    const roleId = userData.roleId || 5

    await userListStore.updateUser(userData.id, {
      firstname: userData.firstname,
      lastname: userData.lastname,
      username: userData.username,
      email: userData.email,
      isActive: userData.isActive,
      roleId,
    })

    const userIndex = users.value.findIndex(user => user.id === userData.id)
    if (userIndex !== -1) {
      users.value[userIndex] = {
        ...users.value[userIndex],
        fullName: `${userData.firstname} ${userData.lastname}`.trim(),
        username: userData.username,
        email: userData.email,
        status: userData.isActive ? 'active' : 'inactive',
        role: roleIdToNameMap[roleId] || 'subscriber',
      }
    }

    await fetchUsers()
  }
  catch (error) {
    console.error(error)
  }
}

// 👉 Add new user
const addNewUser = async (userData: CreateUserPayload) => {
  try {
    const response = await userListStore.addUser(userData)
    const createdUserId = (response as { data?: { userId?: number; id?: number } })?.data?.userId
      || (response as { data?: { userId?: number; id?: number } })?.data?.id
      || Date.now()

    if (options.value.page === 1) {
      users.value = [
        {
          id: createdUserId,
          fullName: `${userData.firstname} ${userData.lastname}`.trim(),
          company: '-',
          role: roleIdToNameMap[userData.roleId] || 'subscriber',
          username: userData.username,
          country: '-',
          contact: '-',
          email: userData.email,
          currentPlan: '-',
          status: userData.isActive ? 'active' : 'inactive',
          avatar: '',
        },
        ...users.value,
      ].slice(0, options.value.itemsPerPage)
      totalUsers.value += 1
    }

    await fetchUsers()
  }
  catch (error) {
    console.error(error)
  }
}

// 👉 Delete user
const deleteUser = async (id: number) => {
  try {
    await userListStore.deleteUser(id)

    const previousLength = users.value.length
    users.value = users.value.filter(user => user.id !== id)
    if (users.value.length < previousLength)
      totalUsers.value = Math.max(0, totalUsers.value - 1)

    if (users.value.length === 0 && options.value.page > 1)
      options.value.page -= 1

    await fetchUsers()
  }
  catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <section>
    <VCard
      title="Search Filters"
      class="mb-6"
    >
      <VCardText>
        <VRow>
          <VCol
            cols="12"
            sm="4"
          >
            <VTextField
              v-model="searchQuery"
              label="Keyword"
              placeholder="Enter keyword to search..."
              clearable
              clear-icon="mdi-close"
              @keyup.enter="onSearch"
            />
          </VCol>
          <VCol 
            cols="12"
            sm="4"
          >
            <div class="d-flex gap-x-2">
              <VBtn
                height="56"
                @click="onSearch"
              >
                Search
              </VBtn>    
              <VBtn
                variant="outlined"
                color="secondary"
                height="56"
                @click="onClearSearch"
              >
                Clear
              </VBtn>          
            </div>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <VCard>
      <VCardText class="d-flex justify-end flex-wrap gap-4">

        <div class="d-flex gap-x-4 flex-wrap">
          <VBtn
            class="order-sm-2 order-1"
            @click="isAddNewUserDrawerVisible = true"
          >
            Add User
          </VBtn>
        </div>
      </VCardText>

      <VDataTableServer
        v-model:items-per-page="options.itemsPerPage"
        v-model:page="options.page"
        :items="users"
        :items-length="totalUsers"
        :headers="headers"
        class="text-no-wrap rounded-0"
        @update:options="options = $event"
      >
        <!-- User -->
        <template #item.user="{ item }">
          <div class="d-flex">
            <VAvatar
              size="34"
              :variant="!item.raw.avatar ? 'tonal' : undefined"
              :color="!item.raw.avatar ? resolveUserRoleVariant(item.raw.role).color : undefined"
              class="me-3"
            >
              <VImg
                v-if="item.raw.avatar"
                :src="item.raw.avatar"
              />
              <span
                v-else
                class="text-sm"
              >{{ avatarText(item.raw.fullName) }}</span>
            </VAvatar>

            <div class="d-flex flex-column">
              <h6 class="text-sm">
                <RouterLink
                  :to="{ name: '', params: { id: item.raw.id } }"
                  class="font-weight-medium user-list-name"
                >
                  {{ item.raw.fullName }}
                </RouterLink>
              </h6>

              <span class="text-xs text-medium-emphasis">@{{ item.raw.username }}</span>
            </div>
          </div>
        </template>

        <!-- Email -->
        <template #item.email="{ item }">
          <span class="text-sm">{{ item.raw.email }}</span>
        </template>

        <!-- Role -->
        <template #item.role="{ item }">
          <div class="d-flex gap-x-2">
            <VIcon
              :icon="resolveUserRoleVariant(item.raw.role).icon"
              :color="resolveUserRoleVariant(item.raw.role).color"
            />
            <span class="text-capitalize">{{ item.raw.role }}</span>
          </div>
        </template>

        <!-- Status -->
        <template #item.status="{ item }">
          <VChip
            :color="resolveUserStatusVariant(item.raw.status)"
            size="small"
            class="text-capitalize"
          >
            {{ item.raw.status }}
          </VChip>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <VBtn
            icon
            variant="text"
            size="small"
            color="medium-emphasis"
          >
            <VIcon
              size="24"
              icon="mdi-dots-vertical"
            />

            <VMenu activator="parent">
              <VList>
                <VListItem @click="openViewDialog(item.raw)">
                  <template #prepend>
                    <VIcon icon="mdi-eye-outline" />
                  </template>
                  <VListItemTitle>View</VListItemTitle>
                </VListItem>
                <VListItem @click="openEditDialog(item.raw)">
                  <template #prepend>
                    <VIcon icon="mdi-pencil-outline" />
                  </template>
                  <VListItemTitle>Edit</VListItemTitle>
                </VListItem>
                <VListItem @click="deleteUser(item.raw.id)">
                  <template #prepend>
                    <VIcon icon="mdi-delete-outline" />
                  </template>
                  <VListItemTitle>Delete</VListItemTitle>
                </VListItem>
              </VList>
            </VMenu>
          </VBtn>
        </template>

        <!-- Pagination -->
        <template #bottom>
          <VDivider />
          <div class="d-flex gap-x-6 flex-wrap justify-end pa-2">
            <div class="d-flex align-center gap-x-2 text-sm">
              Rows Per Page:
              <VSelect
                v-model="options.itemsPerPage"
                variant="plain"
                class="per-page-select text-high-emphasis"
                density="compact"
                :items="[10, 20, 25, 50, 100]"
              />
            </div>
            <div class="d-flex text-sm align-center text-high-emphasis">
              {{ paginationMeta(options, totalUsers) }}
            </div>
            <div class="d-flex gap-x-2 align-center">
              <VBtn
                class="flip-in-rtl"
                icon="mdi-chevron-left"
                variant="text"
                density="comfortable"
                color="default"
                :disabled="options.page <= 1"
                @click="options.page <= 1 ? options.page = 1 : options.page--"
              />

              <VBtn
                class="flip-in-rtl"
                icon="mdi-chevron-right"
                density="comfortable"
                variant="text"
                color="default"
                :disabled="options.page >= Math.ceil(totalUsers / options.itemsPerPage)"
                @click="options.page >= Math.ceil(totalUsers / options.itemsPerPage) ? options.page = Math.ceil(totalUsers / options.itemsPerPage) : options.page++ "
              />
            </div>
          </div>
        </template>
      </VDataTableServer>
      <!-- SECTION -->
    </VCard>

    <!-- 👉 Add New User -->
    <AddNewUserDrawer
      v-model:isDrawerOpen="isAddNewUserDrawerVisible"
      @user-data="addNewUser"
    />

    <VDialog
      v-model="isUserViewDialogVisible"
      :width="$vuetify.display.smAndDown ? 'auto' : 600"
    >
      <VCard class="pa-sm-6 pa-4">
        <DialogCloseBtn
          variant="text"
          size="small"
          @click="isUserViewDialogVisible = false"
        />

        <VCardItem class="text-center">
          <VCardTitle class="text-h5">
            User Details
          </VCardTitle>
        </VCardItem>

        <VCardText>
          <VList class="card-list">
            <VListItem>
              <VListItemTitle><span class="font-weight-medium">Name:</span> {{ selectedUser.fullName }}</VListItemTitle>
            </VListItem>
            <VListItem>
              <VListItemTitle><span class="font-weight-medium">Username:</span> @{{ selectedUser.username }}</VListItemTitle>
            </VListItem>
            <VListItem>
              <VListItemTitle><span class="font-weight-medium">Email:</span> {{ selectedUser.email }}</VListItemTitle>
            </VListItem>
            <VListItem>
              <VListItemTitle><span class="font-weight-medium">Role:</span> {{ selectedUser.role }}</VListItemTitle>
            </VListItem>
            <VListItem>
              <VListItemTitle><span class="font-weight-medium">Status:</span> {{ selectedUser.status }}</VListItemTitle>
            </VListItem>
          </VList>
        </VCardText>
      </VCard>
    </VDialog>

    <UserInfoEditDialog
      v-model:isDialogVisible="isUserInfoEditDialogVisible"
      :user-data="editUserData"
      @submit="updateUser"
    />
  </section>
</template>

<style lang="scss">
.card-list {
  --v-card-list-gap: 0.6rem;
}

.app-user-search-filter {
  inline-size: 24.0625rem;
}

.text-capitalize {
  text-transform: capitalize;
}

.user-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}
</style>
