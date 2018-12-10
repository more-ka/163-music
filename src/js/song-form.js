{
  let view = {
    el: '.page > main',
    template: `
    <form action="">
    <h2>新建歌曲</h2>
    <div class="row">
      <label>
        歌手
      </label>
      <input name="name" type="text" value="__name__">
    </div>
    <div class="row">
      <label>
        歌手
      </label>
      <input name="singer" type="text" value="__singer__">
    </div>
    <div class="row">
      <label>
        链接
      </label>
      <input name="url" type="text" value="__url__">
    </div>
    <div class="row actions">
        <button type="submit">保存</button>
    </div>
  </form>
    `,
    render(data = {}) { //如果没有data或者data等于空,默认执行data={}
      let information = ['name', 'singer','url','id']
      let html = this.template
      information.map((string) => {
        html = html.replace(`__${string}__`, data[string] || '')
        //使用data的值替换占位,没有值则为 ''
      })
      $(this.el).html(html)
    },
    reset(){
      this.render({})
    }
  }
  let model = {
    data: {
      name: '',
      singer: '',
      url: '',
      id: ''
    },
    create(data) {
      // 声明类型
      var Song = AV.Object.extend('Song');
      // 新建对象
      var song = new Song();
      // 设置名称
      song.set('name', data.name);
      song.set('singer', data.singer);
      song.set('url', data.url);
      song.set('id', data.id);
      return song.save().then( (newSong) => {
        let {id,attributes} = newSong
        this.data = {id,...attributes}
        //Object.assign(this.data,{id,...attributes})
        //assign 把右边对象赋给左边对象 错误写法,不可以直接传内存地址
        //...attributes 复制attr所有属性
      },  (error) => {
        console.error(error);
      });
    }
  }
  let controller = {
    init(view, model) {
      this.model = model
      this.view = view
      this.bindEvents()
      this.view.render(this.model.data)
      window.eventHub.on('upload', (data) => {
        this.view.render(data)
      })
    },
    bindEvents() {
      $(this.view.el).on('submit', 'form', (e) => {
        e.preventDefault()
        let needs = "name singer url".split(' ')
        let data = {}
        needs.map((string) => {
          data[string] = $(this.view.el).find(`[name="${string}"]`).val()
        })
        this.model.create(data)
        .then(()=>{
          console.log(this.model.data)
          this.view.reset()
          window.eventHub.emit('create',this.model.data)
        })
      })
    }

  }
  controller.init(view, model)

}