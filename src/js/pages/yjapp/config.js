export default {

  // 正常模式的tab title配置
  tabTitles: [
  {
    title: '首页',
    icon: 'bmlocal://assets/main/main.png',
    activeIcon: 'bmlocal://assets/main/main-active.png'
  },
  {
    title: '批量操作',
    icon: 'bmlocal://assets/main/list.png',
    activeIcon: 'bmlocal://assets/main/list-active.png'
  },
  {
    title: '个人中心',
    icon: 'bmlocal://assets/main/person.png',
    activeIcon: 'bmlocal://assets/main/person-active.png'
  }
  ],
  tabStyles: {
    bgColor: '#FFFFFF',
    titleColor: '#666666',
    activeTitleColor: '#1da1f2',
    activeBgColor: '#FFFFFF',
    isActiveTitleBold: true,
    iconWidth: 70,
    iconHeight: 70,
    width: 160,
    height: 120,
    fontSize: 24,
    textPaddingLeft: 10,
    textPaddingRight: 10
  },

  // 使用 iconFont 模式的tab title配置
  tabIconFontTitles: [
  {
    title: '首页',
    codePoint: '\ue623'
  },
  {
    title: '特别推荐',
    codePoint: '\ue608'
  },
  {
    title: '消息中心',
    codePoint: '\ue752',
    badge: 5
  },
  {
    title: '我的主页',
    codePoint: '\ue601',
    dot: true
  }
  ],
  tabIconFontStyles: {
    bgColor: '#FFFFFF',
    titleColor: '#666666',
    activeTitleColor: '#3D3D3D',
    activeBgColor: '#FFFFFF',
    isActiveTitleBold: true,
    width: 160,
    height: 120,
    fontSize: 24,
    textPaddingLeft: 10,
    textPaddingRight: 10,
    iconFontSize: 50,
    iconFontMarginBottom: 8,
    iconFontColor: '#333333',
    activeIconFontColor: 'red',
    iconFontUrl: '//at.alicdn.com/t/font_501019_mauqv15evc1pp66r.ttf'
  },
  distribution : [
    {
      title: '未收货',
      icon: 'bmlocal://assets/icon/1.png',
      sub: '批量收货',
      type: {'@orderStatu' : '1,2,5,10,6,7,8'}
    },
    {
      title: '未收款',
      icon: 'bmlocal://assets/icon/2.png',
      sub: '批量收款',
      type: {'@isPay' : 0}
    },
    {
      title: '已收款',
      icon: 'bmlocal://assets/icon/3.png',
      type: {'@isPay' : 1}
    },
    {
      title: '已收货',
      icon: 'bmlocal://assets/icon/4.png',
      type: {'@orderStatu' : '50,51,48,33'}
    },
    ],
    mainList : [
      {
        title: '彩印通订单',
        icon: 'bmlocal://assets/icon/5.png',
        name: 'order-list'
      },
      {
        title: '财务记录',
        icon: 'bmlocal://assets/icon/6.png',
        name:'collectionlist'
      },
      {
        title: '签到',
        icon: 'bmlocal://assets/icon/7.png',
        name: 'signin'
      },
      {
        title: '签到记录',
        icon: 'bmlocal://assets/icon/8.png',
        name: 'signinlist'
      }
    ]
}