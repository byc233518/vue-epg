console.log('iptv-epg is loaded')
import EpgService from "./lib/EpgService";
import Items from "./lib/util/items";
import Groups from "./lib/util/groups";
let GlobalVue = null;
if (typeof window !== "undefined") {
    GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
    GlobalVue = global.Vue;
}

class VueEpg {
    constructor(options) {
        if(!this.epgService) this.epgService = new EpgService(options);
    }
    getService(){
        return this.epgService
    }
    install(GlobalVue) {
        GlobalVue.prototype.$service = this.epgService;
        let service = this.epgService;
        GlobalVue.directive("group", {
            bind(el, binding, vnode) {
                let group = new Groups(vnode, binding);
                service.registerGroup(group);
            },
            componentUpdated: function(el, binding, vnode) {
                let item = new Groups(vnode, binding);
                service.updateGroup(item);
            },
            unbind: (el, binding, vnode) => {
                // service.groups.splice(service.groups.findIndex(item=>item.groupId===el.dataset['groupId']),1)

                service.groups.forEach((item, index) => {
                    if (item.groupId === el.dataset["groupId"]) {
                        service.groups.splice(index, 1);
                    }
                });

            }
        });
        GlobalVue.directive("items", {
            bind(el, binding, vnode) {
                let item = new Items(vnode, binding);
                service.registerItem(item);
            },
            componentUpdated: function(el, binding, vnode) {
                let item = new Items(vnode, binding);
                service.updateItem(item);
            },
            unbind: (el, binding, vnode) => {
                service.items.forEach((item, index) => {
                    if (item.id === el.dataset.id) {
                        service.items.splice(index, 1);
                    }
                });
            }
        });
        GlobalVue.mixin({
            mounted() {
                if (this.serviceBack) {
                    this.$service.onback = this.serviceBack;
                }
            }
        });
    }
}
export default VueEpg;
