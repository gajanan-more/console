import * as React from 'react';
import * as _ from 'lodash';
import {
  Plugin,
  ModelDefinition,
  ModelFeatureFlag,
  HrefNavItem,
  ResourceNSNavItem,
  ResourceClusterNavItem,
  ResourceListPage,
  ResourceDetailsPage,
  Perspective,
  YAMLTemplate,
  RoutePage,
  DashboardsOverviewHealthPrometheusSubsystem,
  DashboardsOverviewHealthURLSubsystem,
  DashboardsCard,
  DashboardsTab,
  DashboardsOverviewInventoryItem,
  DashboardsInventoryItemGroup,
  DashboardsOverviewQuery,
  DashboardsOverviewUtilizationItem,
  DashboardsOverviewTopConsumerItem,
  DashboardsOverviewResourceActivity,
  DashboardsOverviewPrometheusActivity,
} from '@console/plugin-sdk';
// TODO(vojtech): internal code needed by plugins should be moved to console-shared package
import { PodModel, RouteModel, NodeModel } from '@console/internal/models';
import { FLAGS } from '@console/internal/const';
import { GridPosition } from '@console/internal/components/dashboard/grid';
import { humanizeBinaryBytesWithoutB } from '@console/internal/components/utils/units';
import { OverviewQuery } from '@console/internal/components/dashboards-page/overview-dashboard/queries';
import { MetricType } from '@console/internal/components/dashboard/top-consumers-card/metric-type';
import { FooBarModel } from './models';
import { yamlTemplates } from './yaml-templates';
import TestIcon from './components/test-icon';
import { getFooHealthState, getBarHealthState } from './dashboards/health';
import { getRouteStatusGroups, DemoGroupIcon } from './dashboards/inventory';

type ConsumedExtensions =
  | ModelDefinition
  | ModelFeatureFlag
  | HrefNavItem
  | ResourceNSNavItem
  | ResourceClusterNavItem
  | ResourceListPage
  | ResourceDetailsPage
  | Perspective
  | YAMLTemplate
  | RoutePage
  | DashboardsOverviewHealthPrometheusSubsystem
  | DashboardsOverviewHealthURLSubsystem
  | DashboardsTab
  | DashboardsCard
  | DashboardsOverviewInventoryItem
  | DashboardsInventoryItemGroup
  | DashboardsOverviewQuery
  | DashboardsOverviewUtilizationItem
  | DashboardsOverviewTopConsumerItem
  | DashboardsOverviewResourceActivity
  | DashboardsOverviewPrometheusActivity;

