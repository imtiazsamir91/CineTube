import app from './app';

const PORT = 5000;

function main() {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running beautifully on port ${PORT} 🏃‍♂️🔥`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

main();