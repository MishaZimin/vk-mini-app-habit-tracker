import bridge from '@vkontakte/vk-bridge';

export const vkStorage = {
  async getItem(key: string) {
    try {
      const response = await bridge.send('VKWebAppStorageGet', { keys: [key] });
      return response.keys[0]?.value || null;
    } catch (error) {
      console.error('VKWebAppStorageGet error:', error);
      return null;
    }
  },

  async setItem(key: string, value: string) {
    try {
      await bridge.send('VKWebAppStorageSet', { key, value });
    } catch (error) {
      console.error('VKWebAppStorageSet error:', error);
    }
  },

  // async removeItem(key: string) {
  //   try {
  //     await bridge.send('VKWebAppStorageDelete', { keys: [key] });
  //   } catch (error) {
  //     console.error('VKWebAppStorageDelete error:', error);
  //   }
  // },
};
