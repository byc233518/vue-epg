import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _typeof from 'babel-runtime/helpers/typeof';
import _Promise from 'babel-runtime/core-js/promise';
import _regeneratorRuntime from 'babel-runtime/regenerator';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';
import _Object$assign from 'babel-runtime/core-js/object/assign';
import $ from 'n-zepto';
import { find, getXPath } from 'xpath-dom';

var Caculate = function () {
  function Caculate() {
    _classCallCheck(this, Caculate);
  }

  _createClass(Caculate, [{
    key: 'infos',
    value: function infos(target) {
      var info;
      try {
        info = target.getBoundingClientRect();
      } catch (e) {
        console.log('no bounding', target);
        return false;
      }
      return {
        left: info.left,
        right: info.left + info.width,
        up: info.top,
        down: info.top + info.height,
        x: info.x,
        y: info.y
      };
    }
  }, {
    key: 'distance',
    value: function distance(cx, cy, nx, ny) {
      return parseInt(Math.sqrt(Math.pow(cx - nx, 2) + Math.pow(cy - ny, 2)));
    }
  }, {
    key: 'contains',
    value: function contains(cmin, cmax, nmin, nmax) {
      return cmax - cmin + (nmax - nmin) >= Math.max(cmin, cmax, nmin, nmax) - Math.min(cmin, cmax, nmin, nmax);
    }
  }, {
    key: 'rules',
    value: function rules(pinfo, ninfo, pDvalue, mDvalue, dir) {
      var tmp, pref, min;
      if (dir === 'up') {
        if (pinfo.up >= ninfo.down) {
          tmp = this.distance(ninfo.left, ninfo.up, pinfo.left, pinfo.up);
          (!mDvalue || tmp < mDvalue) && (mDvalue = tmp, min = true);
          (!pDvalue || this.contains(ninfo.left, ninfo.right, pinfo.left, pinfo.right) && tmp < pDvalue) && (pDvalue = tmp, pref = true);
        }
      } else if (dir === 'down') {
        if (pinfo.down <= ninfo.up) {
          tmp = this.distance(ninfo.left, ninfo.up, pinfo.left, pinfo.up);
          (!mDvalue || tmp < mDvalue) && (mDvalue = tmp, min = true);
          (!pDvalue || this.contains(ninfo.left, ninfo.right, pinfo.left, pinfo.right) && tmp < pDvalue) && (pDvalue = tmp, pref = true);
        }
      } else if (dir === 'left') {
        if (pinfo.left >= ninfo.right) {
          tmp = this.distance(ninfo.left, ninfo.up, pinfo.left, pinfo.up);
          (!mDvalue || tmp < mDvalue) && (mDvalue = tmp, min = true);
          (!pDvalue || this.contains(ninfo.up, ninfo.down, pinfo.up, pinfo.down) && tmp < pDvalue) && (pDvalue = tmp, pref = true);
        }
      } else if (dir === 'right') {
        if (pinfo.right <= ninfo.left) {

          tmp = this.distance(ninfo.left, ninfo.up, pinfo.left, pinfo.up);
          (!mDvalue || tmp < mDvalue) && (mDvalue = tmp, min = true);
          (!pDvalue || this.contains(ninfo.up, ninfo.down, pinfo.up, pinfo.down) && tmp < pDvalue) && (pDvalue = tmp, pref = true);
        }
      }
      return {
        pDvalue: pDvalue,
        mDvalue: mDvalue,
        pref: pref,
        min: min
      };
    }
  }, {
    key: 'hasClass',
    value: function hasClass(elements, cName) {
      return !!elements.className.match(new RegExp("(\\s|^)" + cName + "(\\s|$)")); // ( \\s|^ ) 判断前面是否有空格 （\\s | $ ）判断后面是否有空格 两个感叹号为转换为布尔值 以方便做判断
    }
  }, {
    key: 'addClass',
    value: function addClass(elements, cName) {
      if (!this.hasClass(elements, cName)) {
        elements.className += " " + cName;
      }
    }
  }, {
    key: 'removeClass',
    value: function removeClass(elements, cName) {
      if (this.hasClass(elements, cName)) {
        elements.className = elements.className.replace(new RegExp("(\\s|^)" + cName + "(\\s|$)"), " "); // replace方法是替换
      }
    }
  }]);

  return Caculate;
}();

