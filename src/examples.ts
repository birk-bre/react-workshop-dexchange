interface Example {
  title: string;
  description: string;
  bad: string;
  good: string;
  explanation: string;
}

export const examples: Record<string, Example> = {
  'playground': {
    title: '🎮 Playground',
    description: 'A blank canvas for experimenting with React code',
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
    explanation: 'This is a playground environment where you can experiment with React code. Try modifying the component or create your own from scratch!'
  },
  'unnecessary-effect': {
    title: '⚡️ Unnecessary Effect for Derived State',
    description: 'Using an effect to compute values that could be calculated during render',
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
    explanation: 'Instead of using an Effect to compute doubled, we can calculate it directly during render. This is more efficient and avoids the extra re-render caused by the Effect.'
  },
  'props-in-effect': {
    title: '🔄 Props in Effects',
    description: 'Using Effects to react to prop changes when direct calculations would work',
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
    explanation: 'When you need to combine multiple pieces of state, calculate the result during render instead of using an Effect. This eliminates the need for an extra state variable and avoids the extra re-render.'
  },
  'window-event': {
    title: '🪟 Window Event Listeners',
    description: 'Properly handling window event listeners with useEffect',
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
    explanation: 'When adding event listeners in an Effect, memoize the event handler with useCallback. This ensures the Effect doesn\'t need to re-run when unrelated state or props change.'
  },
  'fetch-in-effect': {
    title: '🌐 Data Fetching in Effects',
    description: 'Common pitfalls when fetching data with useEffect',
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
    explanation: 'When fetching data in an Effect, always include a cleanup function to prevent setting state after unmount, handle loading states, and properly manage errors. Consider using a custom hook or a data fetching library for more complex cases.'
  },
  'state-update-loop': {
    title: '🔄 Infinite State Update Loop',
    description: 'Avoiding infinite loops when updating state in Effects',
    bad: `function Component() {
  const [count, setCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // 🚫 Creates an infinite loop
  useEffect(() => {
    setLastUpdate(new Date());
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
    explanation: 'Instead of updating related state in an Effect, handle all state updates together in the event handler. This prevents unnecessary re-renders and potential infinite loops.'
  }
};