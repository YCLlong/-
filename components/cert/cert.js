Component({
  mixins: [],
  data: {
     
  },
  props: {
      
  },
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  methods: {
  /**
   * 扫二维码
   */
    scan() {
        dd.scan({
            type: 'qr',
            success: (res) => {

                dd.alert({ title: '二维码内容', content: res.code });
            },
            fail: (res) => {
                getApp().showError("扫码失败！错误代码：" + res.code);
            }
        });
    }
  },
});
