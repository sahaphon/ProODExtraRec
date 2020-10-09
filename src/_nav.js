export default {
    items:[
        {
            name: 'Dashboard',
            url: '/main/dashboard',
            icon: 'icon-speedometer',
            attributes: { disabled: false }
        },
        {
          name: 'เอกสารเซ็นต์',
          icon: 'icon-tag',
          children: [
            {
              name: 'ใบเปิด ORDER',
              url: '/main/documents',
              icon: 'icon-tag',
            }
          ]
        },
        {
          name: "จัดการข้อมูล",
          icon: 'icon-user',
          children: [
            {
              name: 'แฟ้มข้อมูลระบบงาน',
              url: '/main/filemst',
              icon: 'icon-folder-alt',
            },
            {
              name: 'แฟ้มข้อมูลผู้ใช้งาน',
              url: '',
              icon: 'icon-user',
            },
          ]
        },    
    ]
}

// รูปแบบ icon อยูที่ https://simplelineicons.github.io/