var EpgService = function () {
  function EpgService(options) {
    _classCallCheck(this, EpgService);

    var default_options = {
      focus_class: "focus",
      back: this.back,
      group_name: ".group"
    };
    var config = _Object$assign(default_options, options);
    this.options = config;
    this.focus_class = config.focus_class;
    this.back = config.back;
    this.caculate = new Caculate();
    this.pointer = null; //当前指针元素
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
    this.listeners = []; //自定义监听事件
    this.handlers = {};
    if (options.setKeyBoardEventListener) {
      options.setKeyBoardEventListener(this);
    } else {
      this.setKeyBoardEventListener();
    }
  }

  _createClass(EpgService, [{
    key: "getItems",
    value: function getItems() {
      return this.items;
    }
  }, {
    key: "getEleByPath",
    value: function getEleByPath(xpath) {
      return find(xpath);
    }
  }, {
    key: "getElementByPathSync",
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(string) {
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (string) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return", false);

              case 2:
                _context.next = 4;
                return this.getpath(string);

              case 4:
                return _context.abrupt("return", _context.sent);

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getElementByPathSync(_x) {
        return _ref.apply(this, arguments);
      }

      return getElementByPathSync;
    }()
  }, {
    key: "path",
    value: function path(string) {
      return new _Promise(function (resolve, reject) {
        setTimeout(function () {
          var e = find(string);
          if (e) {
            resolve(e);
          } else {
            return reject(string);
          }
        }, 500);
      });
    }
  }, {
    key: "getpath",
    value: function getpath(string) {
      var _this2 = this;

      return new _Promise(function (resolve, reject) {
        var _this = _this2;
        var count = 0;
        !function gp() {
          if (count >= 2) {
            resolve(_this.pointer.$el);
            return false;
          }
          count++;
          _this.path(string).then(function (val) {
            resolve(val);
          }).catch(function (reason) {
            gp(reason);
          });
        }(string);
      });
    }
  }, {
    key: "getPointerPosition",
    value: function getPointerPosition() {
      var path = getXPath(this.pointer.$el);
      return { xpath: path };
    }
  }, {
    key: "enter",
    value: function enter() {}
  }, {
    key: "onback",
    value: function onback() {}
  }, {
    key: "back",
    value: function back() {
      this.onback && this.onback();
    }
  }, {
    key: "focus",
    value: function focus(target) {}
  }, {
    key: "getFoucsClass",
    value: function getFoucsClass() {
      var focus_class = this.pointer.focus_class || this.focus_class;
      return focus_class;
    }
  }, {
    key: "left",
    value: function left() {
      this.move("left");
    }
  }, {
    key: "right",
    value: function right() {
      this.move("right");
    }
  }, {
    key: "up",
    value: function up() {
      this.move("up");
    }
  }, {
    key: "down",
    value: function down() {
      this.move("down");
    }
  }, {
    key: "move",
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(target) {
        var _this3 = this;

        var next, nextGroup, type;
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (this.items.length) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt("return");

              case 2:
                !this.pointer && (this.pointer = this.items[0]);
                next = void 0, nextGroup = void 0, type = typeof target === "undefined" ? "undefined" : _typeof(target);

                !target && (target = this.pointer);

                if (!(type === "object")) {
                  _context2.next = 19;
                  break;
                }

                if (!target.$el) {
                  _context2.next = 10;
                  break;
                }

                target = target.$el;
                _context2.next = 19;
                break;

              case 10:
                if (!target.nodeType) {
                  _context2.next = 13;
                  break;
                }

                _context2.next = 19;
                break;

              case 13:
                _context2.next = 15;
                return target;

              case 15:
                if (!_context2.sent) {
                  _context2.next = 19;
                  break;
                }

                _context2.next = 18;
                return target;

              case 18:
                target = _context2.sent;

              case 19:
                if (type === "object" && target.nodeType) {
                  if (target.dataset) next = this.items.filter(function (item) {
                    return item.id === target.dataset.id;
                  })[0];else next = this.items.filter(function (item) {
                    return item.id === target.attributes.id;
                  })[0];
                } else if (/up|down|right|left/gi.test(target)) {
                  next = this.pointer && this.next(target);
                }

                if (!next) {
                  _context2.next = 36;
                  break;
                }

                this.setGroup();
                if ($(next.$el).parents(this.options.group_name).length) {
                  nextGroup = this.groups.filter(function (group) {
                    if (group.$el.dataset) return group.groupId === $(next.$el).parents(_this3.options.group_name)[0].dataset["groupId"];else return group.groupId === $(next.$el).parents(_this3.options.group_name)[0].attributes["groupId"];
                  })[0];
                }

                if (!/up|down|right|left/gi.test(target)) {
                  _context2.next = 27;
                  break;
                }

                if (!(!(this.group === nextGroup) && this.group)) {
                  _context2.next = 27;
                  break;
                }

                if (!this.group.listener[target]) {
                  _context2.next = 27;
                  break;
                }

                return _context2.abrupt("return", this.group.listener[target]());

              case 27:

                if (this.pointer) {
                  this.pointer.isFocus = false;
                  $(this.pointer.$el).removeClass(this.getFoucsClass());
                  if (this.pointer.listener.blur) {
                    this.pointer.listener.blur();
                  }
                }
                if (this.listeners.indexOf('move') > -1) {
                  this.emit({ type: 'move', target: { direction: target, next: next } });
                }
                this.pointer = next;
                this.setGroup();
                this.pointer.isFocus = true;
                $(this.pointer.$el).addClass(this.getFoucsClass());
                this.pointer.listener.focus && this.pointer.listener.focus();
                _context2.next = 40;
                break;

              case 36:
                if (!/up|down|right|left/gi.test(target)) {
                  _context2.next = 40;
                  break;
                }

                if (!this.group) {
                  _context2.next = 40;
                  break;
                }

                if (!this.group.listener[target]) {
                  _context2.next = 40;
                  break;
                }

                return _context2.abrupt("return", this.group.listener[target]());

              case 40:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function move(_x2) {
        return _ref2.apply(this, arguments);
      }

      return move;
    }()
  }, {
    key: "next",
    value: function next(dir) {
      var _this4 = this;

      var pointer = this.pointer,
          pinfo = this.caculate.infos(this.pointer.$el);

      var ninfo = void 0,
          pDvalue = void 0,
          mDvalue = void 0,
          pref = void 0,
          min = void 0;
      this.items.forEach(function (item) {
        if (item !== pointer) {
          ninfo = _this4.caculate.infos(item.$el, dir);
          //TODO 后期增加 visable 判断，如果元素不在可视区域，则不考虑
          var offset = $(item.$el).offset();
          if (offset.left < -100 || offset.top < -100) {
            return;
          }

          var rule = _this4.caculate.rules(pinfo, ninfo, pDvalue, mDvalue, dir);
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
  }, {
    key: "setGroup",
    value: function setGroup() {
      var _this5 = this;

      !this.pointer && (this.pointer = this.items[0]);
      if ($(this.pointer.$el).parents(this.options.group_name).length) {
        this.group = this.groups.filter(function (group) {
          if (group.$el.dataset) return group.groupId === $(_this5.pointer.$el).parents(_this5.options.group_name)[0].dataset["groupId"];else return group.groupId === $(_this5.pointer.$el).parents(_this5.options.group_name)[0].attributes["groupId"];
        })[0];
      } else {
        this.group = false;
      }
      return false;
    }
  }, {
    key: "setKeyBoardEventListener",
    value: function setKeyBoardEventListener() {
      var _this6 = this;

      document.onkeydown = document.onsystemevent = document.onirkeypress = document.onkeypress = function (event) {
        var _keyActions$UP, _keyActions$DOWN, _keyActions$LEFT, _keyActions$RIGHT, _keyActions$ENTER, _keyActions$BACK;

        var keyCode = event.which ? event.which : event.keyCode;
        event.stopPropagation();
        event.preventDefault();

        (_keyActions$UP = _this6.keyActions.UP).push.apply(_keyActions$UP, [19, 38]);
        (_keyActions$DOWN = _this6.keyActions.DOWN).push.apply(_keyActions$DOWN, [20, 47, 40]);
        (_keyActions$LEFT = _this6.keyActions.LEFT).push.apply(_keyActions$LEFT, [29, 21, 37]);
        (_keyActions$RIGHT = _this6.keyActions.RIGHT).push.apply(_keyActions$RIGHT, [22, 32, 39]);
        (_keyActions$ENTER = _this6.keyActions.ENTER).push.apply(_keyActions$ENTER, [73, 66, 23, 13, 1]);
        (_keyActions$BACK = _this6.keyActions.BACK).push.apply(_keyActions$BACK, [4, 27, 8]);
        _this6.keyActions.PAGEACTION = [33, 34];
        _this6.keyActions.NUMBER = [49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105];
        _this6.keyActions.VOLUME = [259, 260];
        _this6.keyActions.TOGGLE = [263];
        _this6.eventHandler(keyCode);
      };
    }
  }, {
    key: "eventHandler",
    value: function eventHandler(keyCode) {
      if (!this.items.length) {
        !this.pointer && (this.pointer = this.items[0]);
      }
      var keyAction = null;
      for (var actions in this.keyActions) {

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
          console.log(this.actions[keyAction.toLowerCase()], keyCode);
          this.actions && typeof this.actions[keyAction.toLowerCase()] === "function" && this.actions[keyAction.toLowerCase()](keyCode);
        }
      }
    }
  }, {
    key: "registerGroup",
    value: function registerGroup(group) {
      this.groups.push(group);
    }
  }, {
    key: "updateGroup",
    value: function updateGroup(nGroup) {
      this.groups.forEach(function (group) {
        if (nGroup.groupId === group.groupId) {
          _Object$assign(group, nGroup);
        }
      });
    }
  }, {
    key: "registerItem",
    value: function registerItem(item) {
      this.items.push(item);
      if (item.isDefault) {
        this.pointer = item;
      }
    }
  }, {
    key: "updateItem",
    value: function updateItem(nItem) {
      this.items.forEach(function (item) {
        if (item.id === nItem.id) {
          _Object$assign(item, nItem);
        }
      });
    }
  }, {
    key: "clear",
    value: function clear() {
      this.pointer = false;
      this.groups = [];
      this.items = [];
      this.onback = null;
    }
  }, {
    key: "on",
    value: function on(type, handler) {
      // type: show, shown, hide, hidden, close, confirm
      if (typeof this.handlers[type] === 'undefined') {
        this.handlers[type] = [];
      }
      this.listeners.push(type);
      this.handlers[type].push(handler);
      return this;
    }
  }, {
    key: "off",
    value: function off(type, handler) {
      if (this.handlers[type] instanceof Array) {
        var handlers = this.handlers[type];
        for (var i = 0, len = handlers.length; i < len; i++) {
          if (handlers[i] === handler) {
            break;
          }
        }
        this.listeners.splice(i, 1);
        handlers.splice(i, 1);
        return this;
      }
    }
  }, {
    key: "emit",
    value: function emit(event) {
      if (!event.target) {
        event.target = this;
      }
      if (this.handlers[event.type] instanceof Array) {
        var handlers = this.handlers[event.type];
        for (var i = 0, len = handlers.length; i < len; i++) {
          handlers[i](event);
          return true;
        }
      }
      return false;
    }
  }]);

  return EpgService;
}();

var Items = function Items(vnode, binding) {
  var _this = this;

  _classCallCheck(this, Items);

  var elm = vnode.elm;
  var id = "focus-el-" + Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 10);
  if (elm.dataset) {
    if (!elm.dataset.id) {
      elm.dataset.id = id;
    }
  } else {
    if (!elm.attributes.id) {
      elm.attributes.id = id;
    }
  }
  this.data = {};
  this.$el = elm;
  this.id = id;

  this.isDefault = !!(binding.value && binding.value.default);
  this.isFocus = false;
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
    ["click", "focus", "blur", "left", "right", "up", "down"].forEach(function (type) {
      if (vnode.data.on.hasOwnProperty(type)) {
        _this.listener[type] = vnode.data.on[type];
      }
    });
  }
};

var Groups = function Groups(vnode, binding, options) {
  var _this = this;

  _classCallCheck(this, Groups);

  var default_options = {
    group_name: "group"
  };
  var config = _Object$assign(default_options, options);
  this.group_class = config.group_name;
  var elm = vnode.elm;
  $(elm).addClass(this.group_class);
  var groupId = "group-" + Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 10);
  if (elm.dataset) {
    if (!elm.dataset.groupId) {
      elm.dataset.groupId = groupId;
    }
  } else {
    if (!elm.attributes.groupId) {
      elm.attributes.groupId = groupId;
    }
  }
  this.groupId = groupId;
  this.listener = {};
  this.$el = elm;
  if (vnode.data.on) {
    ["left", "right", "up", "down"].forEach(function (type) {
      if (vnode.data.on.hasOwnProperty(type)) {
        _this.listener[type] = vnode.data.on[type];
      }
    });
  }
};

