'use client';

import { useState } from 'react';

interface Scenario {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  recommendation: 'oop' | 'functional' | 'procedural' | 'hybrid';
  reason: string;
  codeExample: {
    oop?: string;
    alternative?: string;
    alternativeLabel?: string;
  };
}

const scenarios: Scenario[] = [
  {
    id: 'game-entities',
    title: 'Game with Multiple Entity Types',
    description: 'Building a game with players, enemies, NPCs, each with shared behaviors (move, attack) but unique implementations.',
    requirements: [
      'State encapsulation per entity',
      'Polymorphic behavior',
      'Inheritance/composition needed',
      'Complex entity relationships'
    ],
    recommendation: 'oop',
    reason: 'OOP excels here due to polymorphism, encapsulation, and the natural modeling of entities as objects with state and behavior. Inheritance or composition patterns provide code reuse.',
    codeExample: {
      oop: `class Entity {
  constructor(name, health) {
    this.name = name;
    this.health = health;
  }

  attack(target) {
    console.log(\`\${this.name} attacks \${target.name}\`);
  }
}

class Player extends Entity {
  constructor(name, health, level) {
    super(name, health);
    this.level = level;
  }

  attack(target) {
    const damage = this.level * 10;
    target.health -= damage;
    super.attack(target);
  }
}

class Enemy extends Entity {
  attack(target) {
    const damage = 5;
    target.health -= damage;
    super.attack(target);
  }
}

const player = new Player("Hero", 100, 5);
const enemy = new Enemy("Goblin", 50);
player.attack(enemy); // Polymorphic behavior`,
      alternative: `// Functional approach - more verbose for this use case
const createEntity = (name, health) => ({
  name,
  health
});

const attack = (attacker, target, damage) => ({
  ...target,
  health: target.health - damage
});

const playerAttack = (player, target) => {
  const damage = player.level * 10;
  return attack(player, target, damage);
};

const player = { ...createEntity("Hero", 100), level: 5 };
const enemy = createEntity("Goblin", 50);
const updatedEnemy = playerAttack(player, enemy);`,
      alternativeLabel: 'Functional'
    }
  },
  {
    id: 'data-transformation',
    title: 'Data Processing Pipeline',
    description: 'Processing a list of user records - filtering, mapping, aggregating results.',
    requirements: [
      'Stateless transformations',
      'Chainable operations',
      'No complex entity relationships',
      'Pure functions preferred'
    ],
    recommendation: 'functional',
    reason: 'Functional programming is superior for data transformations: immutability prevents bugs, composition is natural, and operations are easily testable and parallelizable.',
    codeExample: {
      oop: `class UserProcessor {
  constructor(users) {
    this.users = users;
  }

  filterActive() {
    this.users = this.users.filter(u => u.active);
    return this;
  }

  mapToNames() {
    this.users = this.users.map(u => u.name);
    return this;
  }

  getResult() {
    return this.users;
  }
}

const processor = new UserProcessor(users);
const result = processor.filterActive().mapToNames().getResult();`,
      alternative: `// Functional approach - cleaner and more composable
const activeUsers = users => users.filter(u => u.active);
const toNames = users => users.map(u => u.name);
const getActiveNames = users => toNames(activeUsers(users));

const result = getActiveNames(users);

// Or with composition:
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);
const process = pipe(activeUsers, toNames);
const result = process(users);`,
      alternativeLabel: 'Functional (Better)'
    }
  },
  {
    id: 'ui-components',
    title: 'Reusable UI Components',
    description: 'Building a component library with buttons, inputs, modals that share styling and behavior.',
    requirements: [
      'Component composition',
      'State management',
      'Prop inheritance',
      'Lifecycle management'
    ],
    recommendation: 'hybrid',
    reason: 'Modern frameworks use hybrid approaches: functional components for rendering with hooks for state (React), or class-based with reactivity (Vue). OOP principles apply to architecture, but implementation is often functional.',
    codeExample: {
      oop: `// React Class Component (older OOP style)
class Button extends React.Component {
  constructor(props) {
    super(props);
    this.state = { clicked: false };
  }

  handleClick = () => {
    this.setState({ clicked: true });
    this.props.onClick?.();
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.props.children}
      </button>
    );
  }
}`,
      alternative: `// Modern Functional Component (hybrid approach)
import { useState } from 'react';

function Button({ children, onClick }) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    onClick?.();
  };

  return (
    <button onClick={handleClick}>
      {children}
    </button>
  );
}`,
      alternativeLabel: 'Functional/Hybrid (Modern)'
    }
  },
  {
    id: 'payment-system',
    title: 'Payment Processing System',
    description: 'System handling multiple payment methods (credit card, PayPal, crypto) with validation, processing, and refunds.',
    requirements: [
      'Multiple implementations of same interface',
      'Strategy pattern needed',
      'Complex business rules',
      'State management per transaction'
    ],
    recommendation: 'oop',
    reason: 'OOP shines with the Strategy pattern. Each payment method implements a common interface, allowing runtime selection. Encapsulation keeps payment logic isolated and secure.',
    codeExample: {
      oop: `interface PaymentMethod {
  process(amount: number): Promise<boolean>;
  refund(transactionId: string): Promise<boolean>;
}

class CreditCardPayment implements PaymentMethod {
  async process(amount: number) {
    // Validate card, charge amount
    return true;
  }

  async refund(transactionId: string) {
    // Process refund
    return true;
  }
}

class PayPalPayment implements PaymentMethod {
  async process(amount: number) {
    // PayPal API call
    return true;
  }

  async refund(transactionId: string) {
    return true;
  }
}

class PaymentProcessor {
  constructor(private method: PaymentMethod) {}

  async checkout(amount: number) {
    return await this.method.process(amount);
  }
}`,
      alternative: `// Functional approach - less type-safe
const creditCardPayment = {
  process: async (amount) => { /* ... */ return true; },
  refund: async (txId) => { /* ... */ return true; }
};

const paypalPayment = {
  process: async (amount) => { /* ... */ return true; },
  refund: async (txId) => { /* ... */ return true; }
};

const checkout = (method, amount) => method.process(amount);

// Works but loses compile-time safety and documentation`,
      alternativeLabel: 'Functional'
    }
  },
  {
    id: 'math-utilities',
    title: 'Math Utility Functions',
    description: 'Collection of mathematical operations: factorial, fibonacci, prime checking, etc.',
    requirements: [
      'Pure functions',
      'No state needed',
      'Independent operations',
      'Simple input/output'
    ],
    recommendation: 'functional',
    reason: 'Pure utility functions don\'t need classes. Functional approach is simpler, more testable, and easier to understand. No state to manage or objects to instantiate.',
    codeExample: {
      oop: `// Unnecessary OOP wrapper
class MathUtils {
  static factorial(n) {
    return n <= 1 ? 1 : n * this.factorial(n - 1);
  }

  static isPrime(n) {
    if (n <= 1) return false;
    for (let i = 2; i < n; i++) {
      if (n % i === 0) return false;
    }
    return true;
  }
}

const result = MathUtils.factorial(5);`,
      alternative: `// Simpler functional approach
const factorial = n => n <= 1 ? 1 : n * factorial(n - 1);

const isPrime = n => {
  if (n <= 1) return false;
  for (let i = 2; i < n; i++) {
    if (n % i === 0) return false;
  }
  return true;
};

const result = factorial(5);

// Or with composition:
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);
const compute = pipe(factorial, x => x * 2);`,
      alternativeLabel: 'Functional (Better)'
    }
  },
  {
    id: 'database-models',
    title: 'Database ORM Models',
    description: 'Defining database schemas with relationships, validation, and query methods.',
    requirements: [
      'Data validation',
      'Relationships between models',
      'Instance and static methods',
      'Lifecycle hooks'
    ],
    recommendation: 'oop',
    reason: 'ORMs leverage OOP to map database tables to objects. Each row becomes an instance with methods. Relationships (hasMany, belongsTo) are natural. Active Record pattern fits perfectly.',
    codeExample: {
      oop: `class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
  }

  static async findById(id) {
    const data = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return new User(data);
  }

  async save() {
    if (this.id) {
      await db.query('UPDATE users SET name = ?, email = ? WHERE id = ?',
        [this.name, this.email, this.id]);
    } else {
      const result = await db.query('INSERT INTO users (name, email) VALUES (?, ?)',
        [this.name, this.email]);
      this.id = result.insertId;
    }
  }

  async posts() {
    return Post.findByUserId(this.id);
  }
}

const user = await User.findById(1);
user.name = "New Name";
await user.save();`,
      alternative: `// Functional approach - loses cohesion
const findUserById = async (id) => {
  return await db.query('SELECT * FROM users WHERE id = ?', [id]);
};

const saveUser = async (user) => {
  if (user.id) {
    await db.query('UPDATE users SET name = ?, email = ? WHERE id = ?',
      [user.name, user.email, user.id]);
  } else {
    const result = await db.query('INSERT INTO users (name, email) VALUES (?, ?)',
      [user.name, user.email]);
    return { ...user, id: result.insertId };
  }
};

const getUserPosts = async (userId) => {
  return await findPostsByUserId(userId);
};`,
      alternativeLabel: 'Functional'
    }
  },
  {
    id: 'api-client',
    title: 'REST API Client',
    description: 'Client library for interacting with an API - authentication, request building, error handling.',
    requirements: [
      'State management (auth tokens)',
      'Request configuration',
      'Middleware/interceptors',
      'Chainable API'
    ],
    recommendation: 'oop',
    reason: 'API clients benefit from OOP: instance holds auth state, methods are discoverable via IDE autocomplete, and configuration is encapsulated. Builder pattern enables fluent interfaces.',
    codeExample: {
      oop: `class APIClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.token = null;
    this.headers = {};
  }

  authenticate(token) {
    this.token = token;
    this.headers['Authorization'] = \`Bearer \${token}\`;
    return this;
  }

  setHeader(key, value) {
    this.headers[key] = value;
    return this;
  }

  async get(endpoint) {
    const response = await fetch(\`\${this.baseURL}\${endpoint}\`, {
      headers: this.headers
    });
    return response.json();
  }

  async post(endpoint, data) {
    const response = await fetch(\`\${this.baseURL}\${endpoint}\`, {
      method: 'POST',
      headers: { ...this.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
}

const client = new APIClient('https://api.example.com');
client.authenticate('token123').setHeader('X-Custom', 'value');
const data = await client.get('/users');`,
      alternative: `// Functional approach - less discoverable
const createClient = (baseURL) => ({
  baseURL,
  token: null,
  headers: {}
});

const authenticate = (client, token) => ({
  ...client,
  token,
  headers: { ...client.headers, 'Authorization': \`Bearer \${token}\` }
});

const get = async (client, endpoint) => {
  const response = await fetch(\`\${client.baseURL}\${endpoint}\`, {
    headers: client.headers
  });
  return response.json();
};

let client = createClient('https://api.example.com');
client = authenticate(client, 'token123');
const data = await get(client, '/users');`,
      alternativeLabel: 'Functional'
    }
  }
];

const criteria = [
  {
    id: 'state',
    label: 'Complex State Management',
    description: 'Does each entity need to maintain its own state over time?',
    favor: 'oop'
  },
  {
    id: 'polymorphism',
    label: 'Polymorphic Behavior',
    description: 'Do you need multiple implementations of the same interface/contract?',
    favor: 'oop'
  },
  {
    id: 'inheritance',
    label: 'Shared Behavior via Inheritance',
    description: 'Do entities share common behavior that can be inherited or composed?',
    favor: 'oop'
  },
  {
    id: 'encapsulation',
    label: 'Data + Behavior Encapsulation',
    description: 'Should data and the functions that operate on it be bundled together?',
    favor: 'oop'
  },
  {
    id: 'pure',
    label: 'Pure Transformations',
    description: 'Are operations stateless transformations with no side effects?',
    favor: 'functional'
  },
  {
    id: 'composition',
    label: 'Function Composition',
    description: 'Can the solution be built by composing small, independent functions?',
    favor: 'functional'
  },
  {
    id: 'immutability',
    label: 'Immutability Important',
    description: 'Is immutable data flow critical to prevent bugs?',
    favor: 'functional'
  },
  {
    id: 'simple',
    label: 'Simple Utilities',
    description: 'Are these simple utility functions without complex relationships?',
    favor: 'procedural'
  }
];

