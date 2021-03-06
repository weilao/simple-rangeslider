/*! Simple Rangeslider - v0.1.0 - 2014-09-26
* https://github.com/weilao/simple-rangeslider
* Copyright (c) 2014 Weilao; Licensed MIT */
(function ($) {
    var namespace = 'rangeslider';

    $.fn[namespace] = function (options) {
        return this.each(function () {
            new RangeSlider(this, options);
        });
    };

    var RangeSlider = function (el, options) {
        var self = this;
        var $slider, $sliderHandler, sliderWidth, handlerWidth, id, initialValue;

        $slider = $(el);

        initialValue = $slider.attr('value');
        id = $slider.attr('id');

        this.options = $.extend(true, {}, $[namespace].options, {
            min: $slider.attr('min'),
            max: $slider.attr('max')
        }, options);


        $slider
            .attr({
                id: id,
                "class": namespace,
                min: this.options.min,
                max: this.options.max
            })
            .css('position', 'relative')
            .val(initialValue);

        // Create handler
        $sliderHandler = $('<div class="' + namespace + '-handler"></div>');
        $sliderHandler.appendTo($slider);

        this.$slider = $slider;
        this.$sliderHandler = $sliderHandler;
        this.sliderWidth = sliderWidth = $slider.width();
        this._sliderOffsetLeft = $slider.offset().left;
        this._handlerWidth = handlerWidth = $sliderHandler.width();
        this._maxLeft = sliderWidth - handlerWidth / 2;
        this._minLeft = -handlerWidth / 2;

        $sliderHandler
            .css({
                position: 'absolute',
                fontSize: '0' // IE6: Height never smaller fontSize
            })
            // IE6: $slider.height() is wrong if $sliderHandler's position wasn't absolute
            .css({
                left: -this._handlerWidth / 2,
                top: -$slider.height() / 2
            });

        $slider.on('mousedown.' + namespace, function (e) {
            e.preventDefault();
            self.update(e);
            $(document)
                .on('mousemove.' + namespace, $.proxy(self.update, self))
                .on('mouseup.' + namespace, function () {
                    $(document).off('.' + namespace);
                });
        });

        $sliderHandler.on('mousedown.' + namespace, function (e) {
            e.preventDefault();
            $(document)
                .on('mousemove.' + namespace, $.proxy(self.update, self))
                .on('mouseup.' + namespace, function () {
                    $(document).off('.' + namespace);
                });
        });

        $slider.data('slider', this);
    };

    $[namespace] = $.extend(RangeSlider, {
        prototype: {
            _percent: null,

            getMin: function () {
                return this.options.min;
            },

            getMax: function () {
                return this.options.max;
            },

            getValue: function () {
                return this.getPercent() * this.options.max;
            },

            setValue: function (value) {
                var percent = (value - this.options.min) / (this.options.max - this.options.min);
                this.setHandlerLeft(percent * this._maxLeft - this._handlerWidth / 2);
            },

            getPercent: function () {
                return this._percent;
            },

            getHandlerLeft: function () {
                return this._handlerLeft;
            },

            setHandlerLeft: function (left) {
                left = Math.max(left, this._minLeft);
                left = Math.min(left, this._maxLeft);
                this.$sliderHandler.css('left', left);
                this._handlerLeft = left;
                this._percent = (this._handlerLeft + this._handlerWidth / 2 ) /
                    (this._maxLeft - this._minLeft);
            },

            update: function (e) {
                e.preventDefault();

                // Update slider offset, because I want to ensure the offset
                // is correct even slider's position was changed.
                this._sliderOffsetLeft = this.$slider.offset().left;

                this.setHandlerLeft(e.pageX - this._sliderOffsetLeft - this._handlerWidth / 2);
                // Update value
                var value = this.getPercent() * (this.options.max - this.options.min) + this.options.min;
                this.$slider.val(value);
                this.$slider.trigger('change.' + namespace, [value, this.getPercent()]);
            }
        }
    });

    // Default options.
    $[namespace].options = {
        min: 0,
        max: 100
    };
}(jQuery));