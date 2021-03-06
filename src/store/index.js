import Vue from "vue";
import Vuex from "vuex";

import api from "@/api/hireclub-client";

import * as UserModule from "./user";

import { cloneDeep, debounce } from "lodash";

Vue.use(Vuex);

const state = {
  api,
  media: { photo: null },
  loaded: false,
  resume: {
    ...{
      firstName: "",
      lastName: "",
      subtitle: "",
      email: "",
      jobs: []
    }
  }
};

export const actions = {
  async startup({ dispatch, commit }) {
    commit("loaded", false);

    await dispatch("user/fetch");

    let resume = await api.getResume();

    commit("setResume", resume);
    commit("loaded", true);
  },

  updateResume({ commit }, resume) {
    commit("updateResume", resume);
  },

  editJob({ commit }, attrs) {
    commit("editJob", attrs);
  },

  addJob({ commit }) {
    commit("addJob", {
      title: "",
      company: "",
      startDate: "",
      endDate: "",
      highlights: []
    });
  },

  removeJob({ commit }, job) {
    commit("removeJob", job);
  },

  editHighlight({ commit }, { highlight, value }) {
    commit("editHighlight", { highlight, text: value });
  },

  addHighlight({ commit }, { job, ...highlight }) {
    commit("addHighlight", { job, highlight });
  },

  removeHighlight({ commit }, { job, highlight }) {
    commit("removeHighlight", { job, highlight });
  }
};

export const mutations = {
  loaded(state, status) {
    state.loaded = status;
  },

  setResume(state, attrs) {
    state.resume = { ...state.resume, ...attrs };
  },

  updateResume(state, attrs) {
    state.resume = { ...state.resume, ...attrs };
  },

  addJob(state, job) {
    state.resume.jobs.push(job);
  },
  // TODO: We need to find best way to pass such stuff. There is 2 options like this or like above
  editJob(state, { job, ...attrs }) {
    // state.resume.job = { ...job, ...attrs };
    // instead of assigment new value to job, we change only some attrs
    // we have everything predefined, this is not new attrs
    Object.assign(job, attrs);
  },

  removeJob(state, job) {
    state.resume.jobs.splice(state.resume.jobs.indexOf(job), 1);
  },

  editHighlight(state, { highlight, text = highlight.text }) {
    highlight.text = text;
  },

  addHighlight(state, { job, highlight }) {
    job.highlights.push(highlight);
  },

  removeHighlight(state, { job, highlight }) {
    job.highlights.splice(job.highlights.indexOf(highlight), 1);
  }
};

export const autoSaverPlugin = store => {
  let prevState = cloneDeep(store.state.resume);

  const updateOnApi = debounce(
    (resume, fail) => {
      api
        .updateResume(resume)
        .then(() => console.log("success in resume update"))
        .catch(errorMessage => {
          console.error(errorMessage);
          fail();
        });
    },
    1500,
    { leading: true, maxWait: 3000 }
  );

  store.subscribe((mutation, { resume }) => {
    if (mutation.type === "updateResume" || mutation.type === "editJob") {
      const prevResume = prevState;
      updateOnApi(resume, () => {
        console.error("Reverting resume to previous version");
        store.commit("setResume", prevResume);
      });
      prevState = cloneDeep(resume);
    }
  });
};

export const plugins = [autoSaverPlugin];

export default new Vuex.Store({
  modules: {
    user: UserModule
  },

  state,
  plugins,
  mutations,
  actions
});
