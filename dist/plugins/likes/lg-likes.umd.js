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
            this.updateLikesLink(this.core.index);
        };
        Likes.prototype.appendLikesIcon = function () {
            if (this.core.outer.find("." + this.linkClass).get()) {
                return;
            }
            this.core.$toolbar.append("<a\n                href=\"#\"\n                target=\"_blank\"\n                rel=\"noopener\"\n                aria-label=\"View likes\"\n                class=\"" + this.baseLinkClasses.join(' ') + "\"\n            >\n                <svg viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" aria-hidden=\"true\" focusable=\"false\">\n                    <path fill=\"currentColor\" d=\"M12 21.35 10.55 20C5.4 15.24 2 12.09 2 8.25 2 5.1 4.42 2.75 7.5 2.75c1.74 0 3.41.81 4.5 2.09 1.09-1.28 2.76-2.09 4.5-2.09 3.08 0 5.5 2.35 5.5 5.5 0 3.84-3.4 6.99-8.55 11.76L12 21.35Z\"/>\n                </svg>\n            </a>");
        };
        Likes.prototype.bindEvents = function () {
            var _this = this;
            this.core.LGel.on(lGEvents.afterOpen + ".likes", function () {
                _this.updateLikesLink(_this.core.index);
            });
            this.core.LGel.on(lGEvents.afterSlide + ".likes", function (event) {
                _this.updateLikesLink(event.detail.index);
            });
            this.core.LGel.on(lGEvents.updateSlides + ".likes", function () {
                _this.updateLikesLink(_this.core.index);
            });
        };
        Likes.prototype.getLikesUrl = function (index) {
            var _a;
            var galleryItem = this.core.galleryItems[index];
            var itemLikesUrl = (galleryItem === null || galleryItem === void 0 ? void 0 : galleryItem.likesUrl) || (galleryItem === null || galleryItem === void 0 ? void 0 : galleryItem.likeUrl) || (galleryItem === null || galleryItem === void 0 ? void 0 : galleryItem.shutterpressLikesUrl) || (galleryItem === null || galleryItem === void 0 ? void 0 : galleryItem.shutterpressGalleryLikesUrl);
            if (itemLikesUrl) {
                return itemLikesUrl;
            }
            var sourceItem = (_a = this.core.items) === null || _a === void 0 ? void 0 : _a[index];
            return ((sourceItem === null || sourceItem === void 0 ? void 0 : sourceItem.getAttribute('data-likes-url')) || (sourceItem === null || sourceItem === void 0 ? void 0 : sourceItem.getAttribute('data-like-url')) || (sourceItem === null || sourceItem === void 0 ? void 0 : sourceItem.getAttribute('data-shutterpress-likes-url')) || (sourceItem === null || sourceItem === void 0 ? void 0 : sourceItem.getAttribute('data-shutterpress-gallery-likes-url')) ||
                undefined);
        };
        Likes.prototype.updateLikesLink = function (index) {
            var $link = this.core.outer.find("." + this.linkClass).first();
            var link = $link.get();
            if (!link) {
                return;
            }
            var likesUrl = this.getLikesUrl(index);
            if (!likesUrl) {
                $link.attr('href', '#');
                $link.addClass('lg-hide');
                link.removeAttribute('data-likes-url');
                return;
            }
            $link.removeClass('lg-hide');
            $link.attr('href', likesUrl);
            $link.attr('data-likes-url', likesUrl);
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
