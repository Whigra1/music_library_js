import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('counter', () => {
  const userInfo = ref({
    id: null,
    userName: null,
    firstName: null,
    lastName: null,
    secondName: null,
    dateOfBirth: null,
    phoneNumber: null,
    email: null,
  })
  function setInfo({ id, firstName, lastName, secondName, userName, dateOfBirth, phoneNumber, email }) {
    userInfo.value = { id, firstName, lastName, secondName, userName, dateOfBirth, phoneNumber, email }
  }

  return { userInfo, setInfo }
})
