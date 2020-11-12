import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { Chart, ChartArea, ChartAxis } from '@patternfly/react-charts';

import { AreaChart } from '@console/internal/components/graphs/area';
import { GraphEmpty } from '@console/internal/components/graphs/graph-empty';

import {
  PrometheusGraph,
  PrometheusGraphLink,
} from '@console/internal/components/graphs/prometheus-graph';

const MOCK_DATA = [[{ x: 1, y: 100 }]];

jest.mock('react-i18next', () => {
  const reactI18next = require.requireActual('react-i18next');
  return {
    ...reactI18next,
    useTranslation: () => ({ t: (key) => key }),
  };
});

describe('<AreaChart />', () => {
  it('should render an area chart', () => {
    const wrapper = shallow(<AreaChart title="Test Area" data={MOCK_DATA} />);
    const prometheusGraph = wrapper.find(PrometheusGraph);
    expect(prometheusGraph.exists()).toBe(true);
    expect(prometheusGraph.props().title).toBe('Test Area');
    expect(wrapper.find(PrometheusGraphLink).exists()).toBe(true);
    expect(wrapper.find(Chart).exists()).toBe(true);
    expect(wrapper.find(ChartAxis).exists()).toBe(true);
    expect(wrapper.find(ChartArea).exists()).toBe(true);
    expect(wrapper.find(GraphEmpty).exists()).toBe(false);
  });

  it('should not render any axes', () => {
    const wrapper = shallow(
      <AreaChart title="Test Area" data={MOCK_DATA} xAxis={false} yAxis={false} />,
    );
    expect(wrapper.find(ChartAxis).exists()).toBe(false);
  });

  it('should show an empty state', () => {
    const wrapper = shallow(<AreaChart data={[]} />);
    expect(wrapper.find(GraphEmpty).exists()).toBe(true);
  });

  it('should show a loading skeleton state', () => {
    const wrapper = mount(<AreaChart data={[]} loading={true} />); // Use full mount function so that we can check for a LoadingBox child
    expect(wrapper.find('.skeleton-chart').exists()).toBe(true);
  });
});
