import AsyncStorage from '@react-native-community/async-storage'
import Storage from '../core/storage.js'
import { attachStatic } from '../utils.js'

attachStatic(Storage, {
  async getItem(key) {
    return await AsyncStorage.getItem(key)
  },
  async setItem(key, value) {
    await AsyncStorage.setItem(key, value)
  },
  async removeItem(key) {
    await AsyncStorage.removeItem(key)
  },
  async clear() {
    await AsyncStorage.clear()
  },
})
