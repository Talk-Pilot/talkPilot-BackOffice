export const DEMO_FLOW_TEMPLATE = {
    flowName: 'demoData',
    interactions: [
      {
        id: '1',
        type: 'start',
        name: 'instructions',
        text: 'You are a helpful assistant.',
        position: { x: 250, y: 25 },
        successStatus: '',
        children: ['2'],
      },
    ],
  }