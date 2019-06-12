import EpgService from "./EpgService";
import Items from './util/items';
import Groups from './util/groups'
class VueEpg{
  constructor(options){
    this.epgService = new EpgService(options)
  }
  install(Vue){
    Vue.prototype.$service = this.epgService
    let service = this.epgService
    Vue.directive('group',{
      bind(el,binding,vnode){
        let group = new Groups(vnode,binding);
        service.registerGroup(group)
      },
      componentUpdated: function (el,binding,vnode) {
        let item = new Groups(vnode,binding);
        service.updateGroup(item)
      },
      unbind: (el, binding, vnode) => {
        // service.groups.splice(service.groups.findIndex(item=>item.groupId===el.dataset['groupId']),1)

        service.groups.forEach((item,index)=>{
          if(item.groupId===el.dataset['groupId']){
            service.groups.splice(index,1)
          }
        })

      }
    })
    Vue.directive('items',{
      bind(el,binding,vnode){
        let item = new Items(vnode,binding);
        service.registerItem(item)
      },
      componentUpdated: function (el,binding,vnode) {
        let item = new Items(vnode,binding);
        service.updateItem(item)
      },
      unbind: (el, binding, vnode) => {
        service.items.forEach((item,index)=>{
          if(item.id===el.dataset.id){
            service.items.splice(index,1)
          }
        })
      }
    })
    Vue.mixin({
      mounted(){
        if(this.serviceBack) {
          this.$service.onback = this.serviceBack
        }
      }
    })
  }
}

export  {VueEpg}