const plugin: Plugin<ConsumedExtensions> = [
  {
    type: 'ModelDefinition',
    properties: {
      models: [FooBarModel],
    },
  },
  {
    type: 'FeatureFlag/Model',
    properties: {
      model: PodModel,
      flag: 'TEST_MODEL_FLAG',
    },
  },
  {
    type: 'NavItem/Href',
    properties: {
      section: 'Home',
      componentProps: {
        name: 'Test Href Link',
        href: '/test',
        required: 'TEST_MODEL_FLAG',
      },
    },
  },
  {
    type: 'NavItem/ResourceNS',
    properties: {
      section: 'Home',
      componentProps: {
        name: 'Test ResourceNS Link',
        resource: 'pods',
        required: 'TEST_MODEL_FLAG',
      },
    },
  },
  {
    type: 'NavItem/ResourceCluster',
    properties: {
      section: 'Home',
      componentProps: {
        name: 'Test ResourceCluster Link',
        resource: 'projects',
        required: [FLAGS.OPENSHIFT, 'TEST_MODEL_FLAG'],
      },
    },
  },
  {
    type: 'Page/Resource/List',
    properties: {
      model: FooBarModel,
      loader: () =>
        import('./components/test-pages' /* webpackChunkName: "demo" */).then(
          (m) => m.DummyResourceListPage,
        ),
    },
  },
  {
    type: 'Page/Resource/Details',
    properties: {
      model: FooBarModel,
      loader: () =>
        import('./components/test-pages' /* webpackChunkName: "demo" */).then(
          (m) => m.DummyResourceDetailsPage,
        ),
    },
  },
  {
    type: 'Perspective',
    properties: {
      id: 'test',
      name: 'Test Perspective',
      icon: TestIcon,
      getLandingPageURL: () => '/test',
      getK8sLandingPageURL: () => '/test',
      getImportRedirectURL: (project) => `/k8s/cluster/projects/${project}/workloads`,
    },
  },
  {
    type: 'YAMLTemplate',
    properties: {
      model: FooBarModel,
      template: yamlTemplates.getIn([FooBarModel, 'default']),
    },
  },
  {
    type: 'Dashboards/Overview/Health/URL',
    properties: {
      title: 'Foo system',
      url: 'fooUrl',
      healthHandler: getFooHealthState,
      required: 'TEST_MODEL_FLAG',
    },
  },
  {
    type: 'Dashboards/Overview/Health/Prometheus',
    properties: {
      title: 'Bar system',
      queries: ['barQuery'],
      healthHandler: getBarHealthState,
      additionalResource: {
        kind: NodeModel.kind,
        isList: true,
        namespaced: false,
        prop: 'nodes',
      },
      required: 'TEST_MODEL_FLAG',
    },
  },
  {
    type: 'NavItem/Href',
    properties: {
      perspective: 'test',
      componentProps: {
        name: 'Test Home',
        href: '/test',
      },
    },
  },
  {
    type: 'NavItem/ResourceCluster',
    properties: {
      perspective: 'test',
      section: 'Advanced',
      componentProps: {
        name: 'Test Projects',
        resource: 'projects',
      },
    },
  },
  {
    type: 'Page/Route',
    properties: {
      exact: true,
      path: '/test',
      render: () => <h1>Test Page</h1>,
    },
  },
  {
    type: 'Dashboards/Tab',
    properties: {
      id: 'foo-tab',
      title: 'Foo',
      required: 'TEST_MODEL_FLAG',
    },
  },
  {
    type: 'Dashboards/Card',
    properties: {
      tab: 'foo-tab',
      position: GridPosition.MAIN,
      loader: () =>
        import('./dashboards/foo-card' /* webpackChunkName: "demo" */).then((m) => m.FooCard),
      required: 'TEST_MODEL_FLAG',
    },
  },
  {
    type: 'Dashboards/Overview/Query',
    properties: {
      queryKey: OverviewQuery.STORAGE_TOTAL,
      query: 'fooQuery',
      required: 'TEST_MODEL_FLAG',
    },
  },
  {
    type: 'Dashboards/Overview/Query',
    properties: {
      queryKey: OverviewQuery.STORAGE_UTILIZATION,
      query: 'barQuery',
      required: 'TEST_MODEL_FLAG',
    },
  },
  {
    type: 'Dashboards/Overview/Inventory/Item',
    properties: {
      resource: {
        isList: true,
        kind: RouteModel.kind,
        prop: 'routes',
      },
      model: RouteModel,
      mapper: getRouteStatusGroups,
      expandedComponent: () =>
        import('./dashboards/inventory' /* webpackChunkName: "demo-inventory-item" */).then(
          (m) => m.ExpandedRoutes,
        ),
      required: 'TEST_MODEL_FLAG',
    },
  },
  {
    type: 'Dashboards/Inventory/Item/Group',
    properties: {
      id: 'demo-inventory-group',
      icon: <DemoGroupIcon />,
      required: 'TEST_MODEL_FLAG',
    },
  },
  {
    type: 'Dashboards/Overview/Utilization/Item',
    properties: {
      title: 'Foo',
      query: 'barQuery',
      humanizeValue: humanizeBinaryBytesWithoutB,
      required: 'TEST_MODEL_FLAG',
    },
  },
  {
    type: 'Dashboards/Overview/TopConsumers/Item',
    properties: {
      model: PodModel,
      name: 'Prometheus',
      metric: 'pod_name',
      queries: {
        [MetricType.CPU]:
          'sort(topk(5, pod_name:container_cpu_usage:sum{pod_name=~"prometheus-.*"}))',
      },
      mutator: (data) =>
        data.map((datum) => ({ ...datum, x: (datum.x as string).replace('prometheus-', '') })),
      required: 'TEST_MODEL_FLAG',
    },
  },
  {
    type: 'Dashboards/Overview/Activity/Resource',
    properties: {
      k8sResource: {
        isList: true,
        kind: NodeModel.kind,
        prop: 'nodes',
      },
      isActivity: (resource) =>
        _.get(resource, ['metadata', 'labels', 'node-role.kubernetes.io/master']) === '',
      getTimestamp: (resource) => new Date(resource.metadata.creationTimestamp),
      loader: () =>
        import('./dashboards/activity' /* webpackChunkName: "demo" */).then((m) => m.DemoActivity),
      required: 'TEST_MODEL_FLAG',
    },
  },
  {
    type: 'Dashboards/Overview/Activity/Prometheus',
    properties: {
      queries: ['barQuery'],
      isActivity: () => true,
      loader: () =>
        import('./dashboards/activity' /* webpackChunkName: "demo" */).then(
          (m) => m.DemoPrometheusActivity,
        ),
      required: 'TEST_MODEL_FLAG',
    },
  },
];

export default plugin;
