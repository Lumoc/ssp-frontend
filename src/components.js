import Vue from 'vue';
// Global Components
import App from './components/App.vue';
import Home from './components/shared/Home.vue';
import Nav from './components/shared/Nav.vue';
import Notification from './components/shared/Notification.vue';
// OSE-Components
import EditQuota from './components/ose/EditQuota.vue';
import NewProject from './components/ose/NewProject.vue';
import NewTestProject from './components/ose/NewTestProject.vue';
import AdminList from './components/ose/AdminList.vue';
import ProjectInformation from './components/ose/ProjectInformation.vue';
import NewServiceAccount from './components/ose/NewServiceAccount.vue';
import NewPullSecret from './components/ose/NewPullSecret.vue';
// Gluster-Components
import FixGluster from './components/ose/FixGluster.vue';
import NewVolume from './components/ose/NewVolume.vue';
import GrowVolume from './components/ose/GrowVolume.vue';
// AWS Components
import ListS3Buckets from './components/aws/ListS3Buckets.vue';
import NewS3Bucket from './components/aws/NewS3Bucket.vue';
import NewS3User from './components/aws/NewS3User.vue';
import ListEC2Instances from './components/aws/ListEC2Instances.vue';
// OTC Components
import ListECS from './components/otc/ListECS.vue';
import NewECS from './components/otc/NewECS.vue';
// RDS Components
import ListRDS from './components/rds/ListRDS.vue';
import NewRDS from './components/rds/NewRDS.vue';
// Sematext Components
import SematextAppList from './components/sematext/AppList.vue';
import SematextNewApp from './components/sematext/NewApp.vue';
import SematextChangeBilling from './components/sematext/ChangeBilling.vue';
import SematextChangePlan from './components/sematext/ChangePlan.vue';
// WZU Components
import WZUConfluence from './components/wzu/Confluence.vue';
import WZUJira from './components/wzu/Jira.vue';
import WZUBitbucket from './components/wzu/BitbucketProjekt.vue';
import WZUBitbucketRepo from './components/wzu/BitbucketRepository.vue';
import WZUArtifactory from './components/wzu/Artifactory.vue';
import WZUJenkinsCredentials from './components/wzu/JenkinsCredentials.vue';
import TasksUser from './components/wzu/TasksUser.vue';
import WZUDevProxy from './components/wzu/DevProxy.vue';

// AD Components
import ADGroup from './components/ActiveDirectory/ADGroup.vue';
import ADGroupAdmin from './components/ActiveDirectory/Adminaddordelete.vue';
import ADGroupUser from './components/ActiveDirectory/UpdateUserGroup.vue';

import ListJobs from './components/tower/ListJobs.vue';
import SingleJob from './components/tower/SingleJob.vue';

// Kafka Components
import ListTopics from './components/kafka/ListTopics.vue'
import AdminConsole from './components/kafka/AdminConsole.vue'
import CostForecast from './components/kafka/CostForecast.vue'

Vue.component('navbar', Nav);
Vue.component('notification', Notification);

Vue.mixin({
    mounted: function () {
        this.$nextTick(() => {
            let field = this.$refs.autofocus;
            if (field) {
                field.focus();
            }
        });
    }
});

export const GlobalComponents = {
    App
};

export const LocalComponents = {
    Home,
    EditQuota,
    NewProject,
    AdminList,
    NewTestProject,
    ProjectInformation,
    NewServiceAccount,
    NewPullSecret,
    FixGluster,
    NewVolume,
    GrowVolume,
    ListS3Buckets,
    ListEC2Instances,
    NewS3Bucket,
    NewS3User,
    NewECS,
    ListECS,
    NewRDS,
    ListRDS,
    SematextAppList,
    SematextNewApp,
    SematextChangeBilling,
    SematextChangePlan,
    WZUConfluence,
    WZUJira,
    WZUBitbucket,
    WZUBitbucketRepo,
    WZUArtifactory,
    WZUJenkinsCredentials,
    TasksUser,
    WZUDevProxy,
    ADGroup,
    ADGroupAdmin,
    ADGroupUser,
    ListJobs,
    SingleJob,
    ListTopics,
    AdminConsole,
    CostForecast
};
