{
  let view = {
    el: '.page .songList-container',
    template: `  <ul class="songList">
  </ul>`,
    render(data) {
      $(this.el).html(this.template)
      let {songs} = data
      let divList = songs.map((song)=> $('<div></div>').append($('<li></li>').text(song.name)).append($('<div></div>').addClass('line')))
      $(this.el).find('ul').empty()
      divList.map((divDom)=>{
        $(this.el).find('ul').append(divDom)
      })
    },
    clearActive(){
      $(this.el).find('.active').removeClass('active')
    }
  }
  let model = {
    data:{
      songs:[]
    }
  }
  let contorller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.view.render(this.model.data)
      window.eventHub.on('upload', ()=>{
        this.view.clearActive()
      })
      window.eventHub.on('create', (songData)=>{
        this.model.data.songs.push(songData)
        this.view.render(this.model.data)
      })
    }
  }
  contorller.init(view, model)
}