export default function Home() {
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [selectedCriteria, setSelectedCriteria] = useState<Set<string>>(new Set());
  const [showComparison, setShowComparison] = useState(false);

  const scenario = scenarios.find(s => s.id === selectedScenario);

  const getRecommendationFromCriteria = () => {
    const oopScore = Array.from(selectedCriteria).filter(id => {
      const criterion = criteria.find(c => c.id === id);
      return criterion?.favor === 'oop';
    }).length;

    const functionalScore = Array.from(selectedCriteria).filter(id => {
      const criterion = criteria.find(c => c.id === id);
      return criterion?.favor === 'functional';
    }).length;

    const proceduralScore = Array.from(selectedCriteria).filter(id => {
      const criterion = criteria.find(c => c.id === id);
      return criterion?.favor === 'procedural';
    }).length;

    if (oopScore > functionalScore && oopScore > proceduralScore) {
      return { paradigm: 'Object-Oriented', color: '#3b82f6' };
    } else if (functionalScore > oopScore) {
      return { paradigm: 'Functional', color: '#10b981' };
    } else if (proceduralScore > 0 && proceduralScore >= oopScore) {
      return { paradigm: 'Procedural', color: '#f59e0b' };
    } else {
      return { paradigm: 'Hybrid Approach', color: '#8b5cf6' };
    }
  };

  const toggleCriterion = (id: string) => {
    const newSet = new Set(selectedCriteria);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedCriteria(newSet);
  };

  const recommendation = selectedCriteria.size > 0 ? getRecommendationFromCriteria() : null;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <header style={{
          textAlign: 'center',
          marginBottom: '3rem',
          color: 'white'
        }}>
          <h1 style={{
            fontSize: '3rem',
            marginBottom: '0.5rem',
            fontWeight: 'bold'
          }}>
            OOP Paradigm Need Analyzer
          </h1>
          <p style={{
            fontSize: '1.25rem',
            opacity: 0.9
          }}>
            Identify when Object-Oriented Programming is the right choice
          </p>
        </header>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {/* Decision Criteria */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              marginBottom: '1.5rem',
              color: '#1f2937',
              borderBottom: '3px solid #667eea',
              paddingBottom: '0.5rem'
            }}>
              Decision Criteria
            </h2>
            <p style={{
              color: '#6b7280',
              marginBottom: '1rem',
              fontSize: '0.95rem'
            }}>
              Select all that apply to your project:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {criteria.map(c => (
                <label
                  key={c.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    padding: '1rem',
                    border: '2px solid',
                    borderColor: selectedCriteria.has(c.id)
                      ? (c.favor === 'oop' ? '#3b82f6' : c.favor === 'functional' ? '#10b981' : '#f59e0b')
                      : '#e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: selectedCriteria.has(c.id) ? '#f9fafb' : 'white'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedCriteria.has(c.id)}
                    onChange={() => toggleCriterion(c.id)}
                    style={{
                      marginRight: '0.75rem',
                      marginTop: '0.25rem',
                      cursor: 'pointer',
                      width: '18px',
                      height: '18px'
                    }}
                  />
                  <div>
                    <div style={{
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '0.25rem'
                    }}>
                      {c.label}
                    </div>
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#6b7280'
                    }}>
                      {c.description}
                    </div>
                    <div style={{
                      marginTop: '0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: c.favor === 'oop' ? '#3b82f6' : c.favor === 'functional' ? '#10b981' : '#f59e0b'
                    }}>
                      → Favors {c.favor === 'oop' ? 'OOP' : c.favor === 'functional' ? 'Functional' : 'Procedural'}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {recommendation && (
              <div style={{
                marginTop: '1.5rem',
                padding: '1.5rem',
                background: `linear-gradient(135deg, ${recommendation.color}22 0%, ${recommendation.color}11 100%)`,
                border: `2px solid ${recommendation.color}`,
                borderRadius: '8px'
              }}>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  marginBottom: '0.5rem'
                }}>
                  Recommended Paradigm:
                </div>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: recommendation.color
                }}>
                  {recommendation.paradigm}
                </div>
              </div>
            )}
          </div>

          {/* Real-World Scenarios */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              marginBottom: '1.5rem',
              color: '#1f2937',
              borderBottom: '3px solid #764ba2',
              paddingBottom: '0.5rem'
            }}>
              Real-World Scenarios
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {scenarios.map(s => {
                const colors = {
                  oop: '#3b82f6',
                  functional: '#10b981',
                  procedural: '#f59e0b',
                  hybrid: '#8b5cf6'
                };
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedScenario(s.id);
                      setShowComparison(false);
                    }}
                    style={{
                      padding: '1rem',
                      border: '2px solid',
                      borderColor: selectedScenario === s.id ? colors[s.recommendation] : '#e5e7eb',
                      borderRadius: '8px',
                      background: selectedScenario === s.id ? '#f9fafb' : 'white',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '0.5rem'
                    }}>
                      {s.title}
                    </div>
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#6b7280',
                      marginBottom: '0.5rem'
                    }}>
                      {s.description}
                    </div>
                    <div style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      background: colors[s.recommendation],
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {s.recommendation.toUpperCase()}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Scenario Details */}
        {scenario && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            marginBottom: '2rem'
          }}>
            <h2 style={{
              fontSize: '2rem',
              marginBottom: '1rem',
              color: '#1f2937'
            }}>
              {scenario.title}
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: '#4b5563',
              marginBottom: '1.5rem'
            }}>
              {scenario.description}
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
              marginBottom: '2rem'
            }}>
              <div>
                <h3 style={{
                  fontSize: '1.25rem',
                  marginBottom: '0.75rem',
                  color: '#1f2937'
                }}>
                  Requirements
                </h3>
                <ul style={{
                  listStyle: 'none',
                  padding: 0
                }}>
                  {scenario.requirements.map((req, idx) => (
                    <li key={idx} style={{
                      padding: '0.5rem 0',
                      borderBottom: '1px solid #e5e7eb',
                      color: '#4b5563'
                    }}>
                      ✓ {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 style={{
                  fontSize: '1.25rem',
                  marginBottom: '0.75rem',
                  color: '#1f2937'
                }}>
                  Recommendation
                </h3>
                <div style={{
                  padding: '1rem',
                  background: '#f3f4f6',
                  borderRadius: '8px',
                  borderLeft: '4px solid #667eea'
                }}>
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#667eea',
                    marginBottom: '0.5rem'
                  }}>
                    {scenario.recommendation.toUpperCase()}
                  </div>
                  <p style={{
                    color: '#4b5563',
                    margin: 0
                  }}>
                    {scenario.reason}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowComparison(!showComparison)}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {showComparison ? 'Hide' : 'Show'} Code Comparison
            </button>

            {showComparison && (
              <div style={{
                marginTop: '2rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '2rem'
              }}>
                {scenario.codeExample.oop && (
                  <div>
                    <h4 style={{
                      fontSize: '1.1rem',
                      marginBottom: '0.75rem',
                      color: '#1f2937',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        background: '#3b82f6',
                        color: 'white',
                        borderRadius: '4px',
                        fontSize: '0.75rem'
                      }}>
                        OOP
                      </span>
                      Object-Oriented Approach
                    </h4>
                    <pre style={{
                      background: '#1f2937',
                      color: '#f3f4f6',
                      padding: '1rem',
                      borderRadius: '8px',
                      overflow: 'auto',
                      fontSize: '0.875rem',
                      lineHeight: '1.5'
                    }}>
                      <code>{scenario.codeExample.oop}</code>
                    </pre>
                  </div>
                )}
                {scenario.codeExample.alternative && (
                  <div>
                    <h4 style={{
                      fontSize: '1.1rem',
                      marginBottom: '0.75rem',
                      color: '#1f2937',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        background: '#10b981',
                        color: 'white',
                        borderRadius: '4px',
                        fontSize: '0.75rem'
                      }}>
                        ALT
                      </span>
                      {scenario.codeExample.alternativeLabel || 'Alternative'}
                    </h4>
                    <pre style={{
                      background: '#1f2937',
                      color: '#f3f4f6',
                      padding: '1rem',
                      borderRadius: '8px',
                      overflow: 'auto',
                      fontSize: '0.875rem',
                      lineHeight: '1.5'
                    }}>
                      <code>{scenario.codeExample.alternative}</code>
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* When OOP is Needed - Summary */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <h2 style={{
            fontSize: '1.75rem',
            marginBottom: '1.5rem',
            color: '#1f2937',
            textAlign: 'center'
          }}>
            When is OOP the Right Choice?
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            <div style={{
              padding: '1.5rem',
              background: 'linear-gradient(135deg, #3b82f622 0%, #3b82f611 100%)',
              borderLeft: '4px solid #3b82f6',
              borderRadius: '8px'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                color: '#3b82f6',
                marginBottom: '0.75rem'
              }}>
                ✓ Use OOP When:
              </h3>
              <ul style={{
                color: '#4b5563',
                lineHeight: '1.8',
                paddingLeft: '1.25rem'
              }}>
                <li>Modeling real-world entities with state and behavior</li>
                <li>Need for polymorphism and runtime behavior selection</li>
                <li>Complex relationships between entities</li>
                <li>Encapsulation of data with methods</li>
                <li>Code reuse through inheritance/composition</li>
                <li>Framework design (plugins, extensions)</li>
                <li>Domain-driven design patterns</li>
              </ul>
            </div>

            <div style={{
              padding: '1.5rem',
              background: 'linear-gradient(135deg, #10b98122 0%, #10b98111 100%)',
              borderLeft: '4px solid #10b981',
              borderRadius: '8px'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                color: '#10b981',
                marginBottom: '0.75rem'
              }}>
                ✗ Avoid OOP When:
              </h3>
              <ul style={{
                color: '#4b5563',
                lineHeight: '1.8',
                paddingLeft: '1.25rem'
              }}>
                <li>Simple data transformations</li>
                <li>Stateless utility functions</li>
                <li>Functional pipelines and data processing</li>
                <li>Immutability is paramount</li>
                <li>Parallel/concurrent operations</li>
                <li>Mathematical computations</li>
                <li>Pure business logic without entities</li>
              </ul>
            </div>

            <div style={{
              padding: '1.5rem',
              background: 'linear-gradient(135deg, #8b5cf622 0%, #8b5cf611 100%)',
              borderLeft: '4px solid #8b5cf6',
              borderRadius: '8px'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                color: '#8b5cf6',
                marginBottom: '0.75rem'
              }}>
                ⚡ Hybrid Approach:
              </h3>
              <ul style={{
                color: '#4b5563',
                lineHeight: '1.8',
                paddingLeft: '1.25rem'
              }}>
                <li>Modern web frameworks (React, Vue)</li>
                <li>OOP for architecture, FP for data flow</li>
                <li>Classes for structure, pure functions for logic</li>
                <li>Leverage strengths of both paradigms</li>
                <li>TypeScript interfaces + functional composition</li>
                <li>Event-driven systems</li>
                <li>Most modern applications</li>
              </ul>
            </div>
          </div>

          <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            background: '#f9fafb',
            borderRadius: '8px',
            borderTop: '3px solid #667eea'
          }}>
            <h3 style={{
              fontSize: '1.1rem',
              color: '#1f2937',
              marginBottom: '1rem'
            }}>
              Key Principle:
            </h3>
            <p style={{
              color: '#4b5563',
              fontSize: '1.05rem',
              lineHeight: '1.7',
              margin: 0,
              fontStyle: 'italic'
            }}>
              "Choose the paradigm that best models your problem domain. OOP excels when your domain
              consists of entities with identity, state, and behavior. Functional programming excels
              when your domain consists of data transformations and compositions. Most modern systems
              benefit from a pragmatic mix of both."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
