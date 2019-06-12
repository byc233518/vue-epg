import $ from "n-zepto";
export default class Groups {
  constructor(vnode, binding, options) {

    const default_options = {
      group_name: "group"
    };
    let config = Object.assign(default_options, options);
    this.group_class = config.group_name;
    let elm = vnode.elm;
    $(elm).addClass(this.group_class);
    let groupId = "group-" + Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 10);
    if (elm.dataset){
      if (!elm.dataset.groupId) {
        elm.dataset.groupId = groupId;
      }
    } else{
      if (!elm.attributes.groupId) {
        elm.attributes.groupId = groupId;
      }
    }
    this.groupId = groupId;
    this.listener = {};
    this.$el = elm;
    if (vnode.data.on) {
      ["left", "right", "up", "down"].forEach(type => {
        if (vnode.data.on.hasOwnProperty(type)) {
          this.listener[type] = vnode.data.on[type];
        }
      });
    }
  }
}
