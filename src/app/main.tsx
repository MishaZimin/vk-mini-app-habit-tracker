import { createRoot } from 'react-dom/client';
import vkBridge from '@vkontakte/vk-bridge';
import { AppConfig } from './providers/AppConfig.tsx';
import './index.css';

async function initApp() {
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    throw new Error('Root element not found');
  }

  const root = createRoot(rootElement);

  try {
    await vkBridge.send('VKWebAppInit');

    root.render(<AppConfig />);
  } catch (err) {
    root.render(
      <div style={{ padding: 20 }}>
        <h1>Произошла ошибка</h1>
        <p>Попробуйте перезагрузить приложение</p>
      </div>
    );
  }

  if (import.meta.env.MODE === 'development') {
    import('../shared/lib/eruda.ts')
      .then(() => console.log('Eruda initialized'))
      .catch((e) => console.error('Eruda init error:', e));
  }
}

initApp().catch((e) => console.error('Fatal init error:', e));
