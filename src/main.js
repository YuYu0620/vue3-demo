import { createApp } from 'vue'
import App from './App.vue'
import Router from "./router/index.js"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { ElMessage } from "element-plus";//引入message组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App);
app.config.globalProperties.$messages = ElMessage;
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(Router);
app.use(ElementPlus);
app.mount('#app');
