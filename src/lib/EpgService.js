import Caculate from "./util/caculate";
import $ from "n-zepto";
import {find,getXPath} from "xpath-dom";

export default class EpgService {
  constructor(options) {
    const default_options = {
      focus_class: "focus",
      back: this.back,
      group_name: ".group"
    };
    let config = Object.assign(default_options, options);
    this.options = config;
    this.focus_class = config.focus_class;
    this.back = config.back;
    this.caculate = new Caculate();
    this.pointer = null;//当前指针元素
    this.group = null;
    this.keyActions = { // 键值对应
      "UP": [87],
      "DOWN": [83, 40],
      "LEFT": [65],
      "RIGHT": [68],
      "ENTER": [13],
      "BACK": [4, 27]
    };
    this.items = [];
    this.groups = [];
    this.actions = options.actions || [];
    this.listeners = [];//自定义监听事件
    this.handlers = {};
    if (options.setKeyBoardEventListener) {
      options.setKeyBoardEventListener(this);
    } else {
      this.setKeyBoardEventListener();
    }
  }

  getItems(){
    return this.items;
  }

  getEleByPath(xpath) {
    return find(xpath);
  }

  async getElementByPathSync(string) {
    if (!string) return false;
    return await this.getpath(string);
  }

  path(string) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let e = find(string);
        if (e) {
          resolve(e);
        } else {
          return reject(string);
        }
      }, 500);
    });
  }

  getpath(string) {
    return new Promise((resolve, reject) => {
      let _this = this;
      let count = 0;
      !function gp() {
        if (count >= 2) {
          resolve(_this.pointer.$el);
          return false;
        }
        count++;
        _this.path(string).then(val => {
          resolve(val);
        }).catch(reason => {
          gp(reason);
        });
      }(string);
    });
  }

  getPointerPosition() {
    let path = getXPath(this.pointer.$el);
    return { xpath: path };
  }

  enter() {
  }

  onback() {
  }

  back() {
    this.onback && this.onback();
  }

  focus(target) {
  }

  getFoucsClass() {
    let focus_class = this.pointer.focus_class || this.focus_class;
    return focus_class;
  }

  left() {
    this.move("left");
  }

  right() {
    this.move("right");
  }

  up() {
    this.move("up");
  }

  down() {
    this.move("down");
  }

  async move(target) {
    if (!this.items.length) return;
    !this.pointer && (this.pointer = this.items[0]);
    let next, nextGroup, type = typeof target;
    !target && (target = this.pointer);
    if (type === "object") {
      if (target.$el) {
        target = target.$el;
      } else if (target.nodeType) {
      } else if (await target) {
        target = await target;
      }
    }
    if (type === "object" && target.nodeType) {
      if (target.dataset) next = this.items.filter(item => item.id === target.dataset.id)[0];
      else next=this.items.filter(item => item.id === target.attributes.id)[0];
    } else if (/up|down|right|left/gi.test(target)) {
      next = this.pointer && this.next(target);
    }
    if (next) {
      this.setGroup();
      if ($(next.$el).parents(this.options.group_name).length) {
        nextGroup = this.groups.filter(group => {
          if (group.$el.dataset) return group.groupId === $(next.$el).parents(this.options.group_name)[0].dataset["groupId"];
          else return group.groupId === $(next.$el).parents(this.options.group_name)[0].attributes["groupId"];
        })[0];
      }
      if (/up|down|right|left/gi.test(target)) {
        if (!(this.group === nextGroup) && this.group) {
          if (this.group.listener[target]) {
            return this.group.listener[target]();
          }
        }
      }

      if(this.pointer) {
        this.pointer.isFocus=false;
        $(this.pointer.$el).removeClass(this.getFoucsClass())
        if(this.pointer.listener.blur){
          this.pointer.listener.blur();
        }
      }
      if(this.listeners.indexOf('move') > -1) {
        this.emit({type:'move',target: {direction:target,next:next}})
      }
      this.pointer = next;
      this.setGroup();
      this.pointer.isFocus=true;
      $(this.pointer.$el).addClass(this.getFoucsClass());
      this.pointer.listener.focus && this.pointer.listener.focus();
    } else {
      if (/up|down|right|left/gi.test(target)) {
        if (this.group) {
          if (this.group.listener[target]) {
            return this.group.listener[target]();
          }
        }
      }
    }
  }

  next(dir) {
    let pointer = this.pointer,
      pinfo = this.caculate.infos(this.pointer.$el);

    let ninfo, pDvalue, mDvalue, pref, min;
    this.items.forEach(item => {
      if (item !== pointer) {
        ninfo = this.caculate.infos(item.$el, dir);
        //TODO 后期增加 visable 判断，如果元素不在可视区域，则不考虑
        var offset = $(item.$el).offset();
        if (offset.left < -100 || offset.top < -100) {
          return;
        }

        var rule = this.caculate.rules(pinfo, ninfo, pDvalue, mDvalue, dir);
        pDvalue = rule.pDvalue;
        mDvalue = rule.mDvalue;
        rule.pref && (pref = item);
        rule.min && (min = item);
      }
    });
    if (dir === "left" || dir === "right") {
      return pref;
    } else if (dir === "up" || dir === "down") {
      return pref || min;
    }
  }

  setGroup() {
    !this.pointer && (this.pointer = this.items[0]);
    if ($(this.pointer.$el).parents(this.options.group_name).length) {
      this.group = this.groups.filter(group => {
        if (group.$el.dataset) return group.groupId === $(this.pointer.$el).parents(this.options.group_name)[0].dataset["groupId"];
        else  return group.groupId === $(this.pointer.$el).parents(this.options.group_name)[0].attributes["groupId"];
      })[0];
    } else {
      this.group = false;
    }
    return false;
  }

  setKeyBoardEventListener() {
    document.onkeydown = document.onsystemevent = document.onirkeypress= document.onkeypress = (event)=> {
      const keyCode = event.which ? event.which : event.keyCode;
      event.stopPropagation();
      event.preventDefault();

      this.keyActions.UP.push(...[19, 38]);
      this.keyActions.DOWN.push(...[20, 47, 40]);
      this.keyActions.LEFT.push(...[29, 21, 37]);
      this.keyActions.RIGHT.push(...[22, 32, 39]);
      this.keyActions.ENTER.push(...[73, 66, 23, 13, 1]);
      this.keyActions.BACK.push(...[4, 27, 8]);
      this.keyActions.PAGEACTION = [33, 34];
      this.keyActions.NUMBER = [49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105];
      this.keyActions.VOLUME = [259, 260];
      this.keyActions.TOGGLE = [263]
      this.eventHandler(keyCode)
    }

  }

  eventHandler(keyCode) {
    if (!this.items.length) {
      !this.pointer && (this.pointer = this.items[0]);
    }
    let keyAction = null;
    for (let actions in this.keyActions) {

      if (this.keyActions[actions].indexOf(keyCode) !== -1) {
        keyAction = actions;
        break;
      }
    }
    if (keyAction) {
      if (this.pointer) {
        switch (keyAction) {
          case "ENTER":
            this.pointer.listener.click && this.pointer.listener.click();
            break;
          case "DOWN":
            if (this.pointer.listener.down) {
              this.pointer.listener.down(this.pointer, this.down);
            } else {
              this.down();
            }
            break;
          case "UP":
            if (this.pointer.listener.up) {
              this.pointer.listener.up(this.pointer, this.up);
            } else {
              this.up();
            }
            break;
          case "LEFT":
            if (this.pointer.listener.left) {
              this.pointer.listener.left(this.pointer, this.left);
            } else {
              this.left();
            }
            break;
          case "RIGHT":
            if (this.pointer.listener.right) {
              this.pointer.listener.right(this.pointer, this.right);
            } else {
              this.right();
            }
            break;
        }
      }
      if (keyAction === "BACK") {
        this.back();
      }
      // console.log(this.actions)
      if (this.actions.includes(keyAction.toLowerCase())) {
        console.log(this.actions[keyAction.toLowerCase()],keyCode)
        this.actions && ((typeof this.actions[keyAction.toLowerCase()] === "function") && this.actions[keyAction.toLowerCase()](keyCode));
      }

    }
  }

  registerGroup(group) {
    this.groups.push(group);
  }

  updateGroup(nGroup) {
    this.groups.forEach(group => {
      if (nGroup.groupId === group.groupId) {
        Object.assign(group, nGroup);
      }
    });
  }

  registerItem(item) {
    this.items.push(item);
    if (item.isDefault) {
      this.pointer = item;
    }
  }

  updateItem(nItem) {
    this.items.forEach(item => {
      if (item.id === nItem.id) {
        Object.assign(item, nItem);
      }
    });
  }

  clear() {
    this.pointer = false;
    this.groups = [];
    this.items = [];
    this.onback = null;
  }

  on(type, handler){
    // type: show, shown, hide, hidden, close, confirm
    if(typeof this.handlers[type] === 'undefined') {
      this.handlers[type] = [];
    }
    this.listeners.push(type);
    this.handlers[type].push(handler);
    return this;
  }
  off(type, handler){
    if(this.handlers[type] instanceof Array) {
      var handlers = this.handlers[type];
      for(var i = 0, len = handlers.length; i < len; i++) {
        if(handlers[i] === handler) {
          break;
        }
      }
      this.listeners.splice(i, 1);
      handlers.splice(i, 1);
      return this;
    }
  }
  emit(event){
    if(!event.target) {
      event.target = this;
    }
    if(this.handlers[event.type] instanceof Array) {
      var handlers = this.handlers[event.type];
      for(var i = 0, len = handlers.length; i < len; i++) {
        handlers[i](event);
        return true;
      }
    }
    return false;
  }


}
