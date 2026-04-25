
### Interactions

#### 1. Select node type

* Filters graph

#### 2. Tap node

* Opens YAML panel

Example YAML:

```yaml
aggregate:
  name: Order
  fields:
    - id
    - status

event:
  name: OrderCreated
  updates:
    - Order.status
```

#### 3. Tap field (CRITICAL “AHA” MOMENT)

* Highlight all relationships across graph
* Show dependencies end-to-end

#### 4. Simulate change (button)

* Modify a field
* Show ripple effect across system

#### 5. Branch toggle

* Show alternate version overlay