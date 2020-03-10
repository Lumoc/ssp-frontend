import Vue from 'vue';
import VueRouter from 'vue-router';
import Buefy from 'buefy';
import VueResource from 'vue-resource';
import VeeValidate, { Validator } from 'vee-validate';
import Moment from 'moment';
import 'moment-timezone';
import VueLodash from 'vue-lodash'
import lodash from 'lodash'

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
Vue.use(VueLodash, { lodash: lodash })

Moment.locale('en')
Moment.tz.setDefault("Europe/Zurich")
Vue.prototype.moment = Moment

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
        } else if (res.status === 401) {
            this.$store.commit('setNotification', {
                notification: {
                    type: 'danger',
                    message: "Der Token ist abgelaufen. Bitte laden Sie die Seite neu."
                }
            });
        } else if (!res.ok) {
            this.$store.commit('setNotification', {
                notification: {
                    type: 'danger',
                    message: "Communication with the backend failed, please create a ticket"
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


// https://pageclip.co/blog/2018-02-20-you-should-use-html5-form-validation.html
const customMessages = {
  valueMissing:    'Please fill out this field.',       // `required` attr
  //emailMismatch:   'Custom email mismatch',  // Invalid email
  //patternMismatch: 'Custom pattern mismatch',// `pattern` attr
}

const errorProps = [
  'badInput',
  'patternMismatch',
  'rangeOverflow',
  'rangeUnderflow',
  'stepMismatch',
  'tooLong',
  'tooShort',
  'typeMismatch',
  'valueMissing',
  'customError'
]

function getCustomMessage (input) {
  const localErrorProps = [`${input.type}Mismatch`].concat(errorProps)
  const validity = input.validity

  for (let i = 0; i < localErrorProps.length; i++) {
    const prop = localErrorProps[i]
    if (validity[prop]) {
      return input.getAttribute(`data-${prop.toLowerCase()}`) || customMessages[prop]
    }
  }
}

router.afterEach((to, from) => {
    Vue.nextTick(function () {
        var inputs = document.querySelectorAll('input, select, textarea')
        inputs.forEach(function (input) {
            // Each time the user types or submits, this will
            // check validity, and set a custom message if invalid.
            function checkValidity () {
              const message = input.validity.valid
                ? null
                : getCustomMessage(input)
              input.setCustomValidity(message || '')
            }
            input.addEventListener('input', checkValidity)
            input.addEventListener('invalid', checkValidity)
        })
    })
})

new Vue({
    router,
    store,
    components: LocalComponents,
    el: '#app',
    render: h => h(GlobalComponents.App)
});

