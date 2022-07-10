import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';
import {HashRouter} from 'react-router-dom';
import {MainView} from 'src/main/view/MainView';
import {store} from 'src/store/store';
import {ServiceWorkerController} from 'src/sw/ServiceWorkerController';

ServiceWorkerController.init();

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(
    <HashRouter>
      <Provider store={store}>
        <MainView/>
      </Provider>
    </HashRouter>
  );
}