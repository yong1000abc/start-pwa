import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import {BuildEnv} from 'src/BuildEnv';
import {MainView} from 'src/main/view/MainView';
import {store} from 'src/store/store';

if('serviceWorker' in navigator) {
  navigator.serviceWorker.register(`./sw.js?${BuildEnv.version}`);
}

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(
    <BrowserRouter>
      <Provider store={store}>
        <MainView/>
      </Provider>
    </BrowserRouter>
  );
}