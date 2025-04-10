interface Example {
  title: string;
  description: string;
  bad: string;
  good: string;
  explanation: string;
}

export const examples: Record<string, Example> = {
  playground: {
    title: "🎮 Playground",
    description: "A blank canvas for experimenting with React code",
    bad: `function Component() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Welcome to the Playground!</h2>
      <p className="text-gray-600">
        This is your space to experiment with React code.
        Try editing this component or write your own from scratch!
      </p>
      
      <div className="p-4 border rounded-lg">
        <p>Counter: {count}</p>
        <button
          onClick={() => setCount(c => c + 1)}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Increment
        </button>
      </div>
    </div>
  );
}`,
    good: `function Component() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Welcome to the Playground!</h2>
      <p className="text-gray-600">
        This is your space to experiment with React code.
        Try editing this component or write your own from scratch!
      </p>
      
      <div className="p-4 border rounded-lg">
        <p>Counter: {count}</p>
        <button
          onClick={() => setCount(c => c + 1)}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Increment
        </button>
      </div>
    </div>
  );
}`,
    explanation:
      "This is a playground environment where you can experiment with React code. Try modifying the component or create your own from scratch!",
  },
  "unnecessary-effect": {
    title: "⚡️ Unnecessary Effect for Derived State",
    description:
      "Using an effect to compute values that could be calculated during render",
    bad: `function Component() {
  const [count, setCount] = useState(0);
  const [doubled, setDoubled] = useState(0);

  // 🚫 Unnecessary Effect
  useEffect(() => {
    setDoubled(count * 2);
  }, [count]);

  return (
    <div className="space-y-4">
      <p>Count: {count}</p>
      <p>Doubled: {doubled}</p>
      <button 
        onClick={() => setCount(c => c + 1)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Increment Count
      </button>
    </div>
  );
}`,
    good: `function Component() {
  const [count, setCount] = useState(0);
  
  // ✅ Calculate during render
  const doubled = count * 2;

  return (
    <div className="space-y-4">
      <p>Count: {count}</p>
      <p>Doubled: {doubled}</p>
      <button 
        onClick={() => setCount(c => c + 1)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Increment Count
      </button>
    </div>
  );
}`,
    explanation:
      "Instead of using an Effect to compute doubled, we can calculate it directly during render. This is more efficient and avoids the extra re-render caused by the Effect.",
  },
  "props-in-effect": {
    title: "🔄 Props in Effects",
    description:
      "Using Effects to react to prop changes when direct calculations would work",
    bad: `function Component() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');

  // 🚫 Unnecessary Effect
  useEffect(() => {
    setFullName(\`\${firstName} \${lastName}\`.trim());
  }, [firstName, lastName]);

  return (
    <div className="space-y-4">
      <div>
        <input
          type="text"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          placeholder="First Name"
          className="px-3 py-2 border rounded"
        />
      </div>
      <div>
        <input
          type="text"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          placeholder="Last Name"
          className="px-3 py-2 border rounded"
        />
      </div>
      <p>Full name: {fullName}</p>
    </div>
  );
}`,
    good: `function Component() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ Calculate during render
  const fullName = \`\${firstName} \${lastName}\`.trim();

  return (
    <div className="space-y-4">
      <div>
        <input
          type="text"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          placeholder="First Name"
          className="px-3 py-2 border rounded"
        />
      </div>
      <div>
        <input
          type="text"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          placeholder="Last Name"
          className="px-3 py-2 border rounded"
        />
      </div>
      <p>Full name: {fullName}</p>
    </div>
  );
}`,
    explanation:
      "When you need to combine multiple pieces of state, calculate the result during render instead of using an Effect. This eliminates the need for an extra state variable and avoids the extra re-render.",
  },
  "window-event": {
    title: "🪟 Window Event Listeners",
    description: "Properly handling window event listeners with useEffect",
    bad: `function Component() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // 🚫 Event handler recreated on every render
  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="space-y-4">
      <p>Window width: {windowWidth}px</p>
      <p className="text-sm text-gray-500">
        (Resize your window to see it update)
      </p>
    </div>
  );
}`,
    good: `function Component() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // ✅ Memoize the event handler
  const handleResize = useCallback(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return (
    <div className="space-y-4">
      <p>Window width: {windowWidth}px</p>
      <p className="text-sm text-gray-500">
        (Resize your window to see it update)
      </p>
    </div>
  );
}`,
    explanation:
      "When adding event listeners in an Effect, memoize the event handler with useCallback. This ensures the Effect doesn't need to re-run when unrelated state or props change.",
  },
  "fetch-in-effect": {
    title: "🌐 Data Fetching in Effects",
    description: "Common pitfalls when fetching data with useEffect",
    bad: `function Component() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // 🚫 Missing cleanup, no loading state
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos/1')
      .then(response => response.json())
      .then(json => setData(json))
      .catch(err => setError(err.message));
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  return (
    <div className="space-y-4">
      <h3 className="font-bold">{data.title}</h3>
      <p>Completed: {data.completed ? 'Yes' : 'No'}</p>
    </div>
  );
}`,
    good: `function Component() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Proper cleanup and loading state
  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
        const json = await response.json();
        if (mounted) {
          setData(json);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    }

    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  return (
    <div className="space-y-4">
      <h3 className="font-bold">{data.title}</h3>
      <p>Completed: {data.completed ? 'Yes' : 'No'}</p>
    </div>
  );
}`,
    explanation:
      "When fetching data in an Effect, always include a cleanup function to prevent setting state after unmount, handle loading states, and properly manage errors. Consider using a custom hook or a data fetching library for more complex cases.",
  },
  "state-update-loop": {
    title: "🔄 Infinite State Update Loop",
    description: "Avoiding infinite loops when updating state in Effects",
    bad: `function Component() {
  const [count, setCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // 🚫 Creates an infinite loop
  useEffect(() => {
    setCount(c => c + 1);  // This will cause an infinite loop
  }, [count]);

  return (
    <div className="space-y-4">
      <p>Count: {count}</p>
      <p>Last updated: {lastUpdate.toLocaleTimeString()}</p>
      <button
        onClick={() => setCount(c => c + 1)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Increment
      </button>
    </div>
  );
}`,
    good: `function Component() {
  const [count, setCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // ✅ Update timestamp in the event handler
  const handleIncrement = () => {
    setCount(c => c + 1);
    setLastUpdate(new Date());
  };

  return (
    <div className="space-y-4">
      <p>Count: {count}</p>
      <p>Last updated: {lastUpdate.toLocaleTimeString()}</p>
      <button
        onClick={handleIncrement}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Increment
      </button>
    </div>
  );
}`,
    explanation:
      "When an Effect updates the same state that it depends on, it creates an infinite loop. Instead, handle all state updates together in the event handler.",
  },
  "reset-state": {
    title: "🔄 Reset State Without Effects",
    description: "Using key prop to reset component state instead of Effects",
    bad: `function EditContact({ savedContact, onSave }) {
  const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email);

  // 🚫 Using Effect to reset state
  useEffect(() => {
    setName(savedContact.name);
    setEmail(savedContact.email);
  }, [savedContact]);

  return (
    <section className="space-y-4">
      <label className="block">
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="px-3 py-2 border rounded"
        />
      </label>
      <label className="block">
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="px-3 py-2 border rounded"
        />
      </label>
      <div className="space-x-2">
        <button
          onClick={() => {
            const updatedData = {
              id: savedContact.id,
              name: name,
              email: email
            };
            onSave(updatedData);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save
        </button>
        <button
          onClick={() => {
            setName(savedContact.name);
            setEmail(savedContact.email);
          }}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>
    </section>
  );
}

function Component() {
  const [selectedContact, setSelectedContact] = useState({
    id: 1,
    name: 'John Doe',
    email: 'john@example.com'
  });

  const handleSave = (updatedContact) => {
    setSelectedContact(updatedContact);
  };

  return (
    <div className="space-y-4">
      <div className="space-x-2">
        <button
          onClick={() => setSelectedContact({
            id: 1,
            name: 'John Doe',
            email: 'john@example.com'
          })}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          John Doe
        </button>
        <button
          onClick={() => setSelectedContact({
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com'
          })}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Jane Smith
        </button>
      </div>
      <EditContact savedContact={selectedContact} onSave={handleSave} />
    </div>
  );
}`,
    good: `function EditForm({ savedContact, onSave }) {
  const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email);

  return (
    <section className="space-y-4">
      <label className="block">
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="px-3 py-2 border rounded"
        />
      </label>
      <label className="block">
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="px-3 py-2 border rounded"
        />
      </label>
      <div className="space-x-2">
        <button
          onClick={() => {
            const updatedData = {
              id: savedContact.id,
              name: name,
              email: email
            };
            onSave(updatedData);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save
        </button>
        <button
          onClick={() => {
            setName(savedContact.name);
            setEmail(savedContact.email);
          }}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>
    </section>
  );
}

function Component() {
  const [selectedContact, setSelectedContact] = useState({
    id: 1,
    name: 'John Doe',
    email: 'john@example.com'
  });

  const handleSave = (updatedContact) => {
    setSelectedContact(updatedContact);
  };

  return (
    <div className="space-y-4">
      <div className="space-x-2">
        <button
          onClick={() => setSelectedContact({
            id: 1,
            name: 'John Doe',
            email: 'john@example.com'
          })}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          John Doe
        </button>
        <button
          onClick={() => setSelectedContact({
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com'
          })}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Jane Smith
        </button>
      </div>
      <EditForm
        key={selectedContact.id}
        savedContact={selectedContact}
        onSave={handleSave}
      />
    </div>
  );
}`,
    explanation:
      "Instead of using an Effect to reset form state when the contact changes, use the key prop to force React to create a new instance of the form component. This is more declarative and avoids potential issues with Effect timing.",
  },
  "transform-data": {
    title: "🔄 Transform Data Without Effects",
    description:
      "Calculating derived state during render instead of using Effects",
    bad: `function Component() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build a project', completed: false }
  ]);
  const [showActive, setShowActive] = useState(false);
  const [activeTodos, setActiveTodos] = useState([]);
  const [visibleTodos, setVisibleTodos] = useState([]);

  // 🚫 Unnecessary Effects for derived state
  useEffect(() => {
    setActiveTodos(todos.filter(todo => !todo.completed));
  }, [todos]);

  useEffect(() => {
    setVisibleTodos(showActive ? activeTodos : todos);
  }, [showActive, todos, activeTodos]);

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
          className="rounded"
        />
        Show only active todos
      </label>
      <ul className="space-y-2">
        {visibleTodos.map(todo => (
          <li key={todo.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => {
                setTodos(todos.map(t => 
                  t.id === todo.id ? { ...t, completed: !t.completed } : t
                ));
              }}
              className="rounded"
            />
            <span className={todo.completed ? 'line-through text-gray-500' : ''}>
              {todo.text}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-sm text-gray-500">
        {activeTodos.length} todos left
      </p>
    </div>
  );
}`,
    good: `function Component() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build a project', completed: false }
  ]);
  const [showActive, setShowActive] = useState(false);

  // ✅ Calculate derived state during render
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
          className="rounded"
        />
        Show only active todos
      </label>
      <ul className="space-y-2">
        {visibleTodos.map(todo => (
          <li key={todo.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => {
                setTodos(todos.map(t => 
                  t.id === todo.id ? { ...t, completed: !t.completed } : t
                ));
              }}
              className="rounded"
            />
            <span className={todo.completed ? 'line-through text-gray-500' : ''}>
              {todo.text}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-sm text-gray-500">
        {activeTodos.length} todos left
      </p>
    </div>
  );
}`,
    explanation:
      "Instead of using Effects to calculate derived state, compute it directly during render. This is more efficient and avoids unnecessary re-renders.",
  },
  "cache-calculation": {
    title: "💾 Cache Expensive Calculations",
    description:
      "Using useMemo to cache expensive calculations instead of Effects",
    bad: `function Component() {
  const [products] = useState([
    { id: 1, name: 'Product 1', price: 100 },
    { id: 2, name: 'Product 2', price: 200 },
    { id: 3, name: 'Product 3', price: 300 }
  ]);
  const [filter, setFilter] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  // 🚫 Using Effect to filter products
  useEffect(() => {
    const result = products.filter(product => 
      product.name.toLowerCase().includes(filter.toLowerCase())
    );
    setFilteredProducts(result);
  }, [products, filter]);

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder="Search products..."
        className="w-full px-4 py-2 border rounded"
      />
      <ul className="space-y-2">
        {filteredProducts.map(product => (
          <li key={product.id} className="p-4 border rounded">
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-gray-600">{product.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
    good: `function Component() {
  const [products] = useState([
    { id: 1, name: 'Product 1', price: 100 },
    { id: 2, name: 'Product 2', price: 200 },
    { id: 3, name: 'Product 3', price: 300 }
  ]);
  const [filter, setFilter] = useState('');

  // ✅ Cache expensive calculation with useMemo
  const filteredProducts = useMemo(() => {
    return products.filter(product => 
      product.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [products, filter]);

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder="Search products..."
        className="w-full px-4 py-2 border rounded"
      />
      <ul className="space-y-2">
        {filteredProducts.map(product => (
          <li key={product.id} className="p-4 border rounded">
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-gray-600">{product.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
    explanation:
      "Use useMemo to cache expensive calculations instead of using Effects. This ensures the calculation only runs when its dependencies change, and avoids unnecessary state updates.",
  },
  "submit-form": {
    title: "📝 Submit Form Without Effects",
    description:
      "Handling form submission in event handlers instead of Effects",
    bad: `function Component() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState([]);

  // 🚫 Using Effect to handle form submission
  useEffect(() => {
    if (isSubmitting) {
      setProducts([...products, { name, price: Number(price) }]);
      setIsSubmitting(false);
    }
  }, [isSubmitting, name, price, products]);

  return (
    <div className="space-y-4">
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product Name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <button
          type="button"
          onClick={() => setIsSubmitting(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Product
        </button>
      </form>
      <ul className="space-y-2">
        {products.map((product, index) => (
          <li key={index} className="p-4 border rounded">
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-gray-600">{product.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
    good: `function Component() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [products, setProducts] = useState([]);

  // ✅ Handle form submission in event handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setProducts([...products, { name, price: Number(price) }]);
    setName('');
    setPrice('');
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product Name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Product
        </button>
      </form>
      <ul className="space-y-2">
        {products.map((product, index) => (
          <li key={index} className="p-4 border rounded">
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-gray-600">{product.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
    explanation:
      "Handle form submission directly in event handlers instead of using Effects. This is more straightforward and avoids unnecessary state variables.",
  },
  "prop-drilling": {
    title: "🔗 Prop Drilling Problem",
    description:
      "Demonstrating the problem of passing props through multiple levels",
    bad: `function Component() {
  const [theme, setTheme] = useState('light');
  
  return (
    <div className={theme === 'light' ? 'bg-white' : 'bg-gray-900'}>
      <Header theme={theme} />
      <Main theme={theme} />
      <Footer theme={theme} />
    </div>
  );
}

function Header({ theme }) {
  return (
    <header className="p-4">
      <h1 className={theme === 'light' ? 'text-black' : 'text-white'}>
        My App
      </h1>
      <Navigation theme={theme} />
    </header>
  );
}

function Navigation({ theme }) {
  return (
    <nav className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>
      <ul className="flex gap-4">
        <li>Home</li>
        <li>About</li>
        <li>Contact</li>
      </ul>
    </nav>
  );
}

function Main({ theme }) {
  return (
    <main className="p-4">
      <Content theme={theme} />
    </main>
  );
}

function Content({ theme }) {
  return (
    <div className={theme === 'light' ? 'text-gray-800' : 'text-gray-200'}>
      <h2>Welcome to my app</h2>
      <p>This is some content that needs the theme prop.</p>
    </div>
  );
}

function Footer({ theme }) {
  return (
    <footer className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
      <p>© 2024 My App</p>
    </footer>
  );
}`,
    good: `const ThemeContext = React.createContext('light');

function Component() {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={theme}>
      <div className={theme === 'light' ? 'bg-white' : 'bg-gray-900'}>
        <Header />
        <Main />
        <Footer />
      </div>
    </ThemeContext.Provider>
  );
}

function Header() {
  const theme = useContext(ThemeContext);
  return (
    <header className="p-4">
      <h1 className={theme === 'light' ? 'text-black' : 'text-white'}>
        My App
      </h1>
      <Navigation />
    </header>
  );
}

function Navigation() {
  const theme = useContext(ThemeContext);
  return (
    <nav className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>
      <ul className="flex gap-4">
        <li>Home</li>
        <li>About</li>
        <li>Contact</li>
      </ul>
    </nav>
  );
}

function Main() {
  return (
    <main className="p-4">
      <Content />
    </main>
  );
}

function Content() {
  const theme = useContext(ThemeContext);
  return (
    <div className={theme === 'light' ? 'text-gray-800' : 'text-gray-200'}>
      <h2>Welcome to my app</h2>
      <p>This is some content that needs the theme prop.</p>
    </div>
  );
}

function Footer() {
  const theme = useContext(ThemeContext);
  return (
    <footer className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
      <p>© 2024 My App</p>
    </footer>
  );
}`,
    explanation:
      "Context provides a way to pass data through the component tree without having to pass props manually at every level. This eliminates prop drilling and makes the code more maintainable.",
  },
  "nested-context": {
    title: "🌳 Nested Context",
    description:
      "Demonstrating how nested contexts can override parent contexts",
    bad: `function Component() {
  const [user, setUser] = useState({ name: 'John', role: 'user' });
  
  return (
    <div>
      <Header user={user} />
      <Main user={user} />
    </div>
  );
}

function Header({ user }) {
  return (
    <header>
      <h1>Welcome, {user.name}</h1>
      <UserMenu user={user} />
    </header>
  );
}

function UserMenu({ user }) {
  return (
    <div>
      <p>Role: {user.role}</p>
      <button>Settings</button>
    </div>
  );
}

function Main({ user }) {
  return (
    <main>
      <Content user={user} />
    </main>
  );
}

function Content({ user }) {
  return (
    <div>
      <p>You are viewing content as {user.role}</p>
    </div>
  );
}`,
    good: `const UserContext = React.createContext({ name: '', role: '' });

function Component() {
  const [user, setUser] = useState({ name: 'John', role: 'user' });
  
  return (
    <UserContext.Provider value={user}>
      <div>
        <Header />
        <Main />
      </div>
    </UserContext.Provider>
  );
}

function Header() {
  const user = useContext(UserContext);
  return (
    <header>
      <h1>Welcome, {user.name}</h1>
      <UserContext.Provider value={{ ...user, role: 'admin' }}>
        <UserMenu />
      </UserContext.Provider>
    </header>
  );
}

function UserMenu() {
  const user = useContext(UserContext);
  return (
    <div>
      <p>Role: {user.role}</p>
      <button>Settings</button>
    </div>
  );
}

function Main() {
  return (
    <main>
      <Content />
    </main>
  );
}

function Content() {
  const user = useContext(UserContext);
  return (
    <div>
      <p>You are viewing content as {user.role}</p>
    </div>
  );
}`,
    explanation:
      "Nested contexts allow you to override values from parent contexts. In this example, the UserMenu component sees the user as an admin, while other components see the original user role.",
  },
};