console.log('iptv-epg is loaded');
var GlobalVue = null;
if (typeof window !== "undefined") {
    GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
    GlobalVue = global.Vue;
}

var VueEpg = function () {
    function VueEpg(options) {
        _classCallCheck(this, VueEpg);

        if (!this.epgService) this.epgService = new EpgService(options);
    }

    _createClass(VueEpg, [{
        key: "getService",
        value: function getService() {
            return this.epgService;
        }
    }, {
        key: "install",
        value: function install(GlobalVue) {
            GlobalVue.prototype.$service = this.epgService;
            var service = this.epgService;
            GlobalVue.directive("group", {
                bind: function bind(el, binding, vnode) {
                    var group = new Groups(vnode, binding);
                    service.registerGroup(group);
                },

                componentUpdated: function componentUpdated(el, binding, vnode) {
                    var item = new Groups(vnode, binding);
                    service.updateGroup(item);
                },
                unbind: function unbind(el, binding, vnode) {
                    // service.groups.splice(service.groups.findIndex(item=>item.groupId===el.dataset['groupId']),1)

                    service.groups.forEach(function (item, index) {
                        if (item.groupId === el.dataset["groupId"]) {
                            service.groups.splice(index, 1);
                        }
                    });
                }
            });
            GlobalVue.directive("items", {
                bind: function bind(el, binding, vnode) {
                    var item = new Items(vnode, binding);
                    service.registerItem(item);
                },

                componentUpdated: function componentUpdated(el, binding, vnode) {
                    var item = new Items(vnode, binding);
                    service.updateItem(item);
                },
                unbind: function unbind(el, binding, vnode) {
                    service.items.forEach(function (item, index) {
                        if (item.id === el.dataset.id) {
                            service.items.splice(index, 1);
                        }
                    });
                }
            });
            GlobalVue.mixin({
                mounted: function mounted() {
                    if (this.serviceBack) {
                        this.$service.onback = this.serviceBack;
                    }
                }
            });
        }
    }]);

    return VueEpg;
}();

export default VueEpg;
