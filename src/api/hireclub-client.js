const REMOTE_STORAGE_KEY = "remote-key-resume-editor-vuejs-example";

export default {
  async getCurrentUserDetails() {
    return new Promise(resolve => setTimeout(resolve, 10)).then(
      () => "Paul Keen User"
    );
  },

  async getResume() {
    return new Promise(resolve => setTimeout(resolve, 10)).then(() =>
      JSON.parse(window.localStorage.getItem(REMOTE_STORAGE_KEY) || "{}")
    );
  },

  async updateResume(resume) {
    return new Promise(resolve => setTimeout(resolve, 100)).then(() => {
      window.localStorage.setItem(REMOTE_STORAGE_KEY, JSON.stringify(resume));
      // simulate API response parsing
      return window.localStorage.getItem(REMOTE_STORAGE_KEY);

      // // Simulate errors
      //
      // // TODO: Need to make it optional
      // const success = Math.random() > 0.001;
      //
      // if (success) {
      // } else {
      //   fail("Server returned error");
      // }
    });
  }
};
