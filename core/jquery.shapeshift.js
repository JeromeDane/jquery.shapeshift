// Generated by CoffeeScript 1.4.0
(function() {

  (function($, window, document, undefined_) {
    var Plugin, defaults, pluginName;
    pluginName = "shapeshift";
    defaults = {
      state: 'default',
      states: {
        "default": {
          "class": 'default',
          grid: {
            columns: null,
            itemWidth: 50,
            gutterX: 10,
            gutterY: 20,
            paddingY: 30,
            paddingX: 30
          },
          init: {
            "class": 'init',
            stagger: 2
          }
        },
        secondary: {
          grid: {
            columns: null,
            itemWidth: 40,
            gutterX: 30,
            gutterY: 40,
            paddingY: 20,
            paddingX: 20
          }
        }
      },
      responsive: {
        refreshRate: 100
      },
      resize: {
        refreshRate: 10,
        snapTo: [[100, 100], [200, 200], [300, 300], [400, 400]],
        increment: [60, 60],
        minHeight: 40,
        minWidth: 40
      }
    };
    Plugin = function(element, options) {
      this.options = $.extend({}, defaults, options);
      this.$container = $(element);
      this.init();
      return this;
    };
    Plugin.prototype = {
      init: function() {
        this._createGlobals();
        this._initializeGrid();
        this._enableFeatures();
        this._parseChildren();
        return this.render();
      },
      _createGlobals: function() {
        this.idCount = 0;
        this.children = [];
        return this.state = this.options.states[this.options.state];
      },
      _initializeGrid: function() {
        var colWidth;
        this.grid = $.extend({}, this.state.grid);
        colWidth = this.grid.itemWidth + this.grid.gutterX;
        this.grid.colWidth = colWidth;
        this.grid.percentColWidth = false;
        if (typeof colWidth === "string" && colWidth.indexOf("%") >= 0) {
          this.grid.percentColWidth = colWidth;
        }
        return this._calculateGrid();
      },
      _enableFeatures: function() {
        this._enableResponsive();
        return this._enableResizing();
      },
      _parseChildren: function() {
        var $children, child, _i, _len, _results;
        $children = this.$container.children();
        _results = [];
        for (_i = 0, _len = $children.length; _i < _len; _i++) {
          child = $children[_i];
          _results.push(this.addChild(child));
        }
        return _results;
      },
      addChild: function(child) {
        var $child, id, width;
        id = this.idCount++;
        $child = $(child);
        $child.attr('data-ss-id', id);
        width = $child.outerWidth() + this.grid.gutterX;
        return this.children.push({
          id: id,
          el: $child,
          h: $child.height() + this.grid.gutterY,
          span: Math.round(width / this.grid.colWidth),
          initialized: false
        });
      },
      _reparseChild: function(id, width, height) {
        var child;
        child = this._getChildById(id);
        width || (width = child.el.outerWidth());
        width += this.grid.gutterX;
        height || (height = child.el.height());
        child.h = height + this.grid.gutterY;
        return child.span = Math.ceil(width / this.grid.colWidth);
      },
      _getChildById: function(id) {
        return this.children.filter(function(child) {
          return child.id === id;
        })[0];
      },
      render: function() {
        this._calculateGrid();
        this._pack();
        return this.arrange();
      },
      _calculateGrid: function() {
        var width;
        if (this.grid.percentColWidth) {
          this.grid.colWidth = Math.floor(this.$container.width() * (parseInt(this.grid.percentColWidth) * .01));
        }
        if (!(this.state.grid.columns >= 1)) {
          width = this.$container.width() + this.grid.gutterX - (this.state.grid.paddingX * 2);
          return this.grid.columns = Math.floor(width / this.grid.colWidth);
        }
      },
      _pack: function() {
        var c, child, col, colHeights, height, i, offset, position, span, yPos, _i, _j, _len, _ref, _ref1, _results;
        colHeights = [];
        for (c = _i = 0, _ref = this.grid.columns; 0 <= _ref ? _i < _ref : _i > _ref; c = 0 <= _ref ? ++_i : --_i) {
          colHeights.push(this.grid.paddingY);
        }
        _ref1 = this.children;
        _results = [];
        for (i = _j = 0, _len = _ref1.length; _j < _len; i = ++_j) {
          child = _ref1[i];
          span = child.span;
          if (span > 1) {
            position = this._fitMinArea(colHeights, span);
            col = position.col;
            yPos = position.height;
          } else {
            col = this._fitMinIndex(colHeights);
            yPos = colHeights[col];
          }
          child.x = col * this.grid.colWidth + this.state.grid.paddingX;
          child.y = yPos;
          height = yPos + child.h;
          _results.push((function() {
            var _k, _ref2, _results1;
            _results1 = [];
            for (offset = _k = 0, _ref2 = child.span; 0 <= _ref2 ? _k < _ref2 : _k > _ref2; offset = 0 <= _ref2 ? ++_k : --_k) {
              _results1.push(colHeights[col + offset] = height);
            }
            return _results1;
          })());
        }
        return _results;
      },
      _fitMinIndex: function(array) {
        return array.indexOf(Math.min.apply(null, array));
      },
      _fitMinArea: function(array, span) {
        var area, areas, col, h, heights, max, maxHeights, offset, positions, _i, _j, _len;
        positions = array.length - span + 1;
        areas = [];
        maxHeights = [];
        for (offset = _i = 0; 0 <= positions ? _i < positions : _i > positions; offset = 0 <= positions ? ++_i : --_i) {
          heights = array.slice(0).splice(offset, span);
          max = Math.max.apply(null, heights);
          area = max;
          for (_j = 0, _len = heights.length; _j < _len; _j++) {
            h = heights[_j];
            area += max - h;
          }
          areas.push(area);
          maxHeights.push(max);
        }
        col = this._fitMinIndex(areas);
        return {
          col: col,
          height: maxHeights[col]
        };
      },
      arrange: function() {
        var $child, child, i, initialize, _i, _len, _ref, _results;
        _ref = this.children;
        _results = [];
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          child = _ref[i];
          $child = child.el;
          initialize = !child.initialized;
          if (initialize) {
            $child.addClass(this.state.init["class"]);
            child.initialized = true;
          }
          this._move(child);
          if (initialize) {
            _results.push(this._delayedMove(child, this.state.init.stagger * i));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      },
      _delayedMove: function(child, speed) {
        var _this = this;
        if (speed == null) {
          speed = 0;
        }
        return setTimeout(function() {
          child.initialized = true;
          child.el.addClass(_this.state["class"]).removeClass(_this.state.init["class"]);
          return _this._move(child);
        }, speed);
      },
      _move: function(child, init) {
        return child.el.css({
          transform: 'translate(' + child.x + 'px, ' + child.y + 'px)'
        });
      },
      setState: function(state_name) {
        var state;
        state = this.options.states[state_name];
        if (state) {
          this.state = state;
          this._initializeGrid();
          return this.render();
        } else {
          return console.error("Shapeshift does not recognize the state '" + state_name + "', are you sure it's defined?");
        }
      },
      _enableResponsive: function() {
        var finalTimeout, resizing, speed,
          _this = this;
        resizing = false;
        finalTimeout = null;
        speed = this.options.responsive.refreshRate;
        return $(window).on('resize.ss-responsive', function() {
          if (!resizing) {
            resizing = true;
            clearTimeout(finalTimeout);
            finalTimeout = setTimeout(function() {
              return _this.render();
            }, speed * 2);
            setTimeout(function() {
              return resizing = false;
            }, speed);
            return _this.render();
          }
        });
      },
      _enableResizing: function() {
        var $el, id, minHeight, minWidth, mousedown, resizing, snapIncrements, speed, startH, startW, startX, startY, xIncrement, yIncrement,
          _this = this;
        mousedown = resizing = false;
        startH = startW = startX = startY = $el = id = null;
        minWidth = this.options.resize.minWidth;
        minHeight = this.options.resize.minHeight;
        speed = this.options.resize.refreshRate;
        snapIncrements = this.options.resize.snapTo;
        if (snapIncrements === null) {
          xIncrement = this.options.resize.increment[0];
          yIncrement = this.options.resize.increment[1];
        }
        this.$container.on("mousedown.ss-resize", ".resizeToggle", function(e) {
          $el = $(this).closest("*[data-ss-id]");
          id = parseInt($el.attr('data-ss-id'));
          mousedown = true;
          startH = $el.height();
          startW = $el.outerWidth();
          startX = e.pageX;
          return startY = e.pageY;
        });
        return $(window).on("mousemove.ss-resize mouseup.ss-resize", function(e) {
          var closest, i, increment, minDistance, newHeight, newWidth, _i, _len;
          if (mousedown) {
            if (e.type === "mousemove" && !resizing) {
              resizing = true;
              if (snapIncrements === null) {
                newHeight = e.pageY - startY;
                newWidth = e.pageX - startX;
                newWidth = startW + (Math.ceil(newWidth / xIncrement) * xIncrement);
                if (newWidth <= minWidth) {
                  newWidth = minWidth;
                }
                newHeight = startH + (Math.ceil(newHeight / yIncrement) * yIncrement);
                if (newHeight <= minHeight) {
                  newHeight = newHeight;
                }
              } else {
                newHeight = startH + e.pageY - startY;
                newWidth = startW + e.pageX - startX;
                closest = 0;
                minDistance = 9999999;
                for (i = _i = 0, _len = snapIncrements.length; _i < _len; i = ++_i) {
                  increment = snapIncrements[i];
                  if (increment[0] <= newWidth || increment[1] <= newHeight) {
                    closest = i;
                  }
                }
                newWidth = snapIncrements[closest][0];
                newHeight = snapIncrements[closest][1];
              }
              $el.css({
                width: newWidth
              });
              $el.css({
                height: newHeight
              });
              _this._reparseChild(id, newWidth, newHeight);
              _this.render();
              setTimeout(function() {
                return resizing = false;
              }, speed);
            }
            if (e.type === "mouseup") {
              mousedown = false;
              return startH = startW = startX = startY = $el = id = null;
            }
          }
        });
      },
      shuffle: function() {
        var a, i, j, t;
        a = this.children;
        i = a.length;
        while (--i > 0) {
          j = ~~(Math.random() * (i + 1));
          t = a[j];
          a[j] = a[i];
          a[i] = t;
        }
        this.children = a;
        return this.render();
      }
    };
    return $.fn[pluginName] = function(options) {
      var args, returns, scoped_name;
      args = arguments;
      scoped_name = "plugin_" + pluginName;
      if (options === undefined || typeof options === "object") {
        return this.each(function() {
          if (!$.data(this, scoped_name)) {
            return $.data(this, scoped_name, new Plugin(this, options));
          }
        });
      } else if (typeof options === "string" && options[0] !== "_" && options !== "init") {
        returns = void 0;
        this.each(function() {
          var instance;
          instance = $.data(this, scoped_name);
          if (instance instanceof Plugin && typeof instance[options] === "function") {
            returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
          }
          if (options === "destroy") {
            return $.data(this, scoped_name, null);
          }
        });
        if (returns !== undefined) {
          return returns;
        } else {
          return this;
        }
      }
    };
  })(jQuery, window, document);

}).call(this);
