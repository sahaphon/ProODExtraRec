import Dashboard from './views/Dashboard/Dashboard'
import Rec from './views/pages/recfirm' 
import Report from './views/pages/report'
import AeDoc from './views/pages/ae_recfirm'
import Filemst from './views/pages/filemst'
import AeFile from './views/pages/ae_filemst'

const routes = [
     {path: '/main', exact: true, name: 'หน้าหลัก', component: Rec},
     {path: '/main/dashboard', exact: true ,name: 'Dashboard', component: Dashboard},
     {path: '/main/documents', exact: true ,name: 'ใบเปิด ORDER', component: Rec},
     {path: '/main/report/:id', exact: true ,name: 'รายงาน', component: Report},        //พิมพ์รายงาน
     {path: '/main/edit/:id', exact: true ,name: 'แก้ไขใบเปิด ORDER', component: AeDoc},   //แก้ไขใบเปิด ORDER
     {path: '/main/filemst', exact: true ,name: 'แฟ้มข้อมูลระบบงาน', component: Filemst},
     {path: '/main/filemst/add', exact: true ,name: 'เพิ่มข้อมูลแฟ้มระบบงาน', component: AeFile},
     {path: '/main/filemst/edit/:id', exact: true ,name: 'แก้ไขข้อมูลแฟ้มระบบงาน', component: AeFile}
];

export default routes;