import { createStore } from 'vuex';

export default createStore({
    state: {
        user: null,
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
    },
    getters: {
        isSignIn: (state) => {
            return state.user !== null;
        },
    },
    actions: {},
    modules: {},
});
