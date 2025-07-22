const App = require('./src/app');

const app = new App();

app.start().catch((error) => {
  console.error('❌ Error starting app:', error.message);
  process.exit(1);
});
