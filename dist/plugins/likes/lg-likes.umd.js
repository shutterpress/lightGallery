/*! lightgallery | 2.9.1-shutterpress.1
 * http://www.lightgalleryjs.com/
 * Copyright (c) 2020 Sachin Neravath
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
        updateSlides: 'lgUpdateSlides',
        afterOpen: 'lgAfterOpen',
        afterSlide: 'lgAfterSlide'};

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
            if (this.core.outer.find(".".concat(this.linkClass)).get()) {
                return;
            }
            this.core.$toolbar.append("<button\n      type=\"button\"\n      aria-label=\"Toggle like\"\n      class=\"".concat(this.baseLinkClasses.join(' '), "\"\n   >\n                <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-heart-icon lucide-heart\"><path d=\"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z\"/></svg>\n            </button>"));
        };
        Likes.prototype.bindEvents = function () {
            var _this = this;
            this.core.LGel.on("".concat(lGEvents.afterOpen, ".likes"), function () {
                _this.updateLikesState(_this.core.index);
            });
            this.core.LGel.on("".concat(lGEvents.afterSlide, ".likes"), function (event) {
                _this.updateLikesState(event.detail.index);
            });
            this.core.LGel.on("".concat(lGEvents.updateSlides, ".likes"), function () {
                _this.updateLikesState(_this.core.index);
            });
            this.core.outer.on('click.likes', function (event) {
                var target = event.target;
                var likeButton = target === null || target === void 0 ? void 0 : target.closest(".".concat(_this.linkClass));
                if (!likeButton) {
                    return;
                }
                event.preventDefault();
                _this.toggleLike(_this.core.index);
            });
        };
        Likes.prototype.getImageId = function (index) {
            var _a, _b, _c, _d, _e;
            var sourceItem = (_a = this.core.items) === null || _a === void 0 ? void 0 : _a[index];
            return ((sourceItem === null || sourceItem === void 0 ? void 0 : sourceItem.getAttribute('data-image-id')) ||
                ((_b = sourceItem === null || sourceItem === void 0 ? void 0 : sourceItem.dataset) === null || _b === void 0 ? void 0 : _b.imageId) ||
                ((_e = (_d = (_c = this.core.galleryItems) === null || _c === void 0 ? void 0 : _c[index]) === null || _d === void 0 ? void 0 : _d.imageId) !== null && _e !== void 0 ? _e : '') + '');
        };
        Likes.prototype.getLikedState = function (index) {
            var _a, _b, _c;
            var sourceItem = (_a = this.core.items) === null || _a === void 0 ? void 0 : _a[index];
            var imageId = this.getImageId(index);
            var galleryItem = (_b = this.core.galleryItems) === null || _b === void 0 ? void 0 : _b[index];
            if (imageId &&
                document.querySelector(".sp-gallery-item-".concat(imageId, ".sp-gallery-item-liked"))) {
                return { imageId: imageId, liked: true, known: true };
            }
            var likedAttr = (_c = sourceItem === null || sourceItem === void 0 ? void 0 : sourceItem.getAttribute('data-liked')) !== null && _c !== void 0 ? _c : null;
            if (likedAttr === '1') {
                return { imageId: imageId, liked: true, known: true };
            }
            if (likedAttr === '0') {
                return { imageId: imageId, liked: false, known: true };
            }
            if (galleryItem &&
                (galleryItem.liked !== undefined || galleryItem.isLiked !== undefined)) {
                var likedValue = galleryItem.liked !== undefined
                    ? galleryItem.liked
                    : galleryItem.isLiked;
                return {
                    imageId: imageId,
                    liked: likedValue === true ||
                        likedValue === 1 ||
                        likedValue === '1',
                    known: true,
                };
            }
            return { imageId: imageId, liked: false, known: false };
        };
        Likes.prototype.getGalleryLikeIcon = function (imageId) {
            if (!imageId) {
                return null;
            }
            return document.querySelector(".sp-gallery-like-icon[data-image-id=\"".concat(imageId, "\"]"));
        };
        Likes.prototype.toggleLike = function (index) {
            var _this = this;
            var imageId = this.getImageId(index);
            var galleryLikeIcon = this.getGalleryLikeIcon(imageId);
            if (!galleryLikeIcon) {
                this.updateLikesState(index);
                return;
            }
            galleryLikeIcon.dispatchEvent(new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
            }));
            this.updateLikesState(index);
            window.setTimeout(function () { return _this.updateLikesState(index); }, 60);
            window.setTimeout(function () { return _this.updateLikesState(index); }, 180);
            window.setTimeout(function () { return _this.updateLikesState(index); }, 320);
        };
        Likes.prototype.updateLikesState = function (index) {
            var $btn = this.core.outer.find(".".concat(this.linkClass)).first();
            if (!$btn.get())
                return;
            $btn.removeClass('lg-hide');
            var likedState = this.getLikedState(index);
            if (likedState.imageId) {
                $btn.attr('data-image-id', likedState.imageId);
            }
            if (likedState.liked) {
                $btn.addClass('sp-gallery-liked-image');
            }
            else if (likedState.known) {
                $btn.removeClass('sp-gallery-liked-image');
            }
        };
        Likes.prototype.destroy = function () {
            this.core.outer.find(".".concat(this.linkClass)).remove();
            this.core.LGel.off('.likes');
        };
        Likes.pluginName = 'likes';
        return Likes;
    }());

    return Likes;

}));
