import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';

type LineageType = 'Node' | 'Field';

type YamlLine = {
  keyName: string;
  value: string;
  indent?: boolean;
  isField?: boolean;
};

type CorumFileModel = {
  fileName: string;
  yamlLines: YamlLine[];
  lineage: Array<{ type: LineageType; text: string }>;
};

const corumModels: CorumFileModel[] = [
  {
    fileName: 'api-endpoint.yml',
    yamlLines: [
      { keyName: 'kind', value: 'ApiEndpoint' },
      { keyName: 'name', value: 'POST /orders' },
      { keyName: 'properties', value: '' },
      { keyName: 'operationRef', value: 'op.create-order', indent: true },
      { keyName: 'auth', value: 'oauth2', indent: true },
      { keyName: 'schema', value: '' },
      { keyName: 'customerId', value: 'uuid', indent: true, isField: true },
      { keyName: 'currency', value: 'iso4217', indent: true, isField: true },
      { keyName: 'correlationId', value: 'trace-id', indent: true, isField: true },
    ],
    lineage: [
      { type: 'Node', text: 'API Endpoint -> Domain Operation' },
      { type: 'Node', text: 'API Endpoint -> Read Model' },
      { type: 'Field', text: 'customerId -> order.customer.id' },
      { type: 'Field', text: 'correlationId -> traceId' },
    ],
  },
  {
    fileName: 'domain-model.yml',
    yamlLines: [
      { keyName: 'kind', value: 'DomainModel' },
      { keyName: 'name', value: 'Order' },
      { keyName: 'properties', value: '' },
      { keyName: 'aggregateId', value: 'order.id', indent: true },
      { keyName: 'versioned', value: 'true', indent: true },
      { keyName: 'schema', value: '' },
      { keyName: 'customer.id', value: 'uuid', indent: true, isField: true },
      { keyName: 'total.amount', value: 'money', indent: true, isField: true },
      { keyName: 'status', value: 'enum<OrderState>', indent: true, isField: true },
    ],
    lineage: [
      { type: 'Node', text: 'Domain Model -> Domain Operation' },
      { type: 'Node', text: 'Domain Model -> Domain Event' },
      { type: 'Field', text: 'customer.id -> customerId' },
      { type: 'Field', text: 'total.amount -> orderTotal' },
    ],
  },
  {
    fileName: 'domain-operation.yml',
    yamlLines: [
      { keyName: 'kind', value: 'DomainOperation' },
      { keyName: 'name', value: 'CreateOrder' },
      { keyName: 'properties', value: '' },
      { keyName: 'operationId', value: 'op.create-order', indent: true },
      { keyName: 'input', value: 'CustomerOrderRequest', indent: true },
      { keyName: 'output', value: 'OrderCreatedEvent', indent: true },
      { keyName: 'schema', value: '' },
      { keyName: 'customerId', value: 'uuid', indent: true, isField: true },
      { keyName: 'orderTotal', value: 'money', indent: true, isField: true },
      { keyName: 'correlationId', value: 'trace-id', indent: true, isField: true },
    ],
    lineage: [
      { type: 'Node', text: 'Domain Operation -> Domain Event' },
      { type: 'Node', text: 'Domain Operation -> Integration Event' },
      { type: 'Field', text: 'customerId -> customer.id' },
      { type: 'Field', text: 'correlationId -> traceId' },
    ],
  },
  {
    fileName: 'domain-event.yml',
    yamlLines: [
      { keyName: 'kind', value: 'DomainEvent' },
      { keyName: 'name', value: 'OrderCreated' },
      { keyName: 'properties', value: '' },
      { keyName: 'source', value: 'order.aggregate', indent: true },
      { keyName: 'emits', value: 'integration.order-created', indent: true },
      { keyName: 'schema', value: '' },
      { keyName: 'eventId', value: 'uuid', indent: true, isField: true },
      { keyName: 'customerId', value: 'uuid', indent: true, isField: true },
      { keyName: 'traceId', value: 'trace-id', indent: true, isField: true },
    ],
    lineage: [
      { type: 'Node', text: 'Domain Event -> Integration Event' },
      { type: 'Node', text: 'Domain Event -> Read Model' },
      { type: 'Field', text: 'customerId -> projection.customerId' },
      { type: 'Field', text: 'traceId -> correlationId' },
    ],
  },
  {
    fileName: 'integration-event.yml',
    yamlLines: [
      { keyName: 'kind', value: 'IntegrationEvent' },
      { keyName: 'name', value: 'order.created.v1' },
      { keyName: 'properties', value: '' },
      { keyName: 'channel', value: 'orders.created', indent: true },
      { keyName: 'sourceEvent', value: 'OrderCreated', indent: true },
      { keyName: 'schema', value: '' },
      { keyName: 'eventId', value: 'uuid', indent: true, isField: true },
      { keyName: 'tenantId', value: 'uuid', indent: true, isField: true },
      { keyName: 'traceId', value: 'trace-id', indent: true, isField: true },
    ],
    lineage: [
      { type: 'Node', text: 'Integration Event -> Read Model' },
      { type: 'Node', text: 'Integration Event -> API Endpoint' },
      { type: 'Field', text: 'tenantId -> readModel.tenantId' },
      { type: 'Field', text: 'traceId -> traceId' },
    ],
  },
  {
    fileName: 'read-model.yml',
    yamlLines: [
      { keyName: 'kind', value: 'ReadModel' },
      { keyName: 'name', value: 'CustomerOrderSummary' },
      { keyName: 'properties', value: '' },
      { keyName: 'projection', value: 'orders-summary', indent: true },
      { keyName: 'refreshMode', value: 'event-driven', indent: true },
      { keyName: 'schema', value: '' },
      { keyName: 'customerId', value: 'uuid', indent: true, isField: true },
      { keyName: 'openOrders', value: 'int', indent: true, isField: true },
      { keyName: 'totalSpend', value: 'money', indent: true, isField: true },
    ],
    lineage: [
      { type: 'Node', text: 'Read Model <- Integration Event' },
      { type: 'Node', text: 'Read Model <- Domain Event' },
      { type: 'Field', text: 'customerId <- customer.id' },
      { type: 'Field', text: 'totalSpend <- orderTotal' },
    ],
  },
];

