import {GlobalComponents, LocalComponents} from './components';
import VueRouter from 'vue-router';
import store from './store/index';
import * as Keycloak from 'keycloak-js';

const routes = [
    {
        path: '/', component: LocalComponents.Home
    },
    {
        path: '/ose/editquotas', component: LocalComponents.EditQuota
    },
    {
        path: '/ose/newtestproject', component: LocalComponents.NewTestProject
    },
    {
        path: '/ose/newproject', component: LocalComponents.NewProject
    },
    {
        path: '/ose/adminlist', component: LocalComponents.AdminList
    },
    {
        path: '/ose/newserviceaccount', component: LocalComponents.NewServiceAccount
    },
    {
        path: '/ose/newpullsecret', component: LocalComponents.NewPullSecret
    },
    {
        path: '/ose/project', component: LocalComponents.ProjectInformation
    },
    {
        path: '/ose/volume/new', component: LocalComponents.NewVolume
    },
    {
        path: '/ose/volume/fixgluster', component: LocalComponents.FixGluster
    },
    {
        path: '/ose/volume/grow', component: LocalComponents.GrowVolume
    },
    {
        path: '/aws/lists3buckets', component: LocalComponents.ListS3Buckets
    },
    {
        path: '/aws/news3bucket', component: LocalComponents.NewS3Bucket
    },
    {
        path: '/aws/news3user', component: LocalComponents.NewS3User
    },
    {
        path: '/aws/listec2instances', component: LocalComponents.ListEC2Instances
    },
    {
        path: '/otc/listecs', component: LocalComponents.ListECS
    },
    {
        path: '/otc/newecs', component: LocalComponents.NewECS
    },
    {
        path: '/rds/new', component: LocalComponents.NewRDS
    },
    {
        path: '/rds/list', component: LocalComponents.ListRDS
    },
    {
        path: '/sematext/newapp', component: LocalComponents.SematextNewApp
    },
    {
        path: '/sematext/applist', component: LocalComponents.SematextAppList
    },
    {
        path: '/sematext/changebilling', component: LocalComponents.SematextChangeBilling
    },
    {
        path: '/sematext/changeplan', component: LocalComponents.SematextChangePlan
    },
    {
        path: '/wzu/artifactory', component: LocalComponents.WZUArtifactory
    },
    {
        path: '/wzu/jira', component: LocalComponents.WZUJira
    },
    {
        path: '/wzu/bitbucket', component: LocalComponents.WZUBitbucket
    },
    {
        path: '/wzu/bitbucketrepo', component: LocalComponents.WZUBitbucketRepo
    },
    {
        path: '/wzu/confluence', component: LocalComponents.WZUConfluence
    },
    {
        path: '/wzu/jenkinscredentials', component: LocalComponents.WZUJenkinsCredentials
    },
    {
        path: '/wzu/tasksuser', component: LocalComponents.TasksUser
    },
    {
        path: '/wzu/devproxy', component: LocalComponents.WZUDevProxy
    },
    {
        path: '/ActiveDirectory/ADGroup', component: LocalComponents.ADGroup
    },
    {
        path: '/ActiveDirectory/Adminaddordelete', component: LocalComponents.ADGroupAdmin
    },
    {
        path: '/ActiveDirectory/UpdateUserGroup', component: LocalComponents.ADGroupUser
    },
    {
        path: '/tower/jobs', component: LocalComponents.ListJobs
    },
    {
        path: '/tower/jobs/:jobID', component: LocalComponents.SingleJob, props: true
    },
    {
        path: '/kafka/listtopics', component: LocalComponents.ListTopics
    },
    {
        path: '/kafka/adminconsole', component: LocalComponents.AdminConsole
    },
    {
        path: '/kafka/costforecast', component: LocalComponents.CostForecast
    }
];

// mode history is needed with keycloak js, see https://github.com/dsb-norge/vue-keycloak-js/issues/1
const router = new VueRouter({routes, mode: 'history'});

router.beforeEach((to, from, next) => {
    // Cleanup old notifications
    store.commit('setNotification', {notification: {}});
    store.commit('setUser', {
        user: {
            name: router.app.$keycloak.tokenParsed.sbbuid_ad,
            firstName: router.app.$keycloak.tokenParsed.given_name,
            tokenParsed: router.app.$keycloak.tokenParsed
        }
    });
    next();
});

export default router;
