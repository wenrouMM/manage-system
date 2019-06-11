const steps = [{
    element: '#logoBox',
    popover: {
      title: '图标导航',
      description: '点击此图标可以回到首页',
      position: 'bottom'
    }
  },
  {
    element: '#collect',
    popover: {
      title: '采编管理',
      description: '采编管理你可以完成书籍采编以及采购管理的功能',
      position: 'bottom'
    }
  },
  {
    element: '#reservation',
    popover: {
      title: '典藏管理',
      description: '流通管理可以完成书籍典藏与书籍报损等操作，完成对书籍从入库到上架的所有操作',
      position: 'bottom'
    }
  },
  {
    element: '#circle',
    popover: {
      title: '流通管理',
      description: '流通管理可以完成书籍借还续借报损等操作以及查看对应的操作记录',
      position: 'bottom'
    }
  },
  {
    element: '#reader',
    popover: {
      title: '读者管理',
      description: '读者管理可以完成读者卡等级的设置以及读者卡的办卡补办注销挂失取挂等功能',
      position: 'bottom'
    }
  },

  {
    element: '#finance',
    popover: {
      title: '财务管理',
      description: '财务管理可以查看由办卡注销补办充值逾期报损等操作产生的数据流向',
      position: 'bottom'
    }
  },
  {
    element: '#system',
    popover: {
      title: '系统管理',
      description: '系统管理可以进行管理系统账号的权限分配以及图书馆基础配置的设置，如补卡金额，充值限额都可以在这里完成',
      position: 'bottom'
    }
  },
  {
    element: '#userName',
    popover: {
      title: '用户中心',
      description: '用户中心可以进行对个人账户信息的修改，退出系统，以及充值注销等常用功能的快捷入口',
      position: 'left'
    }
  },
]

export default steps
