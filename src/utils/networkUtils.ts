// Random delay to simulate human behavior
export const delayExecution = async (
  min: number,
  max: number
): Promise<void> => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, delay));
};

// Get a random proxy from a pool (simulated)
export const getRandomProxy = (): string => {
  const proxyPool = [
    "123.45.67.89:8080",
    "98.76.54.32:3128",
    "111.222.333.444:80",
    "555.666.777.888:8888",
  ];

  return proxyPool[Math.floor(Math.random() * proxyPool.length)];
};

// Simulate human-like browser behavior
export const simulateHumanBehavior = async (): Promise<void> => {
  // Random mouse movements (simulated)
  console.log("Simulating mouse movements...");
  await delayExecution(500, 1500);

  // Random scrolling (simulated)
  console.log("Simulating scrolling...");
  await delayExecution(1000, 2500);

  // Random pauses (simulated)
  console.log("Simulating thinking pause...");
  await delayExecution(2000, 4000);
};

// Check if a website has anti-bot measures
export const detectAntiBotMeasures = async (url: string): Promise<boolean> => {
  // In a real app, this would analyze the page for CAPTCHA, browser fingerprinting, etc.
  // This is just a simulation
  console.log(`Checking for anti-bot measures on ${url}...`);
  await delayExecution(500, 1500);

  // Randomly return true or false for demo purposes
  return Math.random() > 0.7;
};
