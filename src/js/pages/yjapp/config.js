export default {

  // 正常模式的tab title配置
  tabTitles: [
  {
    title: '首页',
    icon: 'http://yj.kiy.cn/Content/Images/App/assets/main/main.png',
    activeIcon: 'http://yj.kiy.cn/Content/Images/App/assets/main/main-active.png'
  },
  {
    title: '统计',
    icon: 'http://yj.kiy.cn/Content/Images/App/assets/main/list.png',
    activeIcon: 'http://yj.kiy.cn/Content/Images/App/assets/main/list-active.png'
  },
  {
    title: '个人中心',
    icon: 'http://yj.kiy.cn/Content/Images/App/assets/main/person.png',
    activeIcon: 'http://yj.kiy.cn/Content/Images/App/assets/main/person-active.png'
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
      title: '主菜单',
      pages: [
        {

            title: '发货单',
            icon: 'http://yj.kiy.cn/Content/Images/App/assets/icon/链接.png',
            name: 'invoice-list'
        },

        {
            title: '物流订单',
            icon: 'http://yj.kiy.cn/Content/Images/App/assets/icon/打印.png',
            type: {},
            name: 'dis-list'
        }, 
         {
            title: '平台订单',
            icon: 'http://yj.kiy.cn/Content/Images/App/assets/icon/插座.png',
            name: 'order-list'
        }, {
            title: '财务记录',
            icon: 'http://yj.kiy.cn/Content/Images/App/assets/icon/公文包.png',
            name: 'collectionlist'
        }, 
        {
            title: '配送率',
            icon: 'http://yj.kiy.cn/Content/Images/App/assets/icon/文件.png',
            name: 'echartlist'
        },
        {
            title: '应收款率',
            icon: 'http://yj.kiy.cn/Content/Images/App/assets/icon/文件整理.png',
            type: {
              '@bPay': 0
            },
            name: 'echartlist'
        },
        {
            title: '签到记录',
            icon: 'http://yj.kiy.cn/Content/Images/App/assets/icon/统计.png',
            name: 'signinlist'
        },
        {
            title: '手工输入',
            icon: 'http://yj.kiy.cn/Content/Images/App/assets/icon/对话.png',
            name: 'manualInput'
        },
        {
						title: '批量收款',
            icon: 'http://yj.kiy.cn/Content/Images/App/assets/icon/文件记录.png',
            sub: '批量收款',
						type: {
							'@isPay': 0
						},
						name: 'batch-list'
					}
        // {
        //     title: '已扫单',
        //     icon: 'http://yj.kiy.cn/Content/Images/App/assets/icon/声音.png',
        //     type: {
        //         '@orderStatu': '10,50'
        //     },
        //     name: 'dis-list'
        // }


      ]
    }
    // ,
    // {
    //   title: '物流订单',
    //   pages: [
    //     {
    //         title: '未收货',
    //         icon: 'http://yj.kiy.cn/Content/Images/App/assets/icon/文档.png',
    //         sub: '批量收货',
    //         type: {
    //             '@orderStatu': '1,2,5,10,6,7,8'
    //         },
    //         name: 'dis-list'
    //     }, {
    //         title: '未收款',
    //         icon: 'http://yj.kiy.cn/Content/Images/App/assets/icon/文件记录.png',
    //         sub: '批量收款',
    //         type: {
    //             '@isPay': 0
    //         },
    //         name: 'dis-list'
    //     }, {
    //         title: '已收款',
    //         icon: 'http://yj.kiy.cn/Content/Images/App/assets/icon/文件整理.png',
    //         type: {
    //             '@isPay': 1
    //         },
    //         name: 'dis-list'
    //     }, {
    //         title: '已收货',
    //         icon: 'http://yj.kiy.cn/Content/Images/App/assets/icon/文件夹.png',
    //         type: {
    //             '@orderStatu': '50,51,48,33'
    //         },
    //         name: 'dis-list'
    //     }

    //   ]
    // }

    ],
    mainList : [
      {
        title: '彩印通订单',
        icon: 'http://yj.kiy.cn/Content/Images/App/assets/icon/5.png',
        name: 'order-list'
      },
      {
        title: '财务记录',
        icon: 'http://yj.kiy.cn/Content/Images/App/assets/icon/6.png',
        name:'collectionlist'
      },
      {
        title: '签到',
        icon: 'http://yj.kiy.cn/Content/Images/App/assets/icon/7.png',
        name: 'signin'
      },
      {
        title: '签到记录',
        icon: 'http://yj.kiy.cn/Content/Images/App/assets/icon/8.png',
        name: 'signinlist'
      }
    ]
}