import Vue from 'vue';
import VueRouter from 'vue-router';
import Buefy from 'buefy';
import VueResource from 'vue-resource';
import VeeValidate, { Validator } from 'vee-validate';
import VeeValidateGerman from 'vee-validate/dist/locale/de';
import Moment from 'moment';
import 'moment-timezone';

// Styles
import 'buefy/dist/buefy.css';
import './theme.css';
// Store
import store from './store';
// Components
import {GlobalComponents, LocalComponents} from './components';
// Router
import router from './router';

// Mixins
Vue.use(VueRouter);
Vue.use(Buefy);
Vue.use(VueResource);

Moment.locale('de')
Moment.tz.setDefault("Europe/Zurich")
Vue.prototype.moment = Moment

Validator.localize('de', VeeValidateGerman);
Vue.use(VeeValidate);

// Support endsWith on old browsers
// Polyfill from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function(search, this_len) {
        if (this_len === undefined || this_len > this.length) {
            this_len = this.length;
        }
        return this.substring(this_len - search.length, this_len) === search;
    };
}

// Support startsWith on old browsers
// Polyfill from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
if (!String.prototype.startsWith) {
    Object.defineProperty(String.prototype, 'startsWith', {
        value: function(search, rawPos) {
            var pos = rawPos > 0 ? rawPos|0 : 0;
            return this.substring(pos, pos + search.length) === search;
        }
    });
}

// Redirect old hash based urls to new history routes
var urlSplit = document.URL.split("#");
if (urlSplit[1] && urlSplit[1].startsWith("/")) {
    history.replaceState(null, null, urlSplit[1])
}

// Http interceptors: Global response handler
Vue.http.interceptors.push(function (request, next) {
    next(function (res) {
        if (res.body.message) {
            this.$store.commit('setNotification', {
                notification: {
                    type: res.status === 200 ? 'success' : 'danger',
                    message: res.body.message
                }
            });
        } else if (!res.ok) {
            this.$store.commit('setNotification', {
                notification: {
                    type: 'danger',
                    message: "Communication with the Backend failed, please open up a ticket"
                }
            });
        }
    });
});

// Http interceptors: Add Auth-Header if token present
Vue.http.interceptors.push(function (request, next) {
    if (store.state.user) {
        request.headers.set('Authorization', `Bearer ${store.state.user.token}`);
    }
    next();
});

new Vue({
    router,
    store,
    components: LocalComponents,
    el: '#app',
    render: h => h(GlobalComponents.App)
});

