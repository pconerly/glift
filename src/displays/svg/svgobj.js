glift.displays.svg.createObj = function(type, attrObj) {
   return new glift.displays.svg.SvgObj(type, attrObj);
};

glift.displays.svg.svg = function(attrObj) {
  return new glift.displays.svg.SvgObj('svg', attrObj)
      .attr('version', '1.1')
      .attr('xmlns', 'http://www.w3.org/2000/svg');
};

glift.displays.svg.circle = function(attrObj) {
  return new glift.displays.svg.SvgObj('circle', attrObj);
};

glift.displays.svg.path = function(attrObj) {
  return new glift.displays.svg.SvgObj('path', attrObj);
};

glift.displays.svg.rect = function(attrObj) {
  return new glift.displays.svg.SvgObj('rect', attrObj);
};

glift.displays.svg.image = function(attrObj) {
  return new glift.displays.svg.SvgObj('image', attrObj);
};

glift.displays.svg.text = function(attrObj) {
  return new glift.displays.svg.SvgObj('text', attrObj);
};

glift.displays.svg.group = function() {
  return new glift.displays.svg.SvgObj('g');
};

glift.displays.svg.SvgObj = function(type, attrObj) {
  this._type = type;
  this._attrMap =  attrObj || {};
  this._children = [];
  this._idMap = {};
  this._text = '';
  this._data = undefined;
};

glift.displays.svg.SvgObj.prototype = {
  /**
   * Attach content to a div.
   */
  attachToParent: function(divId) {
    var svgContainer = document.getElementById(divId);
    if (svgContainer) {
      svgContainer.appendChild(this.asElement());
    }
  },

  /**
   * Remove from the element from the DOM.
   */
  removeFromDom: function() {
    if (this.attr('id')) {
      var elem = document.getElementById(this.attr('id'));
      if (elem) { elem.parentNode.removeChild(elem); }
    }
    return this;
  },

  /**
   * Turn this node (and all children nodes) into SVG elements.
   */
  asElement: function() {
    var elem = document.createElementNS(
        "http://www.w3.org/2000/svg", this._type);
    for (var attr in this._attrMap) {
      if (attr === 'xlink:href') {
        elem.setAttributeNS(
            'http://www.w3.org/1999/xlink', 'href', this._attrMap[attr]);
      } else {
        elem.setAttribute(attr, this._attrMap[attr]);
      }
    }
    if (this._type === 'text') {
      var textNode = document.createTextNode(this._text);
      elem.appendChild(textNode);
    }
    for (var i = 0, len = this._children.length; i < len; i++) {
      elem.appendChild(this._children[i].asElement());
    }
    return elem;
  },

  /**
   * Return the string form of the svg object.
   */
  render: function() {
    var base = '<' + this._type;
    for (var key in this._attrMap) {
      base += ' ' + key + '="' + this._attrMap[key] + '"';
    }
    base += '>' + this._text;
    if (this._children.length > 0) {
      var baseBuffer = [base];
      for (var i = 0, ii = this._children.length; i < ii; i++) {
        baseBuffer.push(this._children[i].render());
      }
      baseBuffer.push('</' + this._type + '>');
      base = baseBuffer.join("\n");
    } else {
      base += '</' + this._type + '>';
    }
    return base;
  },

  /**
   * Set or get an SVG attribute.
   */
  attr: function(key, value) {
    if (value !== undefined) {
      this._attrMap[key] = value;
      return this;
    } else {
      return this._attrMap[key];
    }
  },

  /**
   * Set or get all the an SVG attributes.
   */
  attrObj: function(obj) {
    if (obj !== undefined && glift.util.typeOf(obj) === 'object') {
      this._attrMap = obj;
      return this;
    } else {
      return this._attrMap;
    }
  },

  /**
   * Update a particular attribute in the DOM.
   */
  updateAttrInDom: function(attr) {
    var elem = document.getElementById(this.attr('id'))
    if (elem && attr && this.attr(attr)) {
      elem.setAttribute(attr, this.attr(attr));
    }
    return this;
  },

  /**
   * Set some internal data. Note: this data is not attached when the element is
   * generated.
   */
  data: function(data) {
    if (data !== undefined) {
      this._data = data;
      return this;
    } else {
      return this._data
    }
  },

  /**
   * Append some text. Ususally only for the 'text' element.
   */
  text: function(text) {
    if (text !== undefined) {
      this._text = "" + text
      return this;
    } else {
      return this._text;
    }
  },

  /**
   * Get child from an Id.
   */
  child: function(id) {
    return this._idMap[id];
  },

  /**
   * Remove child, based on id.
   */
  rmChild: function(id) {
    delete this._idMap[id];
    return this;
  },

  /**
   * Get all the Children.
   */
  children: function() {
    return this._children;
  },

  /** Empty out all the children. */
  emptyChildren: function() {
    this._children = [];
    return this;
  },

  /** Empty out all the children and update. */
  emptyChildrenAndUpdate: function() {
    this.emptyChildren();
    var elem = document.getElementById(this.attr('id'))
    while (elem && elem.firstChild) {
      elem.removeChild(elem.firstChild);
    }
    return this;
  },

  /**
   * Add an already existing child.
   *
   * Returns the object
   */
  append: function(obj) {
    if (obj.attr('id') !== undefined) {
      this._idMap[obj.attr('id')] = obj;
    }
    this._children.push(obj);
    return this;
  },

  /**
   * Add a new svg object child.
   */
  appendNew: function(type, attrObj) {
    var obj = glift.displays.svg.createObj(type, attrObj);
    return this.append(obj);
  },

  /**
   * Append an SVG element and attach to the DOM.
   */
  appendAndAttach: function(obj) {
    this.append(obj);
    if (this.attr('id')) {
      obj.attachToParent(this.attr('id'))
    }
  },

  copyNoChildren: function() {
    var newAttr = {};
    for (var key in this._attrMap) {
      newAttr[key] = this._attrMap[key];
    }
    return glift.displays.svg.createObj(this._type, newAttr);
  }
};
