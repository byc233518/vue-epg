export default class Items {
  constructor(vnode, binding) {
    let elm = vnode.elm;
    let id = "focus-el-" + Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 10);
    if (elm.dataset){
      if (!elm.dataset.id) {
        elm.dataset.id = id;
      }
    } else{
      if (!elm.attributes.id) {
        elm.attributes.id = id;
      }
    }
    this.data = {};
    this.$el = elm;
    this.id = id;

    this.isDefault = !!(binding.value && binding.value.default);
    this.isFocus=false;
    this.listener = {
      "click": false,
      "focus": false,
      "blur": false,
      "left": false,
      "right": false,
      "up": false,
      "down": false
    };
    if (binding.value && binding.value.class) {
      binding.value.class && (this.focus_class = binding.value.class);
    }
    if (vnode.data.attrs) {
      this.data = vnode.data.attrs;
    }
    if (vnode.data.on) {
      ["click", "focus", "blur", "left", "right", "up", "down"].forEach(type => {
        if (vnode.data.on.hasOwnProperty(type)) {
          this.listener[type] = vnode.data.on[type];
        }
      });
    }

  }
}