type CorumModelWindowProps = {
  reveal: number;
  parallax: number;
};

export function CorumModelWindow({ reveal, parallax }: CorumModelWindowProps) {
  const [activeIndex, setActiveIndex] = useState(2);
  const activeModel = corumModels[activeIndex];

  const dynamicStyle = useMemo(
    () =>
      ({
        '--reveal': reveal.toFixed(3),
        '--parallax': `${parallax.toFixed(1)}px`,
      }) as CSSProperties,
    [parallax, reveal],
  );

  return (
    <div className="corum-window" style={dynamicStyle} aria-label="Model connection viewer">
      <header className="corum-window-header">
        <span />
        <span />
        <span />
        <p>corum-models</p>
      </header>

      <div className="corum-window-body">
        <aside className="model-file-list" aria-label="Model files">
          {corumModels.map((model, index) => (
            <button
              key={model.fileName}
              type="button"
              className={`model-file-item ${index === activeIndex ? 'is-active' : ''}`}
              onClick={() => setActiveIndex(index)}
            >
              {model.fileName}
            </button>
          ))}
        </aside>

        <div className="yaml-viewer">
          <p className="yaml-title">{activeModel.fileName}</p>
          <pre className="yaml-code">
            {activeModel.yamlLines.map((line) => (
              <span
                key={`${activeModel.fileName}-${line.keyName}`}
                className={[
                  line.indent ? 'yaml-indent' : '',
                  line.isField ? 'yaml-field' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <b>{line.keyName}:</b> {line.value}
              </span>
            ))}
          </pre>
        </div>

        <aside className="connection-map" aria-label="Node and field lineage">
          <p>Lineage</p>
          <ul>
            {activeModel.lineage.map((entry) => (
              <li key={`${activeModel.fileName}-${entry.type}-${entry.text}`} className={entry.type === 'Field' ? 'lineage-field' : ''}>
                <span>{entry.type}</span> {entry.text}
              </li>
            ))}
          </ul>
        </aside>
      </div>

    </div>
  );
}
