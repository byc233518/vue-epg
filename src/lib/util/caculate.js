export default class Caculate {
  infos(target) {
    var info;
    try {
      info = target.getBoundingClientRect();
    } catch (e) {
      console.log('no bounding', target)
      return false
    }
    return {
      left: info.left,
      right: info.left + info.width,
      up: info.top,
      down: info.top + info.height,
      x:info.x,
      y:info.y
    };
  }

  distance(cx, cy, nx, ny) {
    return parseInt(Math.sqrt(Math.pow(cx - nx, 2) + Math.pow(cy - ny, 2)));
  }

  contains(cmin, cmax, nmin, nmax) {
    return (cmax - cmin) + (nmax - nmin) >= Math.max(cmin, cmax, nmin, nmax) - Math.min(cmin, cmax, nmin, nmax);
  }

  rules(pinfo, ninfo, pDvalue, mDvalue, dir) {
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

  hasClass(elements, cName) {
    return !!elements.className.match(new RegExp("(\\s|^)" + cName + "(\\s|$)")); // ( \\s|^ ) 判断前面是否有空格 （\\s | $ ）判断后面是否有空格 两个感叹号为转换为布尔值 以方便做判断
  }

  addClass(elements, cName) {
    if (!this.hasClass(elements, cName)) {
      elements.className += " " + cName;
    }
  }

  removeClass(elements, cName) {
    if (this.hasClass(elements, cName)) {
      elements.className = elements.className.replace(new RegExp("(\\s|^)" + cName + "(\\s|$)"), " "); // replace方法是替换
    }
  }
}
