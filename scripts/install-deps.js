const { execSync } = require('child_process');

try {
  console.log('CWD:', process.cwd());
  console.log('Installing dependencies...');
  execSync('pnpm add @supabase/ssr@latest @supabase/supabase-js@latest framer-motion@latest swr@latest bcryptjs@latest', {
    stdio: 'inherit',
    timeout: 120000
  });
  console.log('Dependencies installed successfully!');
} catch (error) {
  console.error('Install failed:', error.message);
  process.exit(1);
}
