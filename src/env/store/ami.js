import store from '@/store';
import DumpsStore from '@/store/modules/Logs/DumpsStore';

store.registerModule('dumps', DumpsStore);

export default store;
