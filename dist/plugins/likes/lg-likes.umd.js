/*!
 * lightgallery | 2.9.1 | April 3rd 2026
 * http://www.lightgalleryjs.com/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.lgLikes = factory());
})(this, (function () { 'use strict';

    /**
     * List of lightGallery events
     * All events should be documented here
     * Below interfaces are used to build the website documentations
     * */
    var lGEvents = {
        afterAppendSlide: 'lgAfterAppendSlide',
        init: 'lgInit',
        hasVideo: 'lgHasVideo',
        containerResize: 'lgContainerResize',
        updateSlides: 'lgUpdateSlides',
        afterAppendSubHtml: 'lgAfterAppendSubHtml',
        beforeOpen: 'lgBeforeOpen',
        afterOpen: 'lgAfterOpen',
        slideItemLoad: 'lgSlideItemLoad',
        beforeSlide: 'lgBeforeSlide',
        afterSlide: 'lgAfterSlide',
        posterClick: 'lgPosterClick',
        dragStart: 'lgDragStart',
        dragMove: 'lgDragMove',
        dragEnd: 'lgDragEnd',
        beforeNextSlide: 'lgBeforeNextSlide',
        beforePrevSlide: 'lgBeforePrevSlide',
        beforeClose: 'lgBeforeClose',
        afterClose: 'lgAfterClose',
        rotateLeft: 'lgRotateLeft',
        rotateRight: 'lgRotateRight',
        flipHorizontal: 'lgFlipHorizontal',
        flipVertical: 'lgFlipVertical',
        autoplay: 'lgAutoplay',
        autoplayStart: 'lgAutoplayStart',
        autoplayStop: 'lgAutoplayStop',
    };

    var Likes = /** @class */ (function () {
        function Likes(instance) {
            this.linkClass = 'lg-likes';
            this.baseLinkClasses = ['lg-icon', this.linkClass];
            this.core = instance;
        }
        Likes.prototype.init = function () {
            this.appendLikesIcon();
            this.bindEvents();
            this.updateLikesState(this.core.index);
        };
        Likes.prototype.appendLikesIcon = function () {
            if (this.core.outer.find("." + this.linkClass).get()) {
                return;
            }
            this.core.$toolbar.append("<button\n      type=\"button\"\n      aria-label=\"Toggle like\"\n      class=\"" + this.baseLinkClasses.join(' ') + "\"\n   >\n                <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-heart-icon lucide-heart\"><path d=\"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z\"/></svg>\n            </button>");
        };
        Likes.prototype.bindEvents = function () {
            var _this = this;
            this.core.LGel.on(lGEvents.afterOpen + ".likes", function () {
                _this.updateLikesState(_this.core.index);
            });
            this.core.LGel.on(lGEvents.afterSlide + ".likes", function (event) {
                _this.updateLikesState(event.detail.index);
            });
            this.core.LGel.on(lGEvents.updateSlides + ".likes", function () {
                _this.updateLikesState(_this.core.index);
            });
        };
        Likes.prototype.updateLikesState = function (index) {
            var _a;
            var $btn = this.core.outer.find("." + this.linkClass).first();
            if (!$btn.get())
                return;
            $btn.removeClass('lg-hide');
            var sourceItem = (_a = this.core.items) === null || _a === void 0 ? void 0 : _a[index];
            var imageId = sourceItem === null || sourceItem === void 0 ? void 0 : sourceItem.getAttribute('data-image-id');
            var isLiked = !!imageId &&
                !!document.querySelector(".sp-gallery-like-icon[data-image-id=\"" + imageId + "\"].sp-gallery-liked-image");
            if (isLiked) {
                $btn.addClass('sp-gallery-liked-image');
            }
            else {
                $btn.removeClass('sp-gallery-liked-image');
            }
        };
        Likes.prototype.destroy = function () {
            this.core.outer.find("." + this.linkClass).remove();
            this.core.LGel.off('.likes');
        };
        Likes.pluginName = 'likes';
        return Likes;
    }());

    return Likes;

}));
//# sourceMappingURL=lg-likes.umd.js.